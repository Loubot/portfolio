'use strict'

var Promise = require('bluebird')
var AWS = require('aws-sdk');
var fs = Promise.promisifyAll( require( 'fs') )
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
var models = require( '../models' )
// console.log( config )
AWS.config.update(config);
var s3 = Promise.promisifyAll( new AWS.S3() )
var winston = require('winston')





module.exports.controller = function( app, strategy ) {
	/* /api/s3-list-all params: { } */
	/* Get a list of all images in the bucket */
	app.get( '/api/s3-list-all', function( req, res ) {
		console.log( '/api/s3-list-all images_controller' )
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
	app.get('/api/s3-url', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/s3-url, images_controller')
		winston.debug( req.query )
		var cat_string = req.query.category
		var cat_json = JSON.parse( cat_string )
		
		

		models.Photo.create({
			fileName: req.query.Key,
			UserId: req.user.id,
			CategoryId: cat_json.id
			// fullSizeUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + req.body.category.id + "/" + req.body.file_name
		}).then( function( photo ) {
			// winston.debug( photo )
			// photo.processImage()
			
			// return false
			var params = {
			    Bucket: config.Bucket,
			    Key: photo.id + "/" + req.query.Key,
			    ContentType:req.query.type,
			    Expires: 60
			}

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
					res.json({
						url: url,
						photo: photo
					})
				}
				
			})
		}).catch( function( err ) {
			res.status( 500 ).json( err )
			winston.debug( err)
		})

		
	})

	/* /photo params: { file_name, category } */
	/* Expects filename of recently uploaded photo, category. Creates thumbsize version of file and pushes this thumb
		to s3 bucket. 
	*/

	app.post('/api/photo', strategy.authenticate(), function( req, res ) {
		console.log( '/api/photo images_controller' )
		winston.debug( req.query )
		// winston.debug( req.user )
		var photo = null
		res.json( 'ok' )
		// models.Photo.create({
		// 	UserId: req.user.id,
		// 	fullSizeUrl: "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + req.body.category.id + "/" + req.body.file_name,
		// 	fileName: req.body.file_name,
		// 	CategoryId: req.body.category.id
		// }).then( function( photo ) {
		// 	res.json( photo )
		// 	// winston.debug( photo )
		// 	// photo = res
		// 	// return mkdirp( 'tmp/images' )
		// }).catch( function( err ) {
		// 	winston.debug( err )
		// 	res.status( 500 ).json( err )
		// })

		
	}) /*End app.post( 'photo' ) */

}