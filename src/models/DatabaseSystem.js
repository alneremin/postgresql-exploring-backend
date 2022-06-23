'use strict'

module.exports = (sequelize, Sequelize) => {
    const DatabaseSystem = sequelize.define("DatabaseSystem", {
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

    return DatabaseSystem
}