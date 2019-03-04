	'use strict'

angular.module('portfolio').controller( 'categoryController', [
    "$scope",
    "$rootScope",
	"$stateParams",
	"$http",
	'imageClass',
	'$mdDialog',
	function( $scope, $rootScope, $stateParams, $http, imageClass, $mdDialog ) {
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
            pullImagesFromCat( res.data )
            $scope.category = res.data
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
        
        

        function pullImagesFromCat( cat ) { //Extract images from selected category. Loop through all categories then subcategories and add pics
			console.log( cat )
			let tempArray = []
			cat.subCategories.forEach(subCat => {
				subCat.photos.forEach( photo => {
					console.log( photo.id )
					tempArray.push( photo )
				})
			});
			if	( tempArray.length === 0 ) {
				Alertify.error( 'No pics in that Category ')
				
			} else {
				$scope.images3 = tempArray
				$rootScope.makeVis = true // Make images container invisible and display original images
			}
			// $scope.$digest()
			
        }
        

        function pullImagesFromSubCat( subCat ) { // Extract images from subCategory. Loop through each pic and add it
			console.log( subCat )
			let tempArray = []
			console.log( subCat.photos.length )
			subCat.photos.forEach( photo => {
				tempArray.push( photo )
			})
			if	( tempArray.length === 0 ) {
				Alertify.error( 'No pics in that Category ')
				
			} else {
				$scope.images3 = tempArray
				$rootScope.makeVis = true // Make images container invisible and display original images
			}
		}
	}

])