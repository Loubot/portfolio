'use strict';

var winston = require( 'winston' )
module.exports = (sequelize, DataTypes) => {
    var Photo = sequelize.define('Photo', {
        fullSizeUrl: DataTypes.STRING,
        thumbUrl: DataTypes.STRING,
        UserId: DataTypes.INTEGER,
        CategoryId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                models.Photo.belongsTo( models.User )
                models.Photo.belongsTo( models.Category )
            }
        }
    });


    Photo.hook( 'afterCreate', function( photo, options) {
        winston.debug( 'After create working' )
    })

    
    return Photo;
};