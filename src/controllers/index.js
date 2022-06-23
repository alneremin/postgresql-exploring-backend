const tableController = require( "./tableController")
const databaseController = require( "./databaseController")
const metricController = require( "./metricController")
const resultController = require( "./resultController")

module.exports = (app) => {
    app.use("/api/settings", tableController)
    app.use("/api/database", databaseController)
    app.use("/api/metric", metricController)
    app.use("/api/result", resultController)
}
