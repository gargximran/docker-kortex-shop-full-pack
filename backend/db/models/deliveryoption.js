'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop } = models;
      this.belongsTo(Shop, {foreignKey: 'shopId', as: 'shop'});
    }
  };
  DeliveryOption.init({
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
    title: {
      type: DataTypes.STRING,
      min: 5,
      max: 50,
      allowNull: false
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
    cityName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(999),
      allowNull: false
    },
    serverResponse: {
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
    modelName: 'DeliveryOption',
    tableName: 'DeliveryOptions',
    timestamps: true,
    paranoid: true
  });
  return DeliveryOption;
};