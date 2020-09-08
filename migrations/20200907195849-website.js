'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('websites', {
      url: { type: Sequelize.STRING },
      formId: { type: Sequelize.UUID, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('websites')
  }
}
