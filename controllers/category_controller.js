'use strict'

var winston = require( 'winston' )
var models = require( '../models' )

module.exports.controller = function( app, strategy ) {

	app.get( '/api/category/index', function( req, res )  {
		winston.debug( "/category/index categories_controller" )
		models.Category.findAll()
		.then( function( categories ) {
			res.json( categories )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	app.get( '/api/category/', function( req, res ) {
		winston.debug( '/category/ { id }')
		winston.debug( req.query )
		models.Category.findOne({ 
			where: { id: req.query.id },
			include: [
			    {model: models.Photo, as:'photos'}
			]

		}).then( function( category ) {
			winston.debug( "Found category" )
			// winston.debug( category )
			res.json( category )
		}).catch( function( err ) {
			winston.debug( 'Find category error' )
			res.status( 500 ).json( err )
		})
	})

	app.post( '/api/category', strategy.authenticate(), function( req, res ) {
		winston.debug( "/category categories_controller" )
		winston.debug( req.query )
		models.Category.create({
			name: req.query.name
		}).then( function( category ) {
			models.Category.findAll()
			.then( function( categories ) {
				res.json( categories )
			}).catch( function( err ) {
				res.status( 500 ).json( err )
			})
			// res.json( category )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})


	app.delete( '/api/category', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/category categories_controller' )
		winston.debug( req.query )

		models.Category.destroy({
			where: { id: req.query.id }
		}).then( function( resp ) {
			winston.debug( resp )
			res.json( resp )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})
}