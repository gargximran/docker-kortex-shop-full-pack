'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Shop } = models;
      // define association here
      this.belongsTo(Shop, { foreignKey: "shopId", as: "shop" });
    }
  };
  Availability.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'Availabilities',
    modelName: 'Availability',
    timestamps: true,
    paranoid: true,
  });
  return Availability;
};