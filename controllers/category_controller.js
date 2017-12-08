'use strict'

var winston = require( 'winston' )
var models = require( '../models' )

module.exports.controller = function( app, strategy ) {

	app.get( '/api/category', function( req, res )  {
		winston.debug( "/category categories_controller" )
		models.Category.findAll()
		.then( function( categories ) {
			res.json( categories )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	app.post( '/api/category', strategy.authenticate(), function( req, res ) {
		winston.debug( "/category categories_controller" )
		winston.debug( req.query )
		models.Category.create({
			name: req.query.name
		}).then( function( category ) {
			res.json( category )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})
}