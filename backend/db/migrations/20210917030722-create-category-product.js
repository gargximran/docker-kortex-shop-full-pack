'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CategoryProducts', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      categoryId:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Categories"
          },
          key: "id"
        }
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
    await queryInterface.dropTable('CategoryProducts');
  }
};