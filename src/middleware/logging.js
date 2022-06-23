
const logger = require('../utils/logger')

module.exports = (req, res, next) => {
    let id = generateRandomCode(4);
    logger.info(`Request ${req.method} ${id}: ${req.originalUrl}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`)
    let oldWrite = res.write;
    let oldEnd = res.end;

    let chunks = []

    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));

        oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(Buffer.from(chunk));
        let body = Buffer.concat(chunks).toString('utf8');
        logger.info(`Response ${req.method} ${id}: ${req.originalUrl}, response: ${body}`)

        oldEnd.apply(res, arguments);
    };

    next();
}

function generateRandomCode(length) {
    let possible = '0123456789'
    let string = ''
    for (let i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return string
}