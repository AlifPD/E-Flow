'use strict';

/** @type {import('sequelize-cli').Migration} */

const hashUsers = require("../seeders_data/user_data")
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = await hashUsers
    await queryInterface.bulkInsert('Users', userData, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
