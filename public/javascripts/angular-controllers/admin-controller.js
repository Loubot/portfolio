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
			// console.log($scope.img_urls)
		}), function error( err ) {
			console.log( err )
		}

		$scope.bla = {}

		$scope.upload = function() {
			console.log( $scope.bla )
			$http({
				method: 'GET',
				url: window.location.origin + '/s3-url',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: { Key: $scope.file.name, type: $scope.file.type, request_type: 'putObject' }
			}).then( function successCallBack( res ) {
				console.log( res )

				$http({
					method: 'PUT',
					url: res.data,
					headers: {
						"Content-type": $scope.file.type
					},
					data: $scope.file
				}).then( function s3CallBack( resp ) {
					console.log( resp.config )
					$scope.img_urls.push( "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + resp.config.data.name )
					$http({
						method: "POST",
						url: window.location.origin + "/photo",
						headers: {
							"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
						},
						data: {
							file_name: resp.config.data.name
						}
					}).then( function postImageCallBack( res ) {
						console.log( res )
					}), function postImageError( err ) {
						console.log( err )
					}
				}), function s3Error( dooo ) {
					console.log( dooo )
				}
			}), function errors( doo ) {
				console.log( doo )
			}
		}
	}
])