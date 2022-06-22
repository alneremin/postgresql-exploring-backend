

const configureApi = require("./controllers")

// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');


const logger = require('./utils/logger');

// Load .env Enviroment Variables to process.env

// require('mandatoryenv').load([
//     'DB_HOST',
//     'DB_DATABASE',
//     'DB_USER',
//     'DB_PASSWORD',
//     'PORT',
//     'SECRET'
// ]);

// const { PORT, HOST } = process.env;


// Instantiate an Express Application
const app = express();



// app.set('port', config.port || 3334)
// app.set('host', config.host || 'localhost')

// Configure Express App Instance
// app.use(express.json( { limit: '50mb' } ));
// app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

// app.use(cookieParser());
// app.use(helmet());

// // This middleware adds the json header to every response
// app.use('*', (req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Content-Type', 'application/xml');
//     next();
// })

app.use(cors());

// Handle errors
app.use(errorHandler());

configureApi(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

// Handle not valid route
// app.use('*', (req, res) => {
//     res
//     .status(404)
//     .json( {status: false, message: 'Endpoint Not Found'} );
// })

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });

app.use('/public', express.static(__dirname + '/public'))
const PORT=8888
const HOST="localhost"

// Open Server on selected Port
app.listen(
    PORT, HOST,
    () => console.info('Server listening on port', PORT)
);
