'use strict'

module.exports.controller = function( app, strategy ) {

	app.get('/user', strategy.authenticate(), function( req, res ) {
		res.json( req.user )
	})
}