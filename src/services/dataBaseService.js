const Result = require("../utils/result")
const dbConfig = require('../config/databases.json');
const { DATABASE_STATUS } = require("../utils/enum");
const logger = require("../utils/logger");
const db = require('../models')

exports.getDatabaseStatus = async () => {
    const result = new Result()
    const statuses = [];

    for (const name in dbConfig) {
        let data = await db.DatabaseSystem.findOne({
            where: {name: name}
        })
        if (!data) {
            data = await db.DatabaseSystem.create({name})
        }

        let status = DATABASE_STATUS.off
        try {
            await db.databases[name].authenticate()
            status = DATABASE_STATUS.on
        } catch (error) {
            // logger.logError(error)
        }

        statuses.push({ name, status, id: data.id })
    }

    return result.setResult(statuses)
}