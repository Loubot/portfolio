'use strict';

var winston = require( 'winston' )
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // models.Category.hasMany( models.Photo, { as: 'photos'} )
      }
    }
  });


  Category.hook( 'beforeDestroy', function( category, options, fn ) {
    winston.debug( 'Category beforeDestroy hook' )
    // winston.debug( category.dataValues.photos[0].dataValues )
    var photo_ids = new Array()
    for (var i = category.dataValues.photos.length - 1; i >= 0; i--) {
        photo_ids.push( category.dataValues.photos[i].dataValues.id )
    }


    sequelize.models.Photo.destroy({
        where: { id: photo_ids }
    }).then( function( deleted ) {
        winston.debug( 'Bulk delete of photos' )
        winston.debug( deleted )
        fn( null, deleted )
    }).catch( function( err ) {
        winston.debug( 'Photos bulk delete failed' )
        winston.debug( err )
        fn( err )
    })
    /* Destroy all associated photos */
  })

  return Category;
};