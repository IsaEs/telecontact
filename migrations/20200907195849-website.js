'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('websites', {
      domainName: { type: Sequelize.STRING },
      url: { type: Sequelize.STRING, uniqe: true },
      formId: { type: Sequelize.STRING(12), primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      telegramId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'telegramId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      messageCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('websites')
  }
}
