'use strict';

/** @type {import('sequelize-cli').Migration} */

const roleTypeData = require("../seeders_data/role_type_data")
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('RoleTypes', roleTypeData)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('RoleTypes', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
  }
};
