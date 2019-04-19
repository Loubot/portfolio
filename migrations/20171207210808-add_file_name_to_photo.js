'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Photos',
        'fileName',
      
        Sequelize.STRING
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(
      queryInterface.removeColumn('Photos', 'fileName'))
  }
};
