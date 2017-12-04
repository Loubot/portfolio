'use strict'

var models = require('../models')
var AWS = require('aws-sdk');
var fs = require( 'fs')
AWS.config.update({region: 'eu-west-1'});
var config = require("../config/s3-config")
// console.log( config )
AWS.config.update(config);
var s3 = new AWS.S3();
var winston = require('winston')

var mkdirp = require('mkdirp')
var Jimp = require('jimp')




module.exports.controller = function( app, strategy ) {

	app.get('/user', strategy.authenticate(), function( req, res ) {
		console.log( '/user user_controller')
		// console.log( req.query)
		var params = { 
		  Bucket: config.Bucket,
		  Prefix: 'stuff/'
		}
		s3.listObjects( params, function( err, resp ) {
			if ( err ) {
				winston.debug( err )
				res.json( err )
			} else {
				winston.debug( resp )
				res.json( resp )
			}
			
		})

		// models.User.findOne({
		// 	where: { id: 1 }, include: [ {model: models.Photo, as: 'photos' }]
		// }).then( user => {
		// 	res.json( user )
		// })
		
	})


	
}