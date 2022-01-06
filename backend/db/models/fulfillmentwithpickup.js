'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FulfillmentWithPickup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop, Currency, Order, PickupOption } = models;
      this.belongsTo(Shop, {foreignKey: 'shopId', as: 'shop'});
      // this.belongsTo(Currency, {foreignKey: 'currencyCode', as: 'currency'});
      this.belongsTo(Order, {foreignKey: 'orderId', as: 'order'});
      this.belongsTo(PickupOption, {foreignKey: 'pickupOptionId', as: 'pickup_option'});

    }
  };
  FulfillmentWithPickup.init({
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
        model: {
          tableName: "Shops",
        },
        key: "id",
      },
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
    pickupOptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "PickupOptions",
        },
        key: "id"
      }
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:{
      type: DataTypes.STRING,
      min: 1,
      max: 100,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(999),
      allowNull: false
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
    modelName: 'FulfillmentWithPickup',
    tableName: 'FulfillmentWithPickups',
    timestamps: true,
    paranoid: true
  });
  return FulfillmentWithPickup;
};