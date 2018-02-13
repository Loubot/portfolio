'use strict'

angular.module( 'portfolio' ).controller( 'contactController', [
	'$scope',
	function( $scope ) {
		console.log( 'contactController' )


		$scope.send_message = function() {
			console.log( $scope.form )
		}
	}
])