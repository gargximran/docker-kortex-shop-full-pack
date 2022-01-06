'use strict';
const faker = require('faker')


module.exports = {
    up: async (queryInterface, Sequelize) => {
        const userId = faker.datatype.uuid();
        const shopId = faker.datatype.uuid();
        const currencyId = faker.datatype.uuid();


        await queryInterface.bulkInsert('Currencies', [
            {
                id: currencyId,
                code: 'aud',
                icon: 'fake idcon',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

        await queryInterface.bulkInsert('Users', [{
            id: userId,
            fullName: faker.name.findName(),
            email: faker.internet.email(),
            password: '5ec99a3a75703e0365a55f097722e99cfe7919e45dfa794f2618a9862c544be6.bfc923e5e3e8aee5',
            //1234_Password
            createdAt: new Date(),
            updatedAt: new Date()
        }])

        await queryInterface.bulkInsert('Shops', [{
            id: shopId,
            userId: userId,
            name: faker.random.word(6),
            shopAddress: faker.address.streetAddress(true),
            defaultCurrency: 'aud',
            createdAt: new Date(),
            updatedAt: new Date()
        }])

        await queryInterface.bulkInsert('ShopCurrency', [
            {
                id: faker.datatype.uuid(),
                shopId: shopId,
                currencyId: currencyId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ])


        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('ShopCurrency', null, {});
        await queryInterface.bulkDelete('Users', null, {});
        await queryInterface.bulkDelete('Shops', null, {});
        await queryInterface.bulkDelete('Currencies', null, {});
    }
};
