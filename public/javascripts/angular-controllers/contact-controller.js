'use strict'

angular.module( 'portfolio' ).controller( 'contactController', [
	'$scope',
	'$http',
	'Alertify',
	function( $scope, $http, Alertify ) {
		console.log( 'contactController' )


		$scope.send_message = function() {
			console.log( $scope.form )
			$http({
				method: "POST",
				url: window.location.origin + "/api/mail",
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				data: $scope.form
			}).then( function successCallBack( res ) {
				console.log( res )
				Alertify.success( 'Message sent ok' )
			}).catch( function( err ) {
				console.log( err )
				Alertify.error( 'Failed to send message' )
			})
		}
	}
])