'use strict'

var Promise = require('bluebird')
var AWS = require('aws-sdk');
var fs = Promise.promisifyAll( require( 'fs') )
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
var models = require( '../models' )
// console.log( config )
AWS.config.update(config);
var s3 = 	Promise.promisifyAll( new AWS.S3() )
var winston = require('winston')

var mkdirp =  require('mkdirp-promise')
var Jimp = Promise.promisifyAll( require('jimp') )



module.exports.controller = function( app, strategy ) {
	/* /s3-list-all params: { } */
	/* Get a list of all images in the bucket */
	app.get( '/s3-list-all', function( req, res ) {
		console.log( '/s3-list-all user_controller' )
		console.log( req.query )
		var params = { 
		  Bucket: config.Bucket,
		  Delimiter: ''
		}

		s3.listObjects( params, function( err, data ) {
			if ( err ) {
				console.log( err )
				res.status( 404 ).json( err )
			} else {
				// winston.debug( data )
				res.json( data )
			}
		})

	})

	/* /s3-url  params: { Key, type, request_type } 
		getSignedUrl from s3. Needs Key ( file name ), type ( file type, e.g. jpeg ), request_type 
		( e.g. 'putObject', 'getObject' )
		Returns s3 presigned url
	*/
	app.get('/s3-url', strategy.authenticate(), function( req, res ) {
		console.log( '/s3-url, user_controller')
		console.log( req.query )
		var params = {
		    Bucket: config.Bucket,
		    Key:req.query.Key,
		    ContentType:req.query.type,
		    Expires: 60
		};

		if ( req.query.request_type === 'putObject' ){
			// console.log('hup')
			params.ACL = 'public-read'
			// console.log( params)
		}
		// console.log( params)
		s3.getSignedUrl( req.query.request_type, params, function (err, url) {
			if ( err ) {
				res.json( 'no good ')
				console.log( err)
			} else {
				res.json(url)
			}
			
		});
	})

	/* /photo params: { file_name } */
	/* Expects filename of recently uploaded photo. Creates thumbsize version of file and pushes this thumb
		to s3 bucket. 
	*/

	app.post('/photo', strategy.authenticate(), function( req, res ) {
		console.log( '/image images_controller' )
		// winston.debug( req.user )
		var photo = null
		models.Photo.create({
			fullSizeUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + req.body.file_name
		}).then( function( res ) {
			// winston.debug( photo )
			photo = res
			return mkdirp( 'tmp/images' )

		}).then( function() { 
			winston.debug( "Created tmp/images" )
			var out = fs.createWriteStream('./tmp/images/' + req.body.file_name );
					
			out.on( 'open', function( file ) {
				s3.getObject({ Bucket: "als-portfolio", Key: req.body.file_name }).createReadStream().pipe(out);
				
			}).on( 'close', function() {
				out.end()

				Jimp.readAsync( ( "./tmp/images/" + req.body.file_name ) ).then( function( img ) {
					winston.debug( "Found file" )
					img.scaleToFit(256, 256)            // resize
					     .quality(60)                 // set JPEG quality
					     .write("./tmp/images/thumb_" + req.body.file_name); // save
					winston.debug( 'finished')
					return fs.readFileAsync( ( "./tmp/images/thumb_" + req.body.file_name ) )
				}).then( function( file ) {
					var params = {
					  	Body: file, 
					  	Bucket: config.Bucket, 
					 	Key: "thumb_" + req.body.file_name,
					 	ACL: 'public-read'
					} /*End of params*/

					return s3.putObjectAsync( params )
				}).then( function ( data ) {
					res.json({ 
						message: "File uploaded and thumb created",
						s3_response: data
					})
					return photo.update({ thumbUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/thumb_" + req.body.file_name })

				}).then( function( updated ) {
					winston.debug( "Photo updated")
					winston.debug( updated )

				}).catch(function (err) {
		            winston.debug( "Error in Jimp.read or fs.readFileAsync or s3.putObject" )
					winston.debug( err )

					res.status( 500 ).json( err )
		        })
			}) /*end on('close'*/
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})

		

		

		
	}) /*End app.post( 'photo' ) */

	/* /image params: { } */
	/* Download an image from the bucket alter it and push it pack with a different name*/
	app.get('/image', strategy.authenticate(), function( req, res ) {
		console.log( '/image user_controller')

		// winston.debug( process.cwd() )

		mkdirp('tmp/images', function(err) {
		 	if (err) {
		    	return winston.debug("Can't create dir " + (JSON.stringify(err)));
		    } else {
		    	winston.debug("Dir created waheeeey");
		    	var out = fs.createWriteStream('./tmp/images/Jellyfish.jpg');
		
		    	out.on( 'open', function( file ) {
		    		s3.getObject({ Bucket: "als-portfolio", Key: "Jellyfish.jpg" }).createReadStream().pipe(out);
		    		
		    	}).on( 'close', function() {
		    		out.end()

		    		Jimp.read("./tmp/images/Jellyfish.jpg", function (err, lenna) {
		    		    if (err) {
		    		    	winston.debug( 'big err')
		    		    	winston.debug( err )
		    		    } else {
		    		    	winston.debug( 'got here')
		    		    	// winston.debug( lenna )
		    		    	lenna.scaleToFit(256, 256)            // resize
		    		    	     .quality(60)                 // set JPEG quality
		    		    	     .write("./tmp/images/lena-small-bw.jpg"); // save
		    		    	winston.debug( 'finished')

		    		    	fs.readFile( "./tmp/images/lena-small-bw.jpg" , function( err, data ) {
		    		    		winston.debug( 'read file' )
		    		    		if ( err ) {
		    		    			winston.debug( 'failed to read file')
		    		    		} else {
		    		    			// var base64data = new Buffer(data, 'binary')
		    		    			s3.putObject( { 
		    		    				Bucket: "als-portfolio", Key: "lena-small-bw.jpg" , Body: data, ACL: 'public-read'
		    		    			}, function( err, s3_resp ) {
		    		    				if ( err ) {
		    		    					winston.debug( 's3 upload error' )
		    		    					winston.debug( err )
		    		    				} else {
		    		    					winston.debug( 'upload done' )
		    		    					// winston.debug( s3_resp )
		    		    				}
		    		    			})
		    		    		}
		    		    	})
		    		    	
		    		    }
		    		    
		    		}).catch( function( err ) {
		    			winston.debug( "Jimp read error ")
		    			winston.debug( err )
		    		});

		    		
		    	})
		  	}
		});

		
		res.json('ok')
		
		
	})
}