
const moment = require('moment')

module.exports = async (db, rowCount) => {

    await db.Author.bulkCreate(db.Author.getTestData(rowCount))
    await db.Country.bulkCreate(db.Country.getTestData(rowCount))
    await db.Genre.bulkCreate(db.Genre.getTestData(rowCount))
    await db.Publisher.bulkCreate(db.Publisher.getTestData(rowCount))
}
