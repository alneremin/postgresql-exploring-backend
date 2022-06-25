'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable("ExploringTask", {
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
            type: Sequelize.UUID,
            references: {
                model: "Action",
                key: "id"
            }
        },
      }, {transaction})

      await transaction.commit()

      
      await queryInterface.addIndex("ExploringTask", {
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

      await queryInterface.dropTable("ExploringTask", {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
