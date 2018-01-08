'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$rootScope",
	"$http",
	"Alertify",
	'imageClass',
	function( $scope, $rootScope,$http, Alertify, imageClass ) {
		console.log('adminController')

		$scope.upload_in_progress = false
		$scope.images = new Array()

		$scope.selected = new Array()

		$scope.calculate_rows = function( img ) {
			// console.log( img.height / img.width )
			if ( (img.height / img.width) > 1 ) {
				return 4
			} else {
				return 2
			}
			
		}

		$scope.calculate_cols = function( img ) {
			// console.log( img.height / img.width )
			if ( (img.height / img.width) > 1 ) {
				return 2
			} else {
				return 3
			}
			
		}
		
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			var tempImages = []
			var imageSize = function( i, total ) {
				
				if( i === total ) {
					
					// console.log( tempImages )
					$scope.images = tempImages 
					console.log( $scope.images )
					if ( $scope.images.length) $scope.$apply()
					return
					// $scope.images = tempImages
				}
				var image = new Image()
				var img = res.data[ i ]
				image.src = img.thumbUrl
				image.onload = function() {
					img.width = this.width
					img.height = this.height

					img.class = imageClass( this.height, this.width )
					
					tempImages.push( img )
					// console.log( tempImages )
					i++
					imageSize( i, total )
				}
				
			}

			imageSize( 0, res.data.length )
			
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
		} /*end of create category*/

		$scope.delete_category = function( id ) {
			console.log( id )
			$http({
				method: 'DELETE',
				url: window.location.origin + '/api/category',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: {
					id: id
				}
			}).then( function( res ) {
				console.log( res )
			}), function error( err ) {
				console.log( err )
			}
		}


		$scope.file = {}

		$scope.upload = function( file ) {
			$scope.upload_in_progress = true
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
						console.log( res.data )

						var image = new Image()
						var img = res.data
						image.src = img.thumbUrl
						image.onload = function() {
							img.class = imageClass( this.height, this.width )
							$scope.images.push( img )
							$scope.upload_in_progress = false
							$scope.$apply()
							console.log( $scope.images )
						}


						
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