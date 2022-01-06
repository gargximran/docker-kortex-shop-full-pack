"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShopPaymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { PaymentMethod, Shop } = models;
      this.belongsTo(PaymentMethod, {
        foreignKey: "paymentMethodsId",
        as: "payment_method",
      });
      this.belongsTo(Shop, { foreignKey: "shopId", as: "shop" });
    }
  }
  ShopPaymentMethod.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      shopId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      paymentMethodsId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      accountDetail: {
        type: DataTypes.STRING,
        min: 1,
        max: 250,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    },
    {
      sequelize,
      modelName: "ShopPaymentMethod",
      tableName: "ShopPaymentMethods",
      timestamps: true,
      paranoid: true,
    }
  );
  return ShopPaymentMethod;
};
