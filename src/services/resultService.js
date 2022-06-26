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
            tasks.push({
                taskId: uuidv4(),
                metricId,
                actionId,
                rowCount: body.rowCount,
                databaseId: body.databaseIds[0],
                status: RESULT_STATUS.progress,
                createDate: moment(),
            })
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
        order by er."createDate" desc
    `)
    
    const rowCounts = positions.map(p => p.rowCount).filter(onlyUnique)
    const results = []
    
    for (const rowCount of rowCounts) {

        for (const metric of metrics) {
            const metricData = positions.filter(p => p.actionId == metric.actionId && 
                                    p.metricId == metric.metricId && rowCount == p.rowCount)
            
            const dbms1 = metricData.filter(p => body.databaseIds[0] == p.databaseId)    
            .sort((a,b) => moment(a.createDate) > moment(b.createDate))[0]

            const dbms2 = metricData.filter(p => body.databaseIds[1] == p.databaseId)    
            .sort((a,b) => moment(a.createDate) > moment(b.createDate))[0]
            
            if (dbms1?.metricValue || dbms2?.metricValue) {
                results.push({
                    metric: metric.metricName,
                    action: metric.actionName,
                    rowCount,
                    dbmsId1: body.databaseIds[0],
                    dbms1: dbms1?.metricValue ?? '-',
                    dbmsName1: databases.find(d => d.id == body.databaseIds[0]).name,
                    dbmsId2: body.databaseIds[1],
                    dbms2: dbms2?.metricValue ?? '-',
                    dbmsName2: databases.find(d => d.id == body.databaseIds[1]).name,
                })
            }
            
        }
    }

    return new Result().setResult(results)
}
