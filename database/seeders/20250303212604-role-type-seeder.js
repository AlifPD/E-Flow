'use strict';

/** @type {import('sequelize-cli').Migration} */

const roleTypeData = require("../seeders_data/role_type_data")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleTypes', roleTypeData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});

    await queryInterface.bulkDelete('RoleTypes', null, {});
  }
};
