const Result = require("../utils/result")
const { Sequelize, DataTypes, QueryTypes, Transaction } = require('sequelize')
const dbConfig = require('../config/databases.json');
const { DATABASE_STATUS } = require("../utils/enum");
const logger = require("../utils/logger");
// const db = require('../models')

exports.getDatabaseStatus = async () => {
    const result = new Result()
    const statuses = [];

    for (const name in dbConfig) {
        let status = DATABASE_STATUS.off
        try {
            const db = dbConfig[name]
            const database = new Sequelize(db.database, db.username, db.password, db)
            await database.authenticate()
            status = DATABASE_STATUS.on
        } catch (error) {
            // logger.logError(error)
        }

        statuses.push({ name, status })
    }

    return result.setResult(statuses)
}