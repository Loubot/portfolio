'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Photos',
        'main',
      
        Sequelize.BOOLEAN
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Photos', 'main')
  }
};
