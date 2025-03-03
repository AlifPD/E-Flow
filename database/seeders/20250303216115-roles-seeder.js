'use strict';

/** @type {import('sequelize-cli').Migration} */

const roleData = require("../seeders_data/role_data")
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Roles', roleData, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {})
  }
};
