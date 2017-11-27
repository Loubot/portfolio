'use strict'

var winston = require('winston')

module.exports.controller = function ( app, strategy ) {
	app.get('/', function( req, res ) {
		res.render('index')
	})
}