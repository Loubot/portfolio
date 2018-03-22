	'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	"$http",
	'imageClass',
	'$mdDialog',
	function( $scope, $stateParams, $http, imageClass, $mdDialog ) {
		console.log( 'categoryController' )
		console.log( $stateParams.id )

		// document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		// document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

		$scope.images = []

		$scope.calculate_rows = function( img ) {
			// console.log( img.height / img.width )
			if ( (img.height / img.width) > 1 ) {
				return 4
			} else {
				return 2
			}
			
		}

		$scope.open_image = function( img ) {
			console.log( img )
			$mdDialog.show({
				templateUrl: '../angular-views/dialogs/big_pic_dialog.html',
				locals: { img: img },
				controller: ['$scope', 'img', function($scope, img,) { 
					$scope.show_menu = function( a, b ) {
						if( ( $('.start_invis').css( 'visibility' ) ) === 'hidden' ){
							$('.start_invis').css( 'visibility', 'visible' )
						} else {
							$('.start_invis').css( 'visibility', 'hidden' )
						}
						
					}

					$scope.close_dialog = function() {
						$mdDialog.hide()
					}
				    $scope.image = img
				    
				    $scope.close_image = function() {
		    			$mdDialog.hide()
		    		}
				  }],

				clickOutsideToClose: true
			})
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
			url: window.location.origin + '/api/category',
			params: {
				id: $stateParams.id
			}
		}).then( function success( res ) {
			console.log( res )
			$scope.images1 = res.data.photos
			$scope.finis = true
		}), function error( err ) {
			console.log( err )
		}

		$scope.finis = false
		$scope.imageCounter = 0
		$scope.complete = function() {
			console.log('hup')
			$('.pointer').on( 'load', function() {
				$scope.imageCounter ++
				if ( $scope.imageCounter == $scope.images.length ) { $scope.finis = true }
			})
		}
	}

])