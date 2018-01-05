'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	"$http",
	'imageClass',
	function( $scope, $stateParams, $http, imageClass ) {
		console.log( 'categoryController' )
		console.log( $stateParams.id )

		$scope.images = []

		$scope.figure_out_size = function( img ) {
			console.log( img.fileName )
			console.log( img.height / img.width )

			if ( (img.height / img.width ) > 1 ) {
				return "portrait"
			} else {
				return "landscape"
			}
		}

		$http({
			method: 'GET',
			url: window.location.origin + '/api/category',
			params: {
				id: $stateParams.id
			}
		}).then( function success( res ) {
			console.log( res )
			var tempImages = []
			var imageSize = function( i, total ) {
				
				if( i === total ) {
					
					// console.log( tempImages )
					$scope.images = tempImages 
					console.log( $scope.images )
					$scope.$apply()
					return
					// $scope.images = tempImages
				}
				var image = new Image()
				var img = res.data.photos[ i ]
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

			imageSize( 0, res.data.photos.length )
			
			
		}), function error( err ) {
			console.log( err )
		}
	}

])