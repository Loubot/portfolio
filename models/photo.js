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


    Photo.Instance.prototype.processImage = function ( fn ) {
        winston.debug( "Photo instance method processImage()")
        var photo = this
        winston.debug( photo.dataValues )
        var category = {}
        // return false
        mkdirp( 'tmp/images').then( function() {
            winston.debug( "Created tmp/images" )
            var out = fs.createWriteStream('./tmp/images/' + photo.dataValues.fileName )

            out.on( 'open', function( file ) {
                winston.debug( 'bla' )
                winston.debug( photo.dataValues.id )
                s3.getObject({ 
                    Bucket: "als-portfolio", 
                    Key: photo.dataValues.id + "/" + photo.dataValues.fileName 
                }).createReadStream().pipe(out);
               
            }).on( 'close', function() {
                out.end()

                Jimp.readAsync( ( "./tmp/images/" + photo.dataValues.fileName ) ).then( function( img ) {
                    winston.debug( "Found file" )

                    img.scaleToFit( 256, Jimp.AUTO )
                        .quality( 60 )
                        .write( "./tmp/images/thumb_" + photo.dataValues.fileName )
                   
                    
                    return fs.readFileAsync( ( "./tmp/images/thumb_" + photo.dataValues.fileName ) )
                }).then( function( file ) {
                    var params = {
                        ACL: 'public-read',
                        Body: file, 
                        Bucket: config.Bucket, 
                        Key: photo.dataValues.id + "/thumb_" + photo.dataValues.fileName
                       
                    } /*End of params*/

                    // winston.debug( params )

                    return s3.putObjectAsync( params )
                }).then( function ( data ) {
                   
                    return photo.update({ 
                        thumbUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + photo.dataValues.id + "/thumb_" + photo.dataValues.fileName })

                }).then( function( updated ) {
                   winston.debug( "Photo updated")
                   // winston.debug( updated )

                   fn( null, photo )

                }).catch(function (err) {
                   winston.debug( "Error in Jimp.read or fs.readFileAsync or s3.putObject" )
                   winston.debug( err )

                   
                })
            }) 

        }).catch( function( err ) {
            winston.debug( "Photo create hook update error")
            winston.debug( err )
            fn( err )
        })
    }
    


    Photo.hook( 'afterCreate', function( photo, options, fn ) {
        fn( null, 'ok')
        // return false
        winston.debug( 'Photo create hook' )
        winston.debug( "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + photo.dataValues.id + "/" + photo.dataValues.fileName )
        sequelize.models.Photo.update(
            {   fullSizeUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + photo.dataValues.id + "/" + photo.dataValues.fileName},
            {   where: { id: photo.dataValues.id }
        }).then( function( updated ) {
            winston.debug( updated.dataValues )
            fn( null, photo )
        }).catch( function( err ) {
            winston.debug( "Photo create hook failed")
            winston.debug( err )
            fn( err )
        })
        
    })

    
    return Photo;
};