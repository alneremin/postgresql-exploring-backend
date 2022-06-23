'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable("Metric", {
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

      }, {transaction})

      await transaction.commit()

      
      await queryInterface.addIndex("Metric", {
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

      await queryInterface.dropTable("Metric", {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
