"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Product, CartProduct } = models;
      const { Shop, Category, CategoryProduct, ProductImage } = models;
      // define association here
      this.belongsTo(Shop, { foreignKey: "shopId", as: "shop" });

      this.belongsToMany(Category, {
        through: CategoryProduct,
        foreignKey: "productId",
        as: "categories",
      });

      this.hasMany(Product, {
        foreignKey: "parentId",
        as: "sub_products",
      });

      this.hasMany(ProductImage, {
        foreignKey: "productId",
        as: "product_images",
      });
      this.hasMany(CartProduct, {
        foreignKey: "productId",
        as: "cart_products",
      });
    }
    toJSON(){
      return {...this.get(), "CategoryProduct": undefined}
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        min: 4,
        max: 15,
        allowNull: false,
      },
      stock: {
        type: Number,
        allowNull: false,
      },
      status: {
        type: Boolean,
        allowNull: false,
        defaultValue: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      hasVariant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
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
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "Products",
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
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
      paranoid: true,
    }
  );
  return Product;
};
