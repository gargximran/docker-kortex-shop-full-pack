'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PickupOptions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      shopId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: "Shops",
          },
          key: "id"
        }
      },
      title: {
        type: Sequelize.STRING,
        min: 5,
        max: 50,
        allowNull: false
      },
      cityName: {
        type: Sequelize.STRING(999),
        allowNull: false
      },
      currencyCode: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      price:{
        type: Sequelize.STRING,
        min: 1,
        max: 100,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(999),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }
      ,updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }
      ,deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      } 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PickupOptions');
  }
};