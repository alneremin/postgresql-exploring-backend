const cron =  require("node-cron");
const logger = require("../utils/logger");
const db = require('../models');
const { RESULT_STATUS, DATABASE_STATUS } = require("../utils/enum");
const { Op } = require("sequelize");
const analyzeService = require("../services/analyzeService");
const { getDatabaseStatus } = require("../services/databaseService");

async function analyze() {
    try {
        const statuses = await getDatabaseStatus()

        const results = await db.ExploringResult.findAll({
            where: {
              status: {[Op.not]: RESULT_STATUS.complete},
              databaseId: statuses.result.filter(s => s.status == DATABASE_STATUS.on)
              .map(s => s.id)
            },
            limit: 5,
        })

        await db.transaction(async (transaction) => {
            for (const res of results) {

              try {
                const dbms = await db.DatabaseSystem.findByPk(res.databaseId)
                const task = await db.ExploringTask.findByPk(res.taskId)
                const action = await db.Action.findByPk(task.actionId)
                task.metric = res.metric
                task.action = action.name
                
                const result = await analyzeService.runTest(db.databases[dbms.name], task)
                //...
                console.log(result)
                res.metricValue = result
                res.status = RESULT_STATUS.complete
                await res.save({transaction})
              } catch (e) {
                logger.logError(e)
                res.status = RESULT_STATUS.error
                await res.save({transaction})
              }
            }
        })
        
    } catch (error) {
        logger.logError(error);
    }
}

const task = cron.schedule('* * * * *', analyze, { scheduled: false });

module.exports = task;

analyze()