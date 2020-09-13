'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('websites', 'messageCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('websites', 'messageCount')
  }
}
