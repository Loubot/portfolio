'use strict'

var winston = require( 'winston' )
var models = require( '../models' )

module.exports.controller = function( app, strategy ) {
    app.get( '/api/subcategories', strategy.authenticate(), function( req, res ) {
        winston.debug( '/api/subcategories sub_category_controller' )
        models.subCategory.findAll().
        then( categories => {
            winston.debug( 'Found subCategories' )
            winston.debug( categories )
            res.json( categories )
        }).catch( err => {
            winston.debug( 'Failed to find subCategories')
            winston.debug( err )
            res.status( 500 ).json( err )
        })
    })

    app.post( '/api/subcategory', strategy.authenticate(), (req, res) => {
        winston.debug( '/api/subcategories sub_category_controller post' )
        winston.debug( req.body )
        models.subCategory.create(
            req.body
        ).then( category => {
            winston.debug( 'Created subCategory' )
            winston.debug( category )
            models.Category.findAll({
                include: [{
                    model: models.subCategory
                }]
            }).
            then( categories => {
                winston.debug( 'Found all categories' )
                winston.debug( categories )
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
}