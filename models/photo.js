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
var ExifImage = require('exif').ExifImage

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


// exif orientation of 6 rotate 90
// exif orientation of 8 rotate -90
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
                    check_EXIF( "./tmp/images/" + photo.dataValues.fileName,  function( err, orientation ) {
                        if ( err ) {
                            winston.debug( 'no good boi' )
                        } else {
                            winston.debug( orientation )

                            if ( orientation ===  2 ) {
                                winston.debug('22222222222222222222222222222')
                                img.mirror( true, false )
                                flipOriginal( photo, orientation )
                            } else if ( orientation === 3 ) {
                                winston.debug('3333333333333333333333333333333')
                                img.rotate( 180 )
                                flipOriginal( photo, orientation )
                            } else if ( orientation === 4 ) {
                                winston.debug('444444444444444444444444444444444444')
                                img.rotate( 180 ).mirror( true , false )
                                flipOriginal( photo, orientation )
                            } else if  ( orientation === 5 ) {
                                winston.debug('55555555555555555555555555555555555')
                                img.rotate( 90 ).mirror( true , false )
                                flipOriginal( photo, orientation )
                            } else if ( orientation === 6 ) {
                                winston.debug('666666666666666666666666666')
                                img.rotate( 90 )
                                flipOriginal( photo, orientation )
                            } else if ( orientation === 7 ) {
                                winston.debug('7777777777777777777777777777777777777777')
                                img.rotate( -90 ).mirror( true, false )
                                flipOriginal( photo, orientation )
                            } else if ( orientation === 8 ) {
                                winston.debug('888888888888888888888888888888888')
                                img.rotate( -90 )
                                flipOriginal( photo, orientation )
                            }

                            img.write( ("./tmp/images/thumb_" + photo.dataValues.fileName), function( err, bla ) {
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
                        }
                    })
                    
                    
                    
                
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


var check_EXIF = function ( img, photo ) {
    try {
        new ExifImage({ image : img }, function (error, exifData) {
            winston.debug( 'hello boit')
            winston.debug( exifData )
            if (error){
                winston.debug('Error: '+error.message);
                photo( null, 1 )
            } else {
                winston.debug( 'exif !!!!!!!!!!!!!!!!!!!!!!!!')
                winston.debug(exifData.image.Orientation); // Do something with your data!
                if( typeof exifData.image.Orientation !== 'undefined' ) {
                    photo( null, exifData.image.Orientation )
                } else {
                    photo( null, 1 )
                }
            }
                
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}


var flipOriginal = function( photo,orientation ) {
    winston.debug( 'Flip original' )
    winston.debug( photo.dataValues )

    Jimp.readAsync( ( photo.dataValues.fullSizeUrl ) ).then( function( img ) {
        winston.debug( 'read photo' ) 
        if ( orientation ===  2 ) {
            winston.debug( '22222222222222222222222222')
            img.mirror( true , false )
            
        } else if ( orientation === 3 ) {
            winston.debug( '333333333333333333333333333333')
            img.rotate( 180 )
            
        } else if ( orientation === 4 ) {
            winston.debug( '444444444444444444444444444444')
            img.rotate( 180 ).mirror( true , false )
            
        } else if  ( orientation === 5 ) {
            winston.debug( '5555555555555555555555555555555')
            img.rotate( 90 ).mirror( true , false )
            
        } else if ( orientation === 6 ) {
            winston.debug( '66666666666666666666666666666666666')
            img.rotate( 90 )
           
        } else if ( orientation === 7 ) {
            winston.debug( '7777777777777777777777777777777777')
            img.rotate( -90 ).mirror( true, false )
            
        } else if ( orientation === 8 ) {
            winston.debug( '88888888888888888888888888888888888')
            img.rotate( -90 )
            
        }

        img.write( ("./tmp/images/" + photo.dataValues.fileName ), function( err, bla ) { 
            fs.readFileAsync( ( "./tmp/images/" + photo.dataValues.fileName ) ).then( function( file ) {
                winston.debug( "Should happen after write finished")
                var params = {
                    ACL: 'public-read-write',
                    Body: file, 
                    Bucket: config.Bucket, 
                    Key: photo.dataValues.id + "/" + photo.dataValues.fileName,
                    ContentType: 'image/jpg'
                   
                } /*End of params*/

                s3.putObject( params, function( err, data ) {
                    if ( err ) {
                        winston.debug( 'Failed to upload flipped photo' )
                    } else {
                        winston.debug( 'Uploaded flipped photo' )
                    }
                })
            }).then( function( data ) {
                return photo.update({ 
                            thumbUrl: origin_url + "/" + photo.dataValues.id + "/thumb_" + photo.dataValues.fileName 
                        })
            }).then( function( updated ) {
                winston.debug( "Photo updated")
                // fn( null, photo )
            })
            
            
        })

        
    })
}