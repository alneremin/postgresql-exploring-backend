

module.exports = async (db, rowCount) => {

    const data = []
    for (let i = 0; i < rowCount; i++) {
        data.push({
            name: "Jack London",
            dateOfDeath: moment(),
            dateOfBirth: moment(),
            birthplace: "somewhere"
        })
    }
    await db.Author.bulkCreate(data)
}