'use strict'

module.exports = (sequelize, Sequelize) => {
    const ExploringTask = sequelize.define("ExploringTask", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        rowCount: {
            type: Sequelize.INTEGER
        },

        actionId: {
            type: Sequelize.STRING,
            references: {
                model: "Action",
                key: "id"
            }
        },

    }, {
        timestamps: false
    })

    return ExploringTask
}