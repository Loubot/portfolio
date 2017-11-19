'use strict'


var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var config = {
  accessKeyId: "AKIAISDFPZFPHLD7EJGA",
  secretAccessKey: "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",
  sslEnabled: false,
  s3ForcePathStyle: true
};
AWS.config.update(config);
var s3 = new AWS.S3();



module.exports.controller = function( app, strategy ) {

	app.get('/user', strategy.authenticate(), function( req, res ) {
		console.log( '/user user_controller')
		console.log( req.query)
		var params = { Bucket: 'port-practise', Key: req.query.Key }
		console.log('bc')
		s3.getSignedUrl('putObject', params, function (err, url) {
			if ( err ) {
				res.json( 'no good ')
				console.log( err)
			} else {
				res.json(url)
			}
			
		});
	})
}