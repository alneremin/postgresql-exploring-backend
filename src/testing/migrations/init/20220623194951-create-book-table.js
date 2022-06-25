'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable("Book", {
      id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
      },

      title: {
          type: Sequelize.STRING
      },

      genreId: {
          type: Sequelize.UUID,
          references: {
            model: "Genre",
            key: "id"
          }
      },

      publisherId: {
        type: Sequelize.UUID,
        references: {
          model: "Publisher",
          key: "id"
        }
      },

      countryId: {
        type: Sequelize.UUID,
        references: {
          model: "Country",
          key: "id"
        }
      },

      }, {transaction})

      await transaction.commit()

    } catch (error) {
      transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.dropTable("Book", {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
