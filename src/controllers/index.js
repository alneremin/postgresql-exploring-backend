const tableController = require( "./tableController")
const dataBasesController = require( "./dataBasesController")


module.exports = (app) => {
    app.use("/api/settings", tableController)
    app.use("/api/databases", dataBasesController)
}
