

module.exports = async (db) => {
    await db.Author.findAll()
}