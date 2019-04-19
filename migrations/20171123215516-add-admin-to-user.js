'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Users',
        'admin',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(
      queryInterface.removeColumn('Users', 'admin'))
  }
};
