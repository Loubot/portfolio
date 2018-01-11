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
			
			if( $mdMedia('xs') ) {
				console.log( 'xs' )
				if ( (img.height / img.width) > 1.5 ) {
					// console.log( '1')
					return 19
				} else if ( (img.height / img.width) > 1.3) {
					// console.log( '2')
					return 14
				} else if( (img.height / img.width) > 1.2 ) {
					// console.log( '3')
					return 13
				} else if( ( img.height / img.width ) > 1.2 ) {
					return 12
				} else if( ( img.height / img.width ) > 1.1 ) {
					return 11
				} else if( ( img.height / img.width ) > 1 ) {
					return 10
				} else if( ( img.height / img.width ) > .9 ) {
					return 9
				} else if( ( img.height / img.width ) > .8 ) {
					// console.log('x')
					return 8
				} else if( ( img.height / img.width ) > .7 ) {
					// console.log('9')
					return 7
				} else if( ( img.height / img.width ) > .6 ) {
					// console.log('7')
					return 6
				} else {
					
					return 5
				}
			} else if( $mdMedia('gt-lg') ) {
				console.log( 'gt-lg' )
				if ( (img.height / img.width) > 1.5 ) {
					// console.log( '1')
					return 75
				} else if ( (img.height / img.width) > 1.3) {
					// console.log( '2')
					return 70
				} else if( (img.height / img.width) > 1.2 ) {
					// console.log( '3')
					return 60
				} else if( ( img.height / img.width ) > 1.2 ) {
					return 55
				} else if( ( img.height / img.width ) > 1.1 ) {
					return 50
				} else if( ( img.height / img.width ) > 1 ) {
					return 45
				} else if( ( img.height / img.width ) > .9 ) {
					return 40
				} else if( ( img.height / img.width ) > .8 ) {
					// console.log('x')
					return 35
				} else if( ( img.height / img.width ) > .7 ) {
					// console.log('9')
					return 30
				} else if( ( img.height / img.width ) > .6 ) {
					// console.log('7')
					return 32
				} else {
					
					return 27
				}
			}else if( $mdMedia('gt-md') ) {
				console.log( 'gt-md' )
				if ( (img.height / img.width) > 1.5 ) {
					// console.log( '1')
					return 33
				} else if ( (img.height / img.width) > 1.3) {
					// console.log( '2')
					return 31
				} else if( (img.height / img.width) > 1.2 ) {
					// console.log( '3')
					return 29
				} else if( ( img.height / img.width ) > 1.2 ) {
					return 27
				} else if( ( img.height / img.width ) > 1.1 ) {
					return 25
				} else if( ( img.height / img.width ) > 1 ) {
					return 23
				} else if( ( img.height / img.width ) > .9 ) {
					return 21
				} else if( ( img.height / img.width ) > .8 ) {
					// console.log('x')
					return 19
				} else if( ( img.height / img.width ) > .7 ) {
					// console.log('9')
					return 17
				} else if( ( img.height / img.width ) > .6 ) {
					// console.log('7')
					return 15
				} else {
					
					return 13
				}
			} else if( $mdMedia('gt-sm') ) {
				console.log( 'gt-sm' )
				if ( (img.height / img.width) > 1.5 ) {
					// console.log( '1')
					return 33
				} else if ( (img.height / img.width) > 1.3) {
					// console.log( '2')
					return 31
				} else if( (img.height / img.width) > 1.2 ) {
					// console.log( '3')
					return 29
				} else if( ( img.height / img.width ) > 1.2 ) {
					return 27
				} else if( ( img.height / img.width ) > 1.1 ) {
					return 25
				} else if( ( img.height / img.width ) > 1 ) {
					return 23
				} else if( ( img.height / img.width ) > .9 ) {
					return 21
				} else if( ( img.height / img.width ) > .8 ) {
					// console.log('x')
					return 19
				} else if( ( img.height / img.width ) > .7 ) {
					// console.log('9')
					return 17
				} else if( ( img.height / img.width ) > .6 ) {
					// console.log('7')
					return 15
				} else {
					
					return 13
				}
			} else if( $mdMedia( 'gt-xs' ) ){
				console.log( 'gt-xs' )
				if ( (img.height / img.width) > 1.5 ) {
					// console.log( '1')
					return 27
				} else if ( (img.height / img.width) > 1.3) {
					// console.log( '2')
					return 25
				} else if( (img.height / img.width) > 1.2 ) {
					// console.log( '3')
					return 23
				} else if( ( img.height / img.width ) > 1.2 ) {
					return 21
				} else if( ( img.height / img.width ) > 1.1 ) {
					return 19
				} else if( ( img.height / img.width ) > 1 ) {
					return 17
				} else if( ( img.height / img.width ) > .9 ) {
					return 15
				} else if( ( img.height / img.width ) > .8 ) {
					// console.log('x')
					return 13
				} else if( ( img.height / img.width ) > .7 ) {
					// console.log('9')
					return 11
				} else if( ( img.height / img.width ) > .6 ) {
					// console.log('7')
					return 9
				} else {
					
					return 7
				}
			} 
		}

		$scope.calculate_cols = function( img ) {
			// console.log( img.width / img.height )
			if ( $mdMedia( 'gt-md' ) ){
				if ( ( img.width / img.height ) > .5)  {
					return 5
				} else {
					return 3
				}
			} else if ( $mdMedia( 'gt-sm' ) ) {
				if ( ( img.width / img.height ) > .5)  {
					return 4
				} else {
					return 3
				}
			} else if ( $mdMedia( 'gt-xs' ) ) {
				if ( ( img.width / img.height ) > .5)  {
					return 3
				} else {
					return 2
				}
			} else if ( $mdMedia( 'xs' ) ) {
				console.log( img.width / img.height )
				if ( ( img.width / img.height ) > 1.6 )  {
					console.log('4')
					return 4
				} else if  ( ( img.width / img.height ) > 1.2 )  {
					console.log('3')
					return 3
				} else {
					console.log('2')
					return 2
				}
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