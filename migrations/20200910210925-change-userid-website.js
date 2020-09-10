'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('websites', 'userId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('websites', 'userId', {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL'
    })
  }
}
