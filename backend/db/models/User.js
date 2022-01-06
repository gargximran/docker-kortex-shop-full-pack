'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const {UUID, UUIDV4, STRING, BOOLEAN, DATE} = DataTypes;

    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.UserToken, {
                as: 'userToken',
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            })

            this.hasOne(models.Shop, {
                as: 'shop',
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            })
        }
        // toJSON(){
        //     return {...this.get(), password: undefined, createdAt: undefined, updatedAt: undefined, deletedAt: undefined}
        // }
        
    };
    User.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: UUID,
            defaultValue: UUIDV4
        },
        fullName: {
            type: STRING,
            max: 20,
            min: 1,
            allowNull: true,
        },
        email: {
            type: STRING,
            allowNull: false,
            unique: true,
            min: 8
        },
        password: {
            type: STRING,
            min: 16,
            allowNull: false,
        },
        isVerified: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            allowNull: false,
            type: DATE
        },
        updatedAt: {
            allowNull: false,
            type: DATE
        },
        deletedAt: {
            allowNull: true,
            type: DATE
        }
    }, {
        sequelize,
        modelName: 'User',
        paranoid: true,
        tableName: 'Users'
    });
    return User;
};