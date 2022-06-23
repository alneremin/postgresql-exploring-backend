const Result = require("../utils/result")
const { Sequelize, DataTypes, QueryTypes, Transaction } = require('sequelize')
const dbConfig = require('../config/databases.json');
const { DATABASE_STATUS } = require("../utils/enum");
const logger = require("../utils/logger");
const db = require('../models')

exports.getMetrics = async () => {
    
    const metrics = await db.Metric.findAll()
    return new Result().setResult(metrics)
}