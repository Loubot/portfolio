'use strict';

var winston = require( 'winston' )

module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Category.hasMany( models.Photo, { as: 'photos'} )
      }
    }
  });


  // Category.hook( 'beforeDestroy', function( category, options, fn ) {
  //   winston.debug( 'Category beforeDestroy hook' )
  //   winston.debug( category )
  //   fn( 'fail' )
  //   return false
  // })

  return Category;
};