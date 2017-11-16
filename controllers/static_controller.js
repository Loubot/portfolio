'use strict'

module.exports.controller = function ( app, strategy ) {
	app.get('/', function( req, res ) {
		res.render('index')
	})
}