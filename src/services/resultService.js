const Result = require("../utils/result")
const { Sequelize, DataTypes, QueryTypes, Transaction } = require('sequelize')
const dbConfig = require('../config/databases.json');
const { DATABASE_STATUS } = require("../utils/enum");
const logger = require("../utils/logger");
const db = require('../models')

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
            er."metricValue"
        from "ExploringResult" er
        join "Metric" m on m.id=er."metricId"
        join "DatabaseSystem" ds on ds.id=er."databaseId"
        ${condition}
    `)
    return new Result().setResult(metrics)
}