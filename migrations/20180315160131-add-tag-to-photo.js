'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Photos',
        'tag',
      
        {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: " "
        }
        
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Photos', 'tag')
  }
};
