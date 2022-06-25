'use strict'

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

    return Author
}