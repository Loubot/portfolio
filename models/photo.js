'use strict';

var winston = require( 'winston' )
var models = require( '../models' )
var mkdirp =  require('mkdirp-promise')
var Promise = require('bluebird')
var fs = Promise.promisifyAll( require( 'fs') )
var Jimp = Promise.promisifyAll( require('jimp') )
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
AWS.config.update(config);
var s3 = Promise.promisifyAll( new AWS.S3() ) 

var origin_url = "https://s3-eu-west-1.amazonaws.com/" + process.env.PORT_BUCKET

module.exports = (sequelize, DataTypes) => {
    var Photo = sequelize.define('Photo', {
        fullSizeUrl: DataTypes.STRING,
        thumbUrl: DataTypes.STRING,
        UserId: DataTypes.INTEGER,
        CategoryId: DataTypes.INTEGER,
        fileName: DataTypes.STRING,
        main: DataTypes.BOOLEAN,
        tag: DataTypes.TEXT
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
                    Bucket: process.env.PORT_BUCKET, 
                    Key: photo.dataValues.id + "/" + photo.dataValues.fileName 
                }).createReadStream().pipe(out);
               
            }).on( 'close', function() {
                out.end()

                Jimp.readAsync( ( "./tmp/images/" + photo.dataValues.fileName ) ).then( function( img ) {
                    winston.debug( "Found file" )
                    img.scale( .4 )
                    // img.cover( 582, 328 )
                    // .quality( 60 )
                    .write( ("./tmp/images/thumb_" + photo.dataValues.fileName), function( err, bla ) {
                        if( err ) {
                            winston.debug( "Write failed " )
                            winston.debug( err )
                        } else {
                            winston.debug( "write finished")
                            // winston.debug( bla )
                            fs.readFileAsync( ( "./tmp/images/thumb_" + photo.dataValues.fileName ) ).then( function( file ) {
                                winston.debug( "Should happen after write finished")
                                var params = {
                                    ACL: 'public-read-write',
                                    Body: file, 
                                    Bucket: config.Bucket, 
                                    Key: photo.dataValues.id + "/thumb_" + photo.dataValues.fileName,
                                    ContentType: 'image/jpg'
                                   
                                } /*End of params*/

                                return s3.putObjectAsync( params )
                            }).then( function( data ) {
                                return photo.update({ 
                                            thumbUrl: origin_url + "/" + photo.dataValues.id + "/thumb_" + photo.dataValues.fileName 
                                        })
                            }).then( function( updated ) {
                                winston.debug( "Photo updated")
                                fn( null, photo )
                            })
                        }
                        
                    } )
                
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


    Photo.hook( 'beforeDestroy', function( photo, options, fn ) {
        winston.debug( 'Photo destroy hook' )
        winston.debug( photo.dataValues )
        winston.debug( options )
        var params = {
            Bucket: process.env.PORT_BUCKET,
            Delete: {
               Objects: [
                  {
                 Key: photo.dataValues.id + "/" + photo.dataValues.fileName
                }, 
                  {
                 Key: photo.dataValues.id + "/thumb_" + photo.dataValues.fileName
                }
               ], 
               Quiet: false
              }
        }
        s3.deleteObjects( params, function( err, data ) {
            if ( err ) {
                winston.debug( "Photo destroy hook failed" )
                winston.debug( err )
                fn( err )
            } else {
                winston.debug( 's3 object deleted')
                fn( null, data )
            }
        })
    })
    


    Photo.hook( 'afterCreate', function( photo, options, fn ) {
        // fn( null, 'ok')
        // return false
        winston.debug( 'Photo create hook' )
        winston.debug( origin_url + photo.dataValues.id + "/" + photo.dataValues.fileName )
        sequelize.models.Photo.update(
            {   fullSizeUrl: origin_url + "/" + photo.dataValues.id + "/" + photo.dataValues.fileName},
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