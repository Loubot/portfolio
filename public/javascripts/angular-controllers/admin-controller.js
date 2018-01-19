'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$rootScope",
	"$http",
	"Alertify",
	'imageClass',
	'$mdDialog',
	'log',
	function( $scope, $rootScope,$http, Alertify, imageClass, $mdDialog, log ) {
		console.log('adminController')

		$scope.upload_in_progress = false
		$scope.images = new Array()
		$scope.cat = null
		$scope.cat_check = {}
		document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

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



		$scope.change_category = function( cat, img ) {

			console.log( cat, img )
			$http({
				method: 'PUT',
				url: window.location.origin + '/api/photo/category',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				data: {
					category: cat,
					photo: img
				}
			}).then( function( res ) {
				console.log( res )
				$scope.images = res.data.photos
				Alertify.success( 'Category changed' )
			}), function error( err ) {
				console.log( err )
				Alertify.error( 'Failed to update category' )
			}
		}
		
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data.photos
			
		}), function error( err ) {
			console.log( err )
		}


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

		$scope.delete_category = function( cat_check ) {
			var confirm = $mdDialog.confirm()
			          .title('Delete category')
			          .textContent('Deleting category will delete all pictures in that category')
			          .ariaLabel('Delete Category')
			          .ok('YES!')
			          .cancel('Keep category');
			$mdDialog.show(confirm).then(function() {
				console.log( cat_check )
				$http({
					method: 'DELETE',
					url: window.location.origin + '/api/category',
					headers: {
						"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
					},
					params: {
						cat_check
					}
				}).then( function( res ) {
					console.log( res )
					$rootScope.categories = res.data
					$scope.cat_id = -1
					$scope.select_category( -1 )
				}), function error( err ) {
					console.log( err )
				}
			}).catch( function( err ) {
				// console.log( err )
				Alertify.success( 'No action taken' )
			}), function( e ) {
				Alertify.success( 'No action taken' )
			}
		}

		$scope.select_category = function( id ) {
			console.log( id )
			var url;
			if ( id === -1 ) {
				url = '/api/photos'
			} else {
				url = '/api/category'
			}
			console.log( id )
			$http({
				method: 'GET',
				url: window.location.origin + url,
				params: {
					id: id
				}
			}).then( function( res ) {
				console.log( res )
				$scope.images = res.data.photos
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
					"Accept": "application/json",
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
				log( { message: '1' })
				log( res.data  )
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
					log( { message: '2' })
					log( resp )
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
						log( { message: '3' })
						log( res )
						$scope.images.push( res.data )
						
						$scope.upload_in_progress = false

						
					}), function postImageError( err ) {
						console.log( err )
						log( { message: '4' })
						log( err )
						$scope.upload_in_progress = false
					}
				}), function s3Error( dooo ) {
					console.log( dooo )
					log( { message: '5' })
					log( dooo )
					$scope.upload_in_progress = false
				}
			}), function errors( doo ) {
				console.log( doo )
				log( { message: '6' })
				log( doo )
				$scope.upload_in_progress = false
			}
		} /* End of upload()*/


		$scope.delete_pic = function( id ) {
			var confirm = $mdDialog.confirm()
			          .title('Delete picture')
			          .textContent('Are you sure you want to DELETE?')
			          .ariaLabel('Delete picture')
			          .ok('YES!')
			          .cancel('Keep picture');

		    $mdDialog.show(confirm).then(function() {
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
					Alertify.success( 'Picture deleted' )
					$scope.images = res.data
				}).catch( function( err ) {
					console.log( err )
				})
		    }, function() {
		      	Alertify.success( 'No action taken' )
		    });
			
		}
	}
])