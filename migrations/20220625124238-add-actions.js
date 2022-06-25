'use strict';

const { EXPLORING_ACTIONS } = require("../src/utils/enum");
const uuidv4 = require('uuid').v4
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      for (const action of Object.values(EXPLORING_ACTIONS)) {
        await queryInterface.sequelize.query(`
        INSERT INTO public.\"Action\" VALUES ('${uuidv4()}', '${action}')
      `, {transaction})
      }
      
      await transaction.commit()

    } catch (error) {
      transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.sequelize.query(`
      DELETE FROM public.\"Action\"
    `, {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
