'use strict'

const moment = require('moment')
const uuidv4 = require('uuid').v4 

module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("Country", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        code: {
        type: Sequelize.STRING
        },

        name: {
        type: Sequelize.STRING
        },
  
    }, {
        timestamps: false
    })

    Country.getTestData = (rowCount) => {
        const data = []
        for (let i = 0; i < rowCount;i++){
            data.push({
                id: uuidv4(),
                name: "Neverland",
                code: "888"
            })
        }
        return data
    }

    return Country
}