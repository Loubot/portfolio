'use strict'

var models = require('../models')

module.exports.controller = function( app ) {
	app.post('/login', function( req, res ) {
		console.log( req.body )
		res.json('ok')
	})
}