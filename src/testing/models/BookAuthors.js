'use strict'

module.exports = (sequelize, Sequelize) => {
    const BookAuthors = sequelize.define("BookAuthors", {
        
    bookId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: "Book",
          key: "id"
        }
    },

    authorId: {
      type: Sequelize.UUID,
      primaryKey: true,
      references: {
        model: "Author",
        key: "id"
      }
    },
    }, {
        timestamps: false
    })

    BookAuthors.getTestData = (options) => {
      const {
        author, rowCount, book
      } = options

      const data = []
      for (let i = 0; i < rowCount;i++){
          data.push({
              bookId: book[i].id,
              authorId: author[i].id,
          })
      }
      return data
    }

    return BookAuthors
}