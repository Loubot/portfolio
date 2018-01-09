'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	"$http",
	"$state",
	"Alertify",
	'imageClass',
	'$mdMedia',
	function( $scope, $http, $state, Alertify, imageClass, $mdMedia ) {
		console.log('staticController')

		$scope.calculate_rows = function( img ) {
			// console.log( (img.height / img.width) )
			if( $mdMedia('xs') ) {
				
				if ( (img.height / img.width) > 1.5 ) {
					console.log( '1')
					return 20
				} else if ( (img.height / img.width) > 1.3) {
					console.log( '2')
					return 18
				} else if( (img.height / img.width) > 1.2 ) {
					console.log( '3')
					return 16
				} else if( (img.height / img.width) > .7 ) {
					console.log( '4')
					return 14
				} else   {
					console.log( '5')
					return 12
				}
			} else if( $mdMedia( 'gt-xs' ) ){
				
				if ( (img.height / img.width) > 1.5 ) {
					console.log( '1')
					return 20
				} else if ( (img.height / img.width) > 1.3) {
					console.log( '2')
					return 16
				} else if( (img.height / img.width) > 1.2 ) {
					console.log( '3')
					return 15
				} else if( (img.height / img.width) > .7 ) {
					console.log( '4')
					return 11
				} else   {
					console.log( '5')
					return 9
				}
			}
			
			// if( $mdMedia('gt-md' ) ){
			// 	console.log( ( img.height / img.width ) )
			// 	return( Math.round( img.height / img.width ) * 3 )
			// } else if ( $mdMedia('gt-xs') ){
			// 	return 8
			// } else {
			// 	console.log('3')
			// }
			
		}

		$scope.calculate_cols = function( img ) {
			// console.log( img.height / img.width )
			if ( (img.height / img.width) > 1 ) {
				return 3
			} else {
				return 4
			}
			// return 3
		}

		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
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


		

		$scope.login = function() {
			console.log( $scope.user )
			$http({
				method: 'POST',
				url: window.location.origin + "/login",
				data: {
					email: $scope.user.email,
					password: $scope.user.password
				}
			}).then(function successCallback( res ) {
				window.localStorage.setItem( 'token', res.data )
				$state.go('admin')
			}, function errorCallback(err) {
			    console.log( err )
			});
		}

		$scope.register = function() {
			$http({
				method: "POST",
				url: window.location.origin + "/register",
				data: {
					email: $scope.user.email,
					password: $scope.user.password
				}
			}).then(function successCallback( res ) {
				window.localStorage.setItem( 'token', res.data )
				$state.go('admin')
			}, function errorCallback(err) {
			    console.log( err )
			    Alertify.error( err.data.errors[0].message )
			});
		}
	}
])