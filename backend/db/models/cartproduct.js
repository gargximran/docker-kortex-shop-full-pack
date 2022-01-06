'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop, Product, Order, CartImage } = models;
      this.belongsTo(Shop, {foreignKey: "shopId", as: "shop" });
      this.belongsTo(Product, {foreignKey: "productId", as: "product"});
      this.belongsTo(Order, {foreignKey: "orderId", as: "order"});
      this.hasMany(CartImage, {foreignKey: "cartId", as: "cart_images"});
    }
  };
  CartProduct.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "Products",
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
    productName: {
      type: DataTypes.STRING,
      min: 4,
      max: 15,
      allowNull: false
    },
    singlePrice: {
      type: DataTypes.STRING,
      min: 1,
      max: 100,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.STRING,
      min: 1,
      max: 100,
      allowNull: false
    },
    unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING,
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
    modelName: 'CartProduct',
    tableName: 'CartProducts',
    timestamps: true,
    paranoid: true
  });
  return CartProduct;
};