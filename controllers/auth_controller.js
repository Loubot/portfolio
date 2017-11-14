'use strict'

var models = require('../models')
var jwt = require("jwt-simple");
var config = require("../config/strategy-config")
var credential = require('credential')
var pw = credential()
Promise = require('bluebird')

module.exports.controller = function( app ) {
	app.post('/login', function( req, res ) {
		console.log('login')
		if (req.body.email && req.body.password ) {
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

	var hash_password = function( pass ) {
		pw.hash(pass, function (err, hash) {
			if (err) { throw err; }
			console.log( hash )
			return hash
		});
	}

	app.post('/register', function( req, res ) {
		console.log('register')

		// pw.hash( req.body.password, function( err, hash ) {
		// 	if ( err ){
		// 		res.sendStatus( 401 )
		// 	} else {
		// 		res.json( hash )
		// 	}
		// })


		pw.hash( req.body.password, function( err, hash ) {
			if ( err ){
				res.sendStatus( 401 )
			} else {
				models.User.findOrCreate({
					where: { email: req.body.email, password: JSON.parse( hash ).hash }
				}).spread( ( user, created ) => {
					if ( created ) {
						user.update({
							password: hash.hash
						}).then( ( user ) => {
							console.log( user )
							res.json( user )
						})
					} else {
						res.sendStatus( 400 )
					}
					
				})
			}
		})
		

		// if ( req.body.email && req.body.password ) {
		// 	console.log( req.body )
		// 	models.User.findOrCreate({
		// 		where: { email: req.body.email, password: hash_password( req.body.password ) }
		// 	}).spread( ( user, created ) => {	

		// 		var payload = user.id

		// 		var token = jwt.encode(payload, config.jwtSecret);
		// 		res.json( token )
				
				
		// 		res.json( token )
		// 	})
		// }
	})
}