'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	"$http",
	function( $scope, $stateParams, $http ) {
		$scope.images = []
		

		$scope.getColSpan = function( img ) {
			// console.log( img.height )
			console.log( img.height / img.width )
			// console.log( img.height / img.width )
			if ( (img.height / img.width) < 1 ){
				return 8
			} else {
				return 3
			}
		}

		$scope.getRowSpan = function( img ) {
			// console.log( img.width / img.height )
			return 1
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