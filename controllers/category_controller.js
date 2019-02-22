'use strict'

var winston = require( 'winston' )
var models = require( '../models' )

module.exports.controller = function( app, strategy ) {

	app.get( '/api/category/index', function( req, res )  {
		winston.debug( "/category/index categories_controller" )
		models.Category.findAll({
			include: [{
				model: models.subCategory
			}]
		})
		.then( function( categories ) {
			res.json( categories )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	/* Get category 
	requires { id }
	returns category and photos
	*/
	app.get( '/api/category/', function( req, res ) {
		winston.debug( '/category/ { id }')
		winston.debug( req.query )
		models.Category.findOne({ 
			where: { id: req.query.id },
			include: [
			    { model: models.Photo, as:'photos' }
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

	/* Create category
	requires { name }
	*/

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


	/* Destroy category 
	requires { id }
	*/
	app.delete( '/api/category', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/category categories_controller delete' )
		winston.debug( JSON.parse( req.query.cat_check ).id )

		models.Category.findOne({
			where: { id: JSON.parse( req.query.cat_check ).id },
			include: [
			    { model: models.Photo, as:'photos' }
			]
		}).then( function( category ) {
			winston.debug( 'found category' )
			// winston.debug( category.photos )
			category.destroy().then( function( deleted ) {
				winston.debug( 'Deleted category' )
				winston.debug( deleted )
				models.Category.findAll().then( function( categories ) {
					res.json( categories )
				})
			}).catch( function( err ) {
				winston.debug( 'Category delete error' )
				winston.debug( err )
				res.status( 500 ).json( err )
			})
			// res.json('ok')
		}).catch( function( err ) {
			winston.debug( 'Category delete findOne error')
			winston.debug( err )
		})

		
	})
}