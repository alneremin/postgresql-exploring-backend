const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes, QueryTypes, Transaction } = require('sequelize')
const db = {}
const basename = path.basename(__filename)
const dbConfig = require('../config/databases.json');

const env = 'development'

const db_config = require(path.join(__dirname + '/../config/sequelize-config.json'))[env]

const cls = require('cls-hooked')
const logemitter = require('../events/logemitter')

const ns = cls.createNamespace('models')

let sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {

    const model = require(path.join(__dirname, file))(sequelize, DataTypes, Sequelize.Op, QueryTypes)

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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

db.sequelize = sequelize
db.Sequelize = Sequelize
db.QueryTypes = QueryTypes
db.Transaction = Transaction

db.query = (query, options) => {
  
  return db.sequelize.query(query, options)
}

db.select = (query) => {
  return db.sequelize.query(query, { type: QueryTypes.SELECT, raw: true})
}

db.transaction = (callback) => {

  return db.sequelize.transaction({
    isolationLevel: db.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, callback)
}

db.databases = {}

for (const name in dbConfig) {
  const props = dbConfig[name]
  props.benchmark = true
  props.logging = function () {
    logemitter.emit('benchmark', arguments[1])
    // console.log('logging',arguments);
  }
  db.databases[name] = new Sequelize(props.database, props.username, props.password, props)
}

module.exports = db;
