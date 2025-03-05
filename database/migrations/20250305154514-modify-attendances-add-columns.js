'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Attendances', 'evidence', 'evidence_clock_in');

    await queryInterface.addColumn('Attendances', 'evidence_clock_out', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Attendances', 'evidence_clock_in', 'evidence');

    await queryInterface.removeColumn('Attendances', 'evidence_clock_out');
  }
};