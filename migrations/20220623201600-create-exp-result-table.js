'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable("ExploringResult", {
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
      }, {transaction})

      await transaction.commit()

      
      await queryInterface.addIndex("ExploringResult", {
        fields: ["id"],
        unique: true
      })

    } catch (error) {
      transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.dropTable("ExploringResult", {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
