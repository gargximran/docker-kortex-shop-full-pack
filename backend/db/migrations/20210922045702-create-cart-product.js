'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CartProducts', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: "Products",
          },
          key: "id"
        }
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: "Orders",
          },
          key: "id"
        }
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
      productName: {
        type: Sequelize.STRING,
        min: 4,
        max: 15,
        allowNull: false
      },
      singlePrice: {
        type: Sequelize.STRING,
        min: 1,
        max: 100,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.STRING,
        min: 1,
        max: 100,
        allowNull: false
      },
      unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('CartProducts');
  }
};