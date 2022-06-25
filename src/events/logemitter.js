const EventEmitter = require('events');

class LoggingEmitter extends EventEmitter {}

const logEmitter = new LoggingEmitter();

logEmitter.setMaxListeners(100)
module.exports = logEmitter