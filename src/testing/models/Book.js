'use strict'
const uuidv4 = require('uuid').v4 

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("Book", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
  
        title: {
            type: Sequelize.STRING
        },
  
        genreId: {
            type: Sequelize.UUID,
            references: {
              model: "Genre",
              key: "id"
            }
        },
  
        publisherId: {
          type: Sequelize.UUID,
          references: {
            model: "Publisher",
            key: "id"
          }
        },
  
        countryId: {
          type: Sequelize.UUID,
          references: {
            model: "Country",
            key: "id"
          }
        },
    }, {
        timestamps: false
    })

    Book.getTestData = (options) => {
      const {
        country, genre, publisher, rowCount
      } = options

      const data = []
      for (let i = 0; i < rowCount;i++){
          data.push({
              id: uuidv4(),
              title: "no more pufique, pls",
              genreId: genre[i].id,
              countryId: country[i].id,
              publisherId: publisher[i].id,
          })
      }
      return data
    }

    return Book
}