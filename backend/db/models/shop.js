'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      
      this.belongsToMany(models.Currency, {
        through: models.ShopCurrency,
        foreignKey: 'currencyId',
        as: 'currencies'
      })
      this.hasMany(models.Category, { foreignKey: "shopId", as: "categories" });
      this.hasMany(models.Product, { foreignKey: "shopId", as: "products" });
      this.hasMany(models.Availability, {
        foreignKey: "shopId",
        as: "availabilities",
      });
      this.belongsToMany(models.PaymentMethod, {
        through: models.ShopPaymentMethod,
        as: "shops",
        foreignKey: "shopId",
      });
      this.hasMany(models.Order, {
        foreignKey: "shopId",
        as: "orders"
      });
      this.hasMany(models.Payment, {foreignKey: "shopId", as: "Payments"});
      this.hasMany(models.PickupOption, {foreignKey: "shopId", as: "pickup_options"});
      this.hasMany(models.DeliveryOption, {foreignKey: "shopId", as: "delivery_options"});
      this.hasMany(models.CartProduct, {foreignKey: "shopId", as: "cart_products"});
    }

  }
  Shop.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      min: 3,
      max: 25,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slug:{
      type: DataTypes.STRING,
      min: 3,
      max: 100,
      unique: true,
      allowNull: false
    },
    shopAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    defaultCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'AUD'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Shop',
    timestamps: true,
    paranoid: true,
    tableName: 'Shops'
  });
  return Shop;
}