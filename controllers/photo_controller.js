'use strict'

var models = require( '../models' )
var winston = require('winston')

module.exports.controller = function( app, strategy ) {
	/*Get all photos */

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

	/* Destroy photo 
	requires { id }
	*/

	/* Update phtos category 
	requires { photo.id, category.id }
	*/

	app.put( '/api/photo/category', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/photo/category photo_controller update' )
		winston.debug( req.body )

		models.Photo.findOne({ 
			where: { id: req.body.photo.id }
		}).then( function( photo ) {
			winston.debug( 'Found photo' )
			winston.debug( photo )
			photo.update({
				CategoryId: req.body.category.id
			}).then( function( updated ) {
				winston.debug( updated )
				models.Photo.findAll({})
				.then( function( photos ) {
					res.json( { photos: photos })
				}).catch( function ( errs ) {
					winston.debug( 'Photo category updated, findAll error' )
					winston.debug( err )
					res.status( 500 ).json( errs )
				})
				// res.json( updated )
			}).catch( function( err ) {
				winston.debug( 'Update photo category error' )
				winston.debug( err )
				res.status( 500 ).json( err )
			})
		})
	})

	app.delete( '/api/photo', strategy.authenticate(), function( req, res ) {
		winston.debug( '/photo photo_controller delete')
		winston.debug( req.query )

		models.Photo.findOne({
			where: { id: req.query.id }
		}).then( function( photo ) {
			photo.destroy().then( function( deleted ) {
				models.Photo.findAll().then( function( photos ) {
					res.json( photos )
				})
			})
		})
	})
}