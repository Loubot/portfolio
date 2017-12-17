'use strict'

var models = require( '../models' )
var winston = require('winston')

module.exports.controller = function( app, strategy ) {


	app.get( '/api/photos', function( req, res ) {
		winston.debug( "/photos photo_controller" )
		winston.debug( req.query )

		models.Photo.findAll().then( function( photos ) {
			winston.debug( 'Find all photos' )
			// winston.debug( photos )
			res.json( photos )
		}).catch( function( err ) {
			winston.debug( 'Find all photos err' )
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})
}