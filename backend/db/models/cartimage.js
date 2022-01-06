'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { CartProduct } = models;
      this.belongsTo(CartProduct, {foreignKey: "cartId", as: "cart_products"});
    }
  };
  CartImage.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:{
          tableName: "CartProducts",
        },
        key: "id"
      }
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'CartImage',
    tableName: 'CartImages',
    timestamps: true,
    paranoid: true
  });
  return CartImage;
};