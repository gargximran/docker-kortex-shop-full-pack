'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop, Currency, Order } = models;
      this.belongsTo(Shop, {foreignKey: "shopId", as: "shop"});
      this.belongsTo(Currency, { foreignKey: "currencyId", as: "currency"});
      this.belongsTo(Order, {foreignKey: "orderId", as: "order"});
    }
  };
  Payment.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "Shops",
        },
        key: "id"
      }
    },
    currencyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "Currencies",
        },
        key: "id"
      }
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "Orders",
        },
        key: "id"
      }
    },
    totalPrice:{
      type: DataTypes.STRING,
      min: 1,
      max: 100,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('paid', 'cancelled'),
      allowNull: false
    },
    serverResponse:{
      type: DataTypes.STRING(999),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }
    ,updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }
    ,deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    } 
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true,
    paranoid: true
  });
  return Payment;
};