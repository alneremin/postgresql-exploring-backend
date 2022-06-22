const Sequelize = require('sequelize');

// const dbConfig = {
//     "username": "test",
//     "password": "test",
//     "database": "test",
//     "host": "localhosе",
//     "dialect": "postgres"
// }

// const db = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const sequelize = new Sequelize("TEST", "SA", "fakePassw0rd", {
    dialect: "mssql",
    host: "localhost"
  });


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })


module.exports = sequelize;
