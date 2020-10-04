'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('preferences', {
      sendMail: {
        type: Sequelize.BOOLEAN, defaultValue: false
      },
      saveMessage: {
        type: Sequelize.BOOLEAN, defaultValue: false
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      formId: {
        type: Sequelize.STRING(12),
        primaryKey: true,
        references: {
          model: 'websites',
          key: 'formId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('preferences')
  }
}