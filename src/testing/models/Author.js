'use strict'
const moment = require('moment')
const uuidv4 = require('uuid').v4 

module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define("Author", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
  
        name: {
            type: Sequelize.STRING
        },
  
        dateOfBirth: {
            type: Sequelize.DATE
        },
  
        dateOfDeath: {
          type: Sequelize.DATE
        },
  
        birthplace: {
          type: Sequelize.STRING
        },
    }, {
        timestamps: false
    })

    Author.getTestData = (rowCount) => {
        const data = []
        for (let i = 0; i < rowCount;i++){
            data.push({
                id: uuidv4(),
                name: "Jack Paris",
                dateOfDeath: moment(),
                dateOfBirth: moment().set('year', 1800),
                birthplace: "somewhere"
            })
        }
        return data
    }

    return Author
}