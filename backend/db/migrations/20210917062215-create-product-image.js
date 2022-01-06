'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductImages', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productId:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Products"
          },
          key: "id"
        }
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
    await queryInterface.dropTable('ProductImages');
  }
};