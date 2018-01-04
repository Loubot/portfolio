'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	"$http",
	function( $scope, $stateParams, $http ) {
		$scope.images = []
		$scope.doThis = function( img ) {
			var image = new Image()
			image.src = img.thumbUrl
			image.onload = function() {
				console.log( this.height )
			}
		}

		console.log( 'categoryController' )
		console.log( $stateParams.id )

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
				console.log( i )
				console.log( total )
				if( i === total ) {
					
					console.log( tempImages )
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
					tempImages.push( img )
					console.log( tempImages )
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