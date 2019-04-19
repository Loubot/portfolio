'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Photos',
        'tag',
      
        {
            type: Sequelize.TEXT
        }
        
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(
     queryInterface.removeColumn('Photos', 'tag'))
  }
};
