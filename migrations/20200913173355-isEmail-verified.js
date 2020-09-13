'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'isEmailVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
    await queryInterface.addColumn('users', 'mailToken', {
      type: Sequelize.STRING(6)
    })
  },

  down: async (queryInterface,) => {
    await queryInterface.removeColumn('users', 'isEmailVerified')
    await queryInterface.removeColumn('users', 'mailToken')
  }
}
