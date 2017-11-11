'use strict'

var models = require('../models')

module.exports.controller = function( app ) {
	app.post('/login', function( req, res ) {
		
		models.User.findOne({
			where: { id: req.body.id }
		}).then( user => {
			res.json( user )
		})
		
	})
}