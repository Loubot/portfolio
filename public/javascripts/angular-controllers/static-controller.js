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

		
		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data
			// var tempImages = []
			// var imageSize = function( i, total ) {
				
			// 	if( i === total ) {
					
			// 		// console.log( tempImages )
			// 		$scope.images = tempImages 
			// 		console.log( $scope.images )
			// 		if ( $scope.images.length) $scope.$apply()
					
			// 		return
			// 		// $scope.images = tempImages
			// 	}
			// 	var image = new Image()
			// 	var img = res.data[ i ]
			// 	image.src = img.thumbUrl
			// 	image.onload = function() {
			// 		img.width = this.width
			// 		img.height = this.height

			// 		img.class = imageClass( this.height, this.width )
					
			// 		tempImages.push( img )
			// 		// console.log( tempImages )
			// 		i++
			// 		imageSize( i, total )
			// 	}
				
			// }

			// imageSize( 0, res.data.length )
		}), function error( err ) {
			console.log( err )
		}

		$('#container').imagesLoaded( function() {
		  var elem = document.querySelector('.grid');
		  var msnry = new Masonry( elem, {
		    // options
		    itemSelector: '.grid-item',
		    columnWidth: 200
		  });
		});
		

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