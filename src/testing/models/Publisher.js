'use strict'

const uuidv4 = require('uuid').v4 

module.exports = (sequelize, Sequelize) => {
    const Publisher = sequelize.define("Publisher", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        name: {
        type: Sequelize.STRING
        },

        web: {
        type: Sequelize.STRING
        },
    }, {
        timestamps: false
    })

    Publisher.getTestData = (rowCount) => {
        const data = []
        for (let i = 0; i < rowCount;i++){
            data.push({
                id: uuidv4(),
                name: "Nature",
                web: "https://www.nature.com/",
            })
        }
        return data
    }

    return Publisher
}