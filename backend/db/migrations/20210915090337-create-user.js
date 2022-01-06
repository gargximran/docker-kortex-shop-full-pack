'use strict';

const {UUIDV4} = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {BOOLEAN, STRING, UUID, DATE} = Sequelize;

    await queryInterface.createTable('Users', {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};