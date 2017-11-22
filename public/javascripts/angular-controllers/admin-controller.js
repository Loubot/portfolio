'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$http",
	"Alertify",
	function( $scope, $http, Alertify ) {
		console.log('adminController')
		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
		$http({
			method: 'GET',
			url: window.location.origin + '/s3-list-all',
			headers: {
				"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
			}
		}).then( function successCallBack( res ) {
			console.log( res.data )
			for ( let img of res.data.Contents ){
				$scope.img_urls.push( "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + img.Key )

			}
			console.log($scope.img_urls)
		}), function error( err ) {
			console.log( err )
		}

		$scope.upload = function() {
			console.log( $scope.file )
			$http({
				method: 'GET',
				url: window.location.origin + '/s3-url',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: { Key: $scope.file.name, type: $scope.file.type, request_type: 'putObject' }
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