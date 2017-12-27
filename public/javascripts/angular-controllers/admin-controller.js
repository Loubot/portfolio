'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$rootScope",
	"$http",
	"Alertify",
	function( $scope, $rootScope,$http, Alertify ) {
		console.log('adminController')
		$scope.images = new Array()
		
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data
		}), function error( err ) {
			console.log( err )
		}

		$http({
			method: "GET",
			url: window.location.origin + '/api/category/index'
		}).then( function success( res ) {
			console.log( res )
			$rootScope.categories = res.data
		}), function error( err ) {
			console.log( err )
		}

		// $scope.category = {}

		$scope.create_category = function() {
			console.log( $scope.category )
			$http({
				method: "POST",
				url: window.location.origin + "/api/category",
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: $scope.category
			}).then( function successCallBack( res ) {
				console.log( res )
				$rootScope.categories = res.data
				$scope.category = {}
			}), function error( err ) {
				console.log( err )
			}
		}


		$scope.file = {}

		$scope.upload = function( file ) {
			console.log( file )
			var photo = {}
			$http({
				method: 'GET',
				url: window.location.origin + '/api/s3-url',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: { 
					Key: file.name, 
					type: file.type, 
					category: file.category, 
					request_type: 'putObject' 
				}
			}).then( function successCallBack( res ) {
				console.log( res )
				photo = res.data.photo
				$http({
					method: 'PUT',
					url: res.data.url,
					headers: {
						"Content-type": file.type
					},
					data: file
				}).then( function s3CallBack( resp ) {
					console.log( resp.config )
					// $scope.images.push( "https://s3-eu-west-1.amazonaws.com/als-portfolio-dev/" + photo.id + "/" + resp.config.data.name )
					$http({
						method: "POST",
						url: window.location.origin + "/api/photo",
						headers: {
							"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
						},
						data: {
							file_name: resp.config.data.name,
							category: file.category,
							photo: photo
						}
					}).then( function postImageCallBack( res ) {
						$scope.file = {}
						console.log( res )
						$scope.images.push( res.data )
						console.log( $scope.images )
					}), function postImageError( err ) {
						console.log( err )
					}
				}), function s3Error( dooo ) {
					console.log( dooo )
				}
			}), function errors( doo ) {
				console.log( doo )
			}
		} /* End of upload()*/


		$scope.delete_pic = function( id ) {
			console.log( id )
			$http({
				method: 'DELETE',
				url: window.location.origin + "/api/photo",
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: {
					id: id
				}
			}).then( function( res ) {
				console.log( res )
				$scope.images = res.data
			}).catch( function( err ) {
				console.log( err )
			})
		}
	}
])