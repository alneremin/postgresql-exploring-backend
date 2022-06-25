
const configureApi = require("./controllers")
const {inject} = require('express-custom-error');
inject();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configureShutdown = require("./config/shutdownConfig")
const logging = require('./middleware/logging');
const errorHandling = require('./middleware/errorHandling')
const workers = require("./workers")

const app = express();

app.use(logging);
app.use(errorHandling);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.use(cors());

configureApi(app)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

app.use('/public', express.static(__dirname + '/public'))
const PORT=8888
const HOST="localhost"

// Open Server on selected Port
const server = app.listen(
    PORT, HOST,
    () => console.info('Server listening on port', PORT)
);

configureShutdown(server)

workers.startWorkers()