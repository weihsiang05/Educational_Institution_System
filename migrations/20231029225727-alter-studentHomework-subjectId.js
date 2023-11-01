'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('studentHomeworks', 'subjectId', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('studentHomeworks', 'subjectId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
};
