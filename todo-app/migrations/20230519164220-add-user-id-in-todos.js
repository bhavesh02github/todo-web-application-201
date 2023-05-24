'use strict';

/** @type {import('sequelize-cli').Migration} **/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos', 'userId', {
    type: Sequelize.DataTypes.INTEGER
    })

    await queryInterface.addConstraint('Todos', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
      table: 'Users',
      field: 'id'
      }
    })
    // await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'userId')
  }
};
