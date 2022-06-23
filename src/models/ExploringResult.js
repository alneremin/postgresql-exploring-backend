'use strict'

module.exports = (sequelize, Sequelize) => {
    const ExploringResult = sequelize.define("ExploringResult", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        metricId: {
            type: Sequelize.UUID,
            references: {
                model: "Metric",
                key: "id"
            }
        },

        metricValue: {
            type: Sequelize.STRING,
        },

        databaseId: {
            type: Sequelize.UUID,
            references: {
                model: "DatabaseSystem",
                key: "id"
            }
        },

        status: {
            type: Sequelize.STRING,
        },

        createDate: {
            type: Sequelize.DATE,
        },
    }, {
        timestamps: false
    })

    return ExploringResult
}