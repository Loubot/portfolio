'use strict'

var models = require('../models')
var jwt = require("jwt-simple");
var config = require("../config/strategy-config")

module.exports.controller = function( app ) {
	app.post('/login', function( req, res ) {
		console.log('login')
		if (req.body.email) {
	        var email = req.body.email;
	        models.User.findOne({
	        			where: { email: req.body.email }
	        		}).then( user => {
	        			if (user) {
				            var payload = {
				                id: user.id
				            };
				            var token = jwt.encode(payload, config.jwtSecret);
				            res.json({
				                token: token
				            });
				        } else {
				            res.sendStatus(401);
				        }
	        		})
		        
	    } else {
	        res.sendStatus(401);
	    }

		
	})

	app.post('/register', function( req, res ) {
		console.log('register')

		if ( req.body.email && req.body.password ) {
			console.log( req.body )
			models.User.findOrCreate({
				where: { email: req.body.email }
			}).spread( ( user, created ) => {

				var payload = user.id

				var token = jwt.encode(payload, config.jwtSecret);
				res.json( token )
				
				
				res.json( token )
			})
		}
	})
}