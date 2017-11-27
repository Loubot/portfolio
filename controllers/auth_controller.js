'use strict'

var models = require('../models')
var jwt = require("jwt-simple");
var config = require("../config/strategy-config")
var credential = require('credential')
var pw = credential()
var Sequelize = require('sequelize');
var winston = require('winston')

module.exports.controller = function( app, strategy ) {
	app.post('/login', function( req, res ) {
		console.log( 'login' )
		if (req.body.email && req.body.password ) {
	        console.log('1')
	        models.User.findOne({
	        			where: { email: req.body.email }
	        		}).then( user => {
	        			if (user) {
	        				pw.verify( user.password, req.body.password, function( err, isValid ) {
	        				  	if (err) { 
	        				  		console.log(err)
	        				  		throw err; 
	        				  	}
	        				  	console.log(isValid)
	        				  	if ( isValid ) {
	        				  		var payload = {
	        				  	    	id: user.id
	        				  		}
	        				  		var token = jwt.encode(payload, config.jwtSecret);
	        				  		res.json( token )
	        				  	} else {
	        				  		console.log('6')
	        				  		res.sendStatus( 401 )
	        				  	}
	        				})
				            
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


		pw.hash( req.body.password, function( err, hash ) {
			if ( err ){
			
				res.sendStatus( 401 )
			} else {
			
				models.User.findOrCreate({
					where: { email: req.body.email, password: hash }
				}).spread( ( user, created ) => {
				
					if ( created ) {
					
						var payload = {
				  	    	id: user.id
				  		}

						var token = jwt.encode(payload, config.jwtSecret);
						res.json( token )
						
					} else {
					
						res.sendStatus( 400 )
					}
					
				}).catch(Sequelize.ValidationError, function (err) {
					res.status(422).json( err )
				}).catch(errs => res.status( 422).json( errs));
			}
		})
		
	})
}


// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.odI-H-J7Ots65seSC42x40hVC9Z-F59GVoTk76mFUhI
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.1Tb7ZLKflKv4HOx02hy7AhWra3YMEwjaeJFQB-z9ccQ