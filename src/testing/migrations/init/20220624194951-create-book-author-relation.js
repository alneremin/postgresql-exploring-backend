'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable("BookAuthors", {

      bookId: {
          type: Sequelize.UUID,
          primaryKey: true,
          references: {
            model: "Book",
            key: "id"
          }
      },

      authorId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: "Author",
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

      await queryInterface.dropTable("BookAuthors", {transaction})

      await transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
