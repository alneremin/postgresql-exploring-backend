

module.exports = async (db) => {
    await db.Author.findAll()
    await db.Book.findAll()
    await db.BookAuthors.findAll()
    await db.Country.findAll()
    await db.Genre.findAll()
    await db.Publisher.findAll()
}