'use strict'

var models = require( '../models' )
var winston = require('winston')

module.exports.controller = function( app, strategy ) {
	/*Get all photos */

	app.get( '/api/photos/', function( req, res ) {
		winston.debug( "/api/photos photo_controller" )
		winston.debug( req.query )

		models.Photo.findAll().then( function( photos ) {
			winston.debug( 'Find all photos' )
			// winston.debug( photos )
			res.json( { photos: photos } )
		}).catch( function( err ) {
			winston.debug( 'Find all photos err' )
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	app.get( '/api/photos/single', function( req, res ) {
		winston.debug( '/api/photos/single photo_controller' )
		winston.debug( req.query )

		models.Photo.findOne({
			where: { id: req.query.id }
		}).then( function( photo ) {
			winston.debug( 'found photo')
			// winston.debug( photo )
			res.json( photo )
		}).catch( function( err ) {
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	app.get( '/api/photos/main', function( req, res ) {
		winston.debug( "/api/photos photo_controller" )
		winston.debug( req.query )

		models.Photo.findAll({
			where: { main: true }
		}).then( function( photos ) {
			winston.debug( 'Find all photos' )
			// winston.debug( photos )
			res.json( { photos: photos } )
		}).catch( function( err ) {
			winston.debug( 'Find all photos err' )
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	/*Requires { user.id, category.id, key }*/
	app.post( '/api/photo', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/photo photo_controller create' )
		winston.debug( req.body )
		
		models.Photo.create({
			UserId: req.user.id,
			subCategoryId: req.body.subCategoryId,
			fileName: req.body.Key
		}).then( function( photo ) {
			winston.debug( 'Photo created' )
			// winston.debug( photo )
			var send_photo = {
				id: photo.id
			}
			res.json( send_photo )
		}).catch( function( err ) {
			winston.debug( 'Photo create error ' )
			winston.debug( err )
			res.status( 500 ).json( err )
		})
	})

	/* Update photo */
	/* Requires { id }*/
	app.put( '/api/photo', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/photo update photo' )
		winston.debug( req.body.photo )
		var updated_photo = req.body.photo
		models.Photo.findOne({
			where: { id: req.body.photo.id }
		}).then( function( photo ) {
			winston.debug( photo.id )
			
			photo.update(
				updated_photo
			).then( function( updated ) {
				winston.debug( 'photo updated' )
				winston.debug( updated.main )
				models.Photo.findAll({})
				.then( function( photos ) {
					res.json( photos)
				}).catch( function( errs) {
					res.status( 500 ).json( errs )
				})
			}).catch( function( err ) {
				winston.debug( 'photo update error' )
				winston.debug( err )
				res.status( 400 ).json( err )
			})
		})
	})

	/* Destroy photo 
	requires { id }
	*/

	/* Update photos category 
	requires { photo.id, category.id }
	*/

	app.put( '/api/photo/category', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/photo/category photo_controller update' )
		winston.debug( req.body )

		models.Photo.findOne({ 
			where: { id: req.body.photo.id }
		}).then( function( photo ) {
			winston.debug( 'Found photo' )
			winston.debug( photo.id )
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


	/* /photo params: { file_name, category } */
	/* Expects filename of recently uploaded photo, category. Creates thumbsize version of file and pushes this thumb
		to s3 bucket. 
	*/

	app.post('/api/photo-thumb', strategy.authenticate(), function( req, res ) {
		winston.debug( '/api/photo images_controller' )
		winston.debug( req.body )
		// res.json( 'ok' )

		models.Photo.findOne({
			where: { id: req.body.photo.id }
		}).then( function( photo ) {
			winston.debug( "Found photo" )
			photo.processImage( function( a, b ) {
				if ( a ) {
					winston.debug( 'a' )
					res.json( a )
				} else {
					winston.debug( 'b' )
					res.json( b )
				}
			})
		})

		
	}) /*End app.post( 'photo' ) */
}