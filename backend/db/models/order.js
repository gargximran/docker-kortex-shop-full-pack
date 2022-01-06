'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop, Payment, FulfillmentWithDelivery, FulfillmentWithPickup, CartProduct } = models;
      this.belongsTo(Shop, {foreignKey: "shopId", as: "shop"});
      this.hasMany(Payment, {foreignKey: "orderId", as: "payments"});
      this.hasOne(FulfillmentWithPickup, {foreignKey: 'orderId', as: 'fullfillment_with_pickup'});
      this.hasOne(FulfillmentWithDelivery, {foreignKey: 'orderId', as: 'fullfillment_with_delivery'});
      this.hasMany(CartProduct, {foreignKey: "orderId", as: "cart_products"});

    }
  };
  Order.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      min: 3,
      max: 15,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      min: 7,
      max: 15,
      allowNull: true
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
    email: {
      type: DataTypes.STRING,
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    giftReceiverName: {
      type: DataTypes.STRING,
      min: 3,
      max: 15,
      allowNull: true
    },
    giftReceiverPhone: {
      type: DataTypes.STRING,
      min: 7,
      max: 15,
      allowNull: true
    },
    giftReceiverEmail: {
      type: DataTypes.STRING,
      min: 10,
      max: 25,
      allowNull: true
    },
    fulfillmentType: {
      type: DataTypes.ENUM('pickup', 'delivery'),
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      min: 1,
      max: 100
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ordered', 'fulfilled', 'cancelled'),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      allowNull: false
    },
    fulfillmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
    paranoid: true
  });
  return Order;
};