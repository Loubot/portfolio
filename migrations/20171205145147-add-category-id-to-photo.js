'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Photos',
        'CategoryId',
      
        Sequelize.INTEGER
      )
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.removeColumn('Photos', 'CategoryId')
  }
};
