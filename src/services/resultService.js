const Result = require("../utils/result")
const { RESULT_STATUS } = require("../utils/enum");
const db = require('../models')
const moment = require('moment')

exports.getResult = async (query) => {
    
    let condition = 'where true'
    if (query.query) {
        condition += ` and ds.name ilike '%${query.query}%'`
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
            er."metricValue",
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

exports.compareDatabase = async (body) => {
    
    if (!body.databaseIds?.length) {
        return new Result().setErrorAndStatus(405, "Не задано СУБД для анализа")
    }

    if (!body.metricIds?.length) {
        return new Result().setErrorAndStatus(405, "Не заданы метрики для анализа")
    }
    if (!body.actionIds?.length) {
        return new Result().setErrorAndStatus(405, "Не заданы действия для анализа")
    }

    const tasks = body.metricIds.map(metricId => {
        body.actionIds.map(actionId => {
            return {
                metricId,
                actionId,
                rowCount: body.rowCount,
                databaseId: body.databaseIds[0],
                status: RESULT_STATUS.progress,
                createDate: moment(),
            }
        })
    })

    await db.ExploringTask.bulkCreate(tasks)
    await db.ExploringResult.bulkCreate(tasks)

    return this.getResult({metric: body.metricIds.reduce((acc, val) => acc + ';' + val)})
}
