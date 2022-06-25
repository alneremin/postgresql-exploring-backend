const { format, transports, createLogger } = require("winston")
const { combine, colorize, align, timestamp, printf } = format
const DailyRotateFile = require('winston-daily-rotate-file')

const myFormat = printf(({ level, message, timestamp, ...args }) => {
  return `${timestamp} [${level}] ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
})


const commonLoggerConfig = {
  dirname: `logs`,
  lever: 'debug',
  filename: '%DATE%',
  zippedArchive: true,
  extension: '.log',
  datePattern: 'YYYY-MM-DD',
  format: combine(timestamp(), align(), myFormat)
}

const consoleTransport = new transports.Console({
  level: "debug",
  format: combine(timestamp(), colorize(), align(), myFormat)
})

const commonOptions = [new DailyRotateFile(commonLoggerConfig)]

const options = {
  transports: [...commonOptions]
}

const logger = createLogger(options)

logger.logError = function (error) {
  logger.error({
    message: error.message,
    name: error.name,
    location: error.stack
  })
}

module.exports = logger