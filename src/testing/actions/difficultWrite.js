
const moment = require('moment')

module.exports = async (db, rowCount) => {

    const primaryTestData = {
        rowCount, 
        author: db.Author.getTestData(rowCount),
        country: db.Country.getTestData(rowCount),
        genre: db.Genre.getTestData(rowCount),
        publisher: db.Author.getTestData(rowCount),
    }
    primaryTestData.book = db.Book.getTestData(primaryTestData)
    primaryTestData.bookAuthorsRelation = db.BookAuthors.getTestData(primaryTestData)

    await db.Author.bulkCreate(primaryTestData.author)
    await db.Country.bulkCreate(primaryTestData.country)
    await db.Genre.bulkCreate(primaryTestData.genre)
    await db.Publisher.bulkCreate(primaryTestData.publisher)
    await db.Book.bulkCreate(primaryTestData.book)
    await db.BookAuthors.bulkCreate(primaryTestData.bookAuthorsRelation)
}
