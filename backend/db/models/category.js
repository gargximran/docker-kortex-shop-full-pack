"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Shop, Product, CategoryProduct } = models;
      this.belongsTo(Shop, { foreignKey: "shopId", as: "shop" });
      this.belongsToMany(Product, {
        through: CategoryProduct,
        foreignKey: "categoryId",
        as: "products"
      });
    }
    toJSON(){
      return {...this.get(), CategoryProduct: undefined}
    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        min: 2,
        max: 14,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        min: 2,
        max: 20,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "Category",
      tableName: "Categories",
      timestamps: true,
      paranoid: true,
    }
  );
  return Category;
};
