'use strict'

var Promise = require('bluebird')
var AWS = require('aws-sdk');
var fs = Promise.promisifyAll( require( 'fs') )
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
var models = require( '../models' )
// winston.debug( config )
AWS.config.update(config);
var s3 = Promise.promisifyAll( new AWS.S3() )
var winston = require('winston')





module.exports.controller = function( app, strategy ) {
	/* /api/s3-list-all params: { } */
	/* Get a list of all images in the bucket */
	app.get( '/api/s3-list-all', function( req, res ) {
		winston.debug( '/api/s3-list-all images_controller' )
		winston.debug( req.query )
		var params = { 
		  Bucket: config.Bucket,
		  Delimiter: ''
		}
		
		s3.listObjects( params, function( err, data ) {
			if ( err ) {
				
				winston.debug( err )
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
		
		var params = {
					    Bucket: config.Bucket,
					    Key: req.query.id + "/" + req.query.Key,
					    ContentType: req.query.type,
					    Expires: 60,
					    ACL: 'public-read'
					}


		s3.getSignedUrl( req.query.request_type, params, function (err, url) {
			if ( err ) {
				res.json( 'no good ')
				winston.debug( err)
			} else {
				// var param = {
				// 	url: url ,
				//
				winston.debug( "s3 url return param ")
				// winston.debug( param )
				res.json( {url: url } )
				// res.json(
					
				// )
			}
			
		})
		
	})

}