'use strict'

var winston = require('winston')

module.exports.controller = function ( app, strategy ) {
	app.get('/', function( req, res ) {
		res.render('index')
	})

	app.post( '/api/mail', strategy.authenticate(), function( req, res ) {
		winston.debug( 'mailer ')
		winston.debug( req.body )
		var nodemailer = require('nodemailer')
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'louisangelini@gmail.com',
		    pass: process.env.gpass
		  }
		});

		var mailOptions = {
		  from: req.body.email,
		  to: 'alan.rowell28@googlemail.com',
		  subject: 'Inquiry',
		  text: req.body.email + " has this to say: " + req.body.message
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    winston.debug(error);
		    res.status( 503 ).json( error )
		  } else {
		    winston.debug('Email sent: ' + info.response);
		    res.json( info )
		  }
		});
	})
}