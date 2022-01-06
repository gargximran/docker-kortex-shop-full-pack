'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CartImages', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: "CartProducts",
          },
          key: "id"
        }
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('CartImages');
  }
};