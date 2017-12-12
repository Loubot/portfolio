'use strict';

var winston = require( 'winston' )

var mkdirp =  require('mkdirp-promise')
var Promise = require('bluebird')
var fs = Promise.promisifyAll( require( 'fs') )
var Jimp = Promise.promisifyAll( require('jimp') )
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
AWS.config.update(config);
var s3 = Promise.promisifyAll( new AWS.S3() ) 

module.exports = (sequelize, DataTypes) => {
    var Photo = sequelize.define('Photo', {
        fullSizeUrl: DataTypes.STRING,
        thumbUrl: DataTypes.STRING,
        UserId: DataTypes.INTEGER,
        CategoryId: DataTypes.INTEGER,
        fileName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                models.Photo.belongsTo( models.User )
                models.Photo.belongsTo( models.Category )
            }
        }
    });


    Photo.hook( 'afterCreate', function( photo, options) {
        winston.debug( 'Photo create hook' )
        winston.debug( photo.dataValues )
        var category = {}
        
        mkdirp( 'tmp/images').then( function() {
            winston.debug( 'created tmp/images')
            sequelize.models.Category.findOne(
                { where: { id: photo.dataValues.CategoryId }
            }).then( function( cat ) {
                category = cat
                var out = fs.createWriteStream('./tmp/images/' + photo.dataValues.fileName );

                out.on( 'open', function( file ) {
                   s3.getObject({ Bucket: "als-portfolio", Key: cat.name + "/" + photo.dataValues.fileName }).createReadStream().pipe(out);
                   
                }).on( 'close', function() {
                   out.end()

                   Jimp.readAsync( ( "./tmp/images/" + photo.dataValues.fileName ) ).then( function( img ) {
                       winston.debug( "Found file" )
                       img.scaleToFit(256, 256)            // resize
                            .quality(60)                 // set JPEG quality
                            .write("./tmp/images/thumb_" + photo.dataValues.fileName); // save
                       winston.debug( 'finished')
                       return fs.readFileAsync( ( "./tmp/images/thumb_" + photo.dataValues.fileName ) )
                   }).then( function( file ) {
                       var params = {
                           ACL: 'public-read',
                           Body: file, 
                           Bucket: config.Bucket, 
                           Key: category.name + "/thumb_" + photo.dataValues.fileName
                           
                       } /*End of params*/

                       // winston.debug( params )

                       return s3.putObjectAsync( params )
                   }).then( function ( data ) {
                       
                       return photo.update({ thumbUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/thumb_" + photo.dataValues.fileName })

                   }).then( function( updated ) {
                       winston.debug( "Photo updated")
                       // winston.debug( updated )

                   }).catch(function (err) {
                       winston.debug( "Error in Jimp.read or fs.readFileAsync or s3.putObject" )
                       winston.debug( err )

                       
                   })
                }) 
           })
            
        }).catch( function( err ) {
            winston.debug( err )
            winston.debug( 'Failed to create tmp/images')
        })
    })

    
    return Photo;
};