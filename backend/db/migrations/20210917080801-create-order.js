'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      customerName: {
        type: Sequelize.STRING,
        min: 3,
        max: 15,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        min: 7,
        max: 15,
        allowNull: true
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
      email: {
        type: Sequelize.STRING,
        min: 10,
        max: 25,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Please enter valid email address'
          },
        }
      },
      isGift: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      giftReceiverName: {
        type: Sequelize.STRING,
        min: 3,
        max: 15,
        allowNull: true
      },
      giftReceiverPhone: {
        type: Sequelize.STRING,
        min: 7,
        max: 15,
        allowNull: true
      },
      giftReceiverEmail: {
        type: Sequelize.STRING,
        min: 10,
        max: 25,
        allowNull: true
      },
      fulfillmentType: {
        type: Sequelize.ENUM('pickup', 'delivery'),
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 1,
        max: 100
      },
      currencyCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ordered', 'fulfilled', 'cancelled'),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'unpaid'),
        allowNull: false
      },
      fulfillmentDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Orders');
  }
};