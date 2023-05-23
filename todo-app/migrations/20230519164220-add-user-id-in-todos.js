'use strict';

/** @type {import('sequelize-cli').Migration} **/
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the following lines
    // await queryInterface.addColumn('Todos', 'userId', {
    //   type: Sequelize.DataTypes.INTEGER
    // })

    // await queryInterface.addConstraint('Todos', {
    //   fields: ['userId'],
    //   type: 'foreign key',
    //   references: {
    //     table: 'Users',
    //     field: 'id'
    //   }
    // })

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    // Remove the following line
    // await queryInterface.removeColumn('Todos', 'userId')
  }
};
