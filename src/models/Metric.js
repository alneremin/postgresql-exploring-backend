'use strict'

module.exports = (sequelize, Sequelize) => {
    const Metric = sequelize.define("Metric", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

        name: {
            type: Sequelize.STRING
        },

        type: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: false
    })

    return Metric
}