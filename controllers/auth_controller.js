'use strict'

var models = require('../models')
var jwt = require("jwt-simple");
var config = require("../config/strategy-config")

module.exports.controller = function( app ) {
	app.post('/login', function( req, res ) {

		if (req.body.email) {
		        var email = req.body.email;
		        models.User.findOne({
		        			where: { id: req.body.id }
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
}