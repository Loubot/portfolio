var winston = require( 'winston' )
let models = require( '../models' )

'use strict';
module.exports = (sequelize, DataTypes) => {
    var subCategory = sequelize.define('subCategory', {
        // photoID: DataTypes.INTEGER,
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                // models.subCategory.belongsTo(models.Category)
                // models.subCategory.hasMany(models.Photo, {
                //     as: 'photos'
                // })
            }
        }
    });

    subCategory.hook( 'beforeDestroy', function( category, options, fn ) {
        winston.debug( 'subCategory beforeDestroy hook' )
        winston.debug( category.dataValues )
        winston.debug( 'Try to find all photos with subCategoryId' )
        sequelize.models.Photo.findAll({
            where: { subCategoryId: category.dataValues.id }
        }).then( photos => {
            winston.debug( 'Found all photos with subCategoryId' )
            let photos_arr = []
            winston.debug( photos )
            photos.forEach( photo => {
                photos_arr.push( photo.dataValues.id )
            })
            winston.debug( photos_arr )
            sequelize.models.Photo.destroy({
                where: { id: photos_arr }
            }).then( deleted => {
                winston.debug( 'Deleted all photos' )
                winston.debug( deleted )
                fn( null, deleted )
            }).catch( err => {
                winston.debug( 'Failed to delete photos' )
                winston.debug( err )
                fn( err )
            })
            
        }).catch( err => {
            winston.debug( 'Failed to find photos' )
            winston.debug( err )
            fn( err )
        })
        
    })
    return subCategory;
};