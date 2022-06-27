'use strict'

const uuidv4 = require('uuid').v4 

module.exports = (sequelize, Sequelize) => {
    const Genre = sequelize.define("Genre", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        name: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: false
    })

    Genre.getTestData = (rowCount) => {
        const data = []
        for (let i = 0; i < rowCount;i++){
            data.push({
                id: uuidv4(),
                name: "requiem",
            })
        }
        return data
    }

    return Genre
}