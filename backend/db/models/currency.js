'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Shop, {
        as: 'shops',
        through: models.ShopCurrency,
        foreignKey: 'shopId'
      });
      this.hasMany(models.Payment, {foreignKey: "currencyId", as: "payments"});
    }
  };
  Currency.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    code: {
      type: DataTypes.STRING,
      min: 2,
      max: 4,
      unique: true,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Currency',
    tableName: 'Currencies'
  });
  return Currency;
};