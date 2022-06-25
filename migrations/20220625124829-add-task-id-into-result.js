'use strict';

const { EXPLORING_ACTIONS } = require("../src/utils/enum");
const uuidv4 = require('uuid').v4
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.addColumn("ExploringResult", "taskId", {
        type: Sequelize.UUID,
        references: {
          model: "ExploringTask",
          key: "id"
        }

      }, { transaction })
      
      await transaction.commit()

    } catch (error) {
      transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.removeColumn("ExploringResult", "taskId", { transaction })


      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
