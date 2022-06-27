const Result = require("../utils/result")
const { RESULT_STATUS } = require("../utils/enum");
const db = require('../models')
const moment = require('moment');
const { onlyUnique } = require("../utils/helpers");
const uuidv4 = require('uuid').v4

exports.getResult = async (query) => {
    
    let condition = 'where true'
    if (query.query) {
        condition += ` and 
        ((ds.name ilike '%${query.query}%')
        or (m.name ilike '%${query.query}%')
        or (er.status ilike '%${query.query}%')
        or (a.name ilike '%${query.query}%')
        or (et."rowCount"::text ilike '%${query.query}%'))`
    }

    if (query.metric) {
        const metrics = query.metric.split(';')
        if (metrics.length > 0) {
            condition += ` and er."metricId" in (
                ${metrics.map(m => `'${m}'`).reduce((acc, val) => acc + ' , ' + val)}
            )`
        }
    } else {
        return new Result().setResult([])
    }

    const metrics = await db.select(`
        select
            er."databaseId",
            er."metricId",
            ds.name as "databaseName",
            m.name as "metricName",
            er."createDate",
            er.status,
            er."metricValue" || ' ' || m.type as "metricValue",
            et."actionId",
            a.name as "action",
            et."rowCount"
        from "ExploringResult" er
        join "Metric" m on m.id=er."metricId"
        join "DatabaseSystem" ds on ds.id=er."databaseId"
        join "ExploringTask" et on et.id=er."taskId"
        join "Action" a on a.id=et."actionId"
        ${condition}
        order by er."createDate" desc
    `)
    return new Result().setResult(metrics)
}

exports.addTask = async (body) => {
    
    if (!body.databaseIds?.length) {
        return new Result().setErrorAndStatus(405, "Не задано СУБД для анализа")
    }

    if (!body.metricIds?.length) {
        return new Result().setErrorAndStatus(405, "Не заданы метрики для анализа")
    }
    if (!body.actionIds?.length) {
        return new Result().setErrorAndStatus(405, "Не заданы действия для анализа")
    }

    const tasks = []
    for (const metricId of body.metricIds) {
        for (const actionId of body.actionIds) {
            for (const databaseId of body.databaseIds) {
                tasks.push({
                    taskId: uuidv4(),
                    metricId,
                    actionId,
                    rowCount: body.rowCount,
                    databaseId,
                    status: RESULT_STATUS.progress,
                    createDate: moment(),
                })
            }
        }
    }

    await db.ExploringTask.bulkCreate(tasks.map(t => { t.id = t.taskId; return t}))
    await db.ExploringResult.bulkCreate(tasks)

    return this.getResult({metric: body.metricIds.reduce((acc, val) => acc + ';' + val)})
}

exports.compareDatabase = async (body) => {
    
    if (!body.databaseIds?.length) {
        return new Result().setErrorAndStatus(405, "Не заданы СУБД для сравнения")
    }

    const metrics = await db.select(`
        select
            m.id as "metricId",
            a.id as "actionId",
            m.name as "metricName",
            a.name as "actionName"
        from "Metric" m
        join "Action" a on true
    `)

    const databases = await db.DatabaseSystem.findAll({
        where: {id: body.databaseIds}
    })

    const positions = await db.select(`
        select
            er."databaseId",
            er."metricId",
            ds.name as "databaseName",
            m.name as "metricName",
            er."createDate",
            er.status,
            er."metricValue" || ' ' || m.type as "metricValue",
            et."actionId",
            a.name as "action",
            et."rowCount"
        from "ExploringResult" er
        join "Metric" m on m.id=er."metricId"
        join "DatabaseSystem" ds on ds.id=er."databaseId"
        join "ExploringTask" et on et.id=er."taskId"
        join "Action" a on a.id=et."actionId"
        where er."databaseId" in (
            ${body.databaseIds.map(d => `'${d}'`).reduce((acc, val) => acc + ' , ' + val)}
        )
        and er.status = '${RESULT_STATUS.complete}'
        order by er."createDate" desc
    `)
    
    const rowCounts = positions.map(p => p.rowCount).filter(onlyUnique)
    const results = []
    
    for (const rowCount of rowCounts) {

        for (const metric of metrics) {
            const metricData = positions.filter(p => p.actionId == metric.actionId && 
                                    p.metricId == metric.metricId && rowCount == p.rowCount &&
                                    body.databaseIds.includes(p.databaseId))
            
            if (metricData.length) {

                const data = {
                    metric: metric.metricName,
                    action: metric.actionName,
                    rowCount,
                    dbInfo: []
                }

                body.databaseIds.forEach((databaseId, i) => {
                    key = databases.find(d => d.id == databaseId).name
                    data.dbInfo.push({
                        dbmsValue: metricData.filter(p => databaseId == p.databaseId)    
                        .sort((a,b) => moment(a.createDate) > moment(b.createDate))[0]?.metricValue ?? '-',
                        dbmsName: key,
                        dbmsId: databaseId
                    })
                })

                results.push(data)
            }
            
        }
    }

    return new Result().setResult(results)
}
