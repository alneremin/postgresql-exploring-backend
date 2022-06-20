
const tableController = require( "./tableController")

module.exports = (app) => {

    app.use("/api/settings", tableController)
}
