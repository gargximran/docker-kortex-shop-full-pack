'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const {UUIDV4, UUID, STRING, DATE} = DataTypes;
  class UserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      })
    }
  };
  UserToken.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: {
          tableName: "Users"
        },
        key: "id"
      }
    },
    token: {
      type:STRING,
      min: 10,
      max: 255,
      unique: true,
      allowNull: false
    },
    expiredAt: {
      type: DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DATE
    },
    updatedAt: {
      allowNull: false,
      type: DATE
    }
  }, {
    sequelize,
    modelName: 'UserToken',
    tableName: 'UserTokens'
  });
  return UserToken;
};