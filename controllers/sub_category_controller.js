'use strict'

var winston = require( 'winston' )
var models = require( '../models' )

module.exports.controller = function( app, strategy ) {
    app.get( '/api/subcategories', function( req, res ) {
        winston.debug( '/api/subcategories sub_category_controller' )
        models.subCategory.findAll().
        then( subCategories => {
            winston.debug( 'Found subCategories' )
            // winston.debug( subCategories )
            res.json( subCategories )
        }).catch( err => {
            winston.debug( 'Failed to find subCategories')
            winston.debug( err )
            res.status( 500 ).json( err )
        })
    })

    app.get( '/api/category/:id/subcategories', function( req, res ) {
        winston.debug( '/api/category/:id/subcategories sub_category_controller' )
        winston.debug( req.params )
        
        models.Category.findOne({
            where: { id: req.params.id },
            include: [{ 
                model: models.subCategory, include: [
                    { model: models.Photo, as:'photos'
                } ]
            }]
        }).then( category => {
            winston.debug( 'Found category with subCategories' )
            res.json( category )
        }).catch( err => {
            winston.debug( 'Failed to find category' )
            res.status( 500 ).json( err )
        })
    })

    app.post( '/api/subcategory', strategy.authenticate(), (req, res) => {
        winston.debug( '/api/subcategories sub_category_controller post' )
        winston.debug( req.body )
        models.subCategory.create(
            req.body
        ).then( subCategory => {
            winston.debug( 'Created subCategory' )
            // winston.debug( category )
            models.Category.findAll({
                include: [{
                    model: models.subCategory
                }]
            }).
            then( categories => {
                winston.debug( 'Found all categories' )
                // winston.debug( categories )
                res.json( categories )
            }).catch( err => {
                winston.debug( 'Failed to find subCategories' )
                winston.debug( err )
                res.status( 500 ).json( err )
            })
        }).catch( err => {
            winston.debug( 'Failed to create subCategory' )
            winston.debug( err )
            res.status( 500 ).json( err )
        })
    } )


    app.delete( '/api/subcategory/:id', strategy.authenticate(), function( req, res ) {
        winston.debug( 'api/subcategory/:id Delete sub_category_controller' )
        winston.debug( req.params ) 
        models.subCategory.findOne({
			where: { id: req.params.id }
		}).then( function( sub ) {
			sub.destroy().then( function( deleted ) {
				res.json( deleted )
			})
		})
        
    })
}