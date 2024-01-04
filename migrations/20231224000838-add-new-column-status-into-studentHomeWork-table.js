'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('studentHomeworks', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Did NOT Finish'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('studentHomeworks', 'status')
  }
};
