'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	"$http",
	function( $scope, $stateParams, $http ) {

		console.log( 'categoryController' )
		console.log( $stateParams.id )

		$http({
			method: 'GET',
			url: window.location.origin + '/api/category',
			params: {
				id: $stateParams.id
			}
		}).then( function success( res ) {
			console.log( res )
			$scope.images = new Array()
			for ( let img of res.data.photos ) {
				$scope.images.push( img.thumbUrl )
			}
		}), function error( err ) {
			console.log( err )
		}
	}

])