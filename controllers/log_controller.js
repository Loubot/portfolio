'use strict'

var winston = require('winston')

module.exports.controller = function( app, strategy ) {

	app.post( '/api/log', strategy.authenticate(), function( req, res ) {
		winston.debug( "Log controller" )

		winston.debug( req.body )
		res.json( 'logged' )
	})
}