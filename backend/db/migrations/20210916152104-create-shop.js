'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shops', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        min: 3,
        max: 25,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shopAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      slug:{
        type: Sequelize.STRING,
        min: 3,
        max: 100,
        unique: true,
        allowNull: false
      },
      defaultCurrency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'AUD'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Shops');
  }
};