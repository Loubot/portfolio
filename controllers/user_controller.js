'use strict'


var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var config = {
  accessKeyId: process.env.PORT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PORT_PORT_AWS_ACCESS_KEY_ID
};
AWS.config.update(config);
var s3 = new AWS.S3();




module.exports.controller = function( app, strategy ) {

	app.get('/user', strategy.authenticate(), function( req, res ) {
		console.log( '/user user_controller')
		console.log( req.query)
		
	})

	app.get( '/s3-list-all', strategy.authenticate(), function( req, res ) {
		console.log( '/s3-list-all user_controller' )
		console.log( req.query )

		var params = { 
		  Bucket: 'port-practise',
		  Delimiter: ''
		}

		s3.listObjects( params, function( err, data ) {
			if ( err ) {
				res.status( 404 ).json( err )
			} else {
				res.json( data )
			}
		})

	})


	/* /s3-url  params: { Key, type, request_type } 
		getSignedUrl from s3. Needs Key ( file name ), type ( file type, e.g. jpeg ), request_type 
		( e.g. 'putObject', 'getObject' )
		Returns s3 presigned url
	*/
	app.get('/s3-url', strategy.authenticate(), function( req, res ) {
		console.log( '/s3-url, user_controller')
		console.log( req.query )
		var params = {
		    Bucket:'port-practise',
		    Key:req.query.Key,
		    ContentType:req.query.type,
		    Expires: 60
		};

		if ( req.query.request_type === 'putObject' ){
			console.log('hup')
			params.ACL = 'public-read'
		}
		console.log( params)
		s3.getSignedUrl( req.query.request_type, params, function (err, url) {
			if ( err ) {
				res.json( 'no good ')
				console.log( err)
			} else {
				res.json(url)
			}
			
		});
	})
}