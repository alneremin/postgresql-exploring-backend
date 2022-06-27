const logEmitter = require("../events/logemitter")
const migration = require("../utils/migration")
const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const testing = require("../testing")
const { sleep } = require("../utils/helpers")
const { EXPLORING_ACTIONS } = require("../utils/enum")

exports.runTest = async (sequelize, task) => {
    const db = migration(sequelize)
    await db.migrate()
    this.prepareModels(db)
    await db.sequelize.authenticate()
    await this.prepareData(db, task)
    const result = await this.executeQuery(db, task)
    await db.revert()
    return result
}

exports.executeQuery = async (db, task) => {

    logEmitter.removeAllListeners();
    const values = []

    logEmitter.on('benchmark', (value) => {
        values.push(value);
    });

    await testing(db, task)
    console.log(values)
    await sleep(200)

    return values.reduce((prev, current) => prev + current, 0)
}

exports.prepareModels = (db) => {

    const baseFolder = path.join(process.cwd(), './src/testing/models')
    fs
    .readdirSync(baseFolder)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js')
    })
    .forEach(file => {

        const model = require(path.join(baseFolder, file))(db.sequelize, DataTypes, Sequelize.Op, QueryTypes)

        if (typeof (model) == "object") {
        for (let modelFunction in model) {
            db[modelFunction] = model[modelFunction]
        }
        } else {
        db[model.name] = model
        }

    })

    Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
    })
}

exports.prepareData = (db, task) => {
    if (EXPLORING_ACTIONS.simpleRead == task.action) {
        task.action = EXPLORING_ACTIONS.simpleWrite
        return testing(db, task)
    } else if (EXPLORING_ACTIONS.difficultRead == task.action) {
        task.action = EXPLORING_ACTIONS.difficultWrite
        return testing(db, task)
    }
    return null
}