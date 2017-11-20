'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$http",
	function( $scope, $http ) {
		console.log('adminController')

		$scope.upload = function() {
			console.log( $scope.file )
			$http({
				method: 'GET',
				url: 'http://localhost:5000/user',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: { Key: $scope.file.name, type: $scope.file.type }
			}).then( function successCallBack( res ) {
				console.log( res.data )

				$http({
					method: 'PUT',
					url: res.data,
					headers: {
						"Content-type": $scope.file.type
					},
					data: $scope.file
				}).then( function s3CallBack( resp ) {
					console.log( resp )
				}), function s3Error( dooo ) {
					console.log( dooo )
				}
			}), function errors( doo ) {
				console.log( doo )
			}
		}
	}
])