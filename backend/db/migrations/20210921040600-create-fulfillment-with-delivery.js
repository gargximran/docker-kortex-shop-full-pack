'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FulfillmentWithDeliveries', {
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
      deliveryOptionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: "DeliveryOptions",
          },
          key: "id"
        }
      },
      deliveryAddress: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('FulfillmentWithDeliveries');
  }
};