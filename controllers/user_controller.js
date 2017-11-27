'use strict'


var AWS = require('aws-sdk');
var fs = require( 'fs')
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
console.log( config )

AWS.config.update(config);
var s3 = new AWS.S3();
var winston = require('winston')

var mkdirp = require('mkdirp')
var jimp = require('jimp')




module.exports.controller = function( app, strategy ) {

	app.get('/user', strategy.authenticate(), function( req, res ) {
		console.log( '/user user_controller')
		console.log( req.query)
		
	})

	app.get('/image', strategy.authenticate(), function( req, res ) {
		console.log( '/image user_controller')
		
		s3.getObject( { Bucket: "als-portfolio", Key: "Jellyfish.jpg" }, function( err, data ) {
			if ( err ) {
				winston.debug( err )
				res.status( 404 ).json( err )
			} else {
				
				mkdirp('tmp/images', function(err) {
				 	if (err) {
				    	return winston.debug("Can't create dir " + (JSON.stringify(err)));
				    } else {
				    	return winston.debug("Dir created waheeeey");
				  	}
				});
				// fs.closeSync fs.openSync('./.tmp/excel_sheets/bla.xls', 'w')
				// fs.openSync( __dirname + "../tmp/x.jpg", 'w')
				res.json( 'ok' )
			}
		})
	})

	app.get( '/s3-list-all', strategy.authenticate(), function( req, res ) {
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
				winston.debug( data )
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
			console.log('hup')
			params.ACL = 'public-read'
			console.log( params)
		}
		console.log( params)
		s3.getSignedUrl( req.query.request_type, params, function (err, url) {
			if ( err ) {
				res.json( 'no good ')
				console.log( err)
			} else {
				res.json(url)
			}
			
		});
	})
}