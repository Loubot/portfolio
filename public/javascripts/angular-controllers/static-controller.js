'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	'$rootScope',
	"$http",
	"$state",
	"Alertify",
	'imageClass',
	'$mdMedia',
	'$mdDialog',
	'$interval',
	function( $scope, $rootScope, $http, $state, Alertify, imageClass, $mdMedia, $mdDialog, $interval ) {
		console.log('staticController')
		$scope.$mdMedia = $mdMedia
		document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

		// $rootScope.$on( 'phone_rotated', function( a,b ) {
		// 	if ( $('.display_image').height() / $('.display_image').width() > 1 ){ 
	 //    		$('.display_image').css( 'max-height', '100%')
	 //    	} else {
	 //    		console.log( '2' )
	 //    		$('.display_image').css( 'max-width', '100%')
	 //    	}
		// })

		
	    $(window).on('scroll', function() {
	        $('.parallax').css('margin-top', $(window).scrollTop() * -.3);
	    });
		

		$scope.fb_share = function(  ) {
			FB.ui({
			  method: 'feed',
			  link: "https://als-portfolio.herokuapp.com",
			  caption: 'An example caption'
			}, function( res ) {
				console.log( res )
			})
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
				    // var newImg = new Image;
				    // newImg.onload = function() {
				    // 	// if ( this.height / this.width > 1 ){ 
				    // 	// 	console.log( '1' )
				    // 	// 	$('.display_image').css( 'max-height', '100%')
				    // 	// } else {
				    // 	// 	console.log( '2' )
				    // 	// 	$('.display_image').css( 'max-width', '100%')
				    // 	// }
				    // 	// console.log( $(document).width() + 'px' )
				    // 	// console.log( this.height  )
				    // 	// console.log( this.width  )
				    // 	// $('md-dialog-content').css( 'height', $(window).height() + 'px' )
				    // 	// $('md-dialog-content').css( 'width', this.width * x )
				    // 	// $('md-dialog').css( 'height', $(window).height() + 'px' )
				    // 	// $('md-dialog').css( 'width', this.width * x )
				    // 	// $('#image').css( 'height', '682px' )
				    // 	// $('#image').css( 'width', '1079px' )
				    //     // $('#image').css( 'background-image', 'url(' + img.fullSizeUrl + ')')
				    //  //    $('#image').css( 'background-size', (this.width * x + 'px')  + ',' +  $(window).height() + 'px')
				    //  //   console.log((this.width * x + 'px')  + ',' +  $(window).height() + 'px') 
				    //     // $('#big_pic').css( 'height', $(document).height() * .5 + 'px' )
				    //     // $('#big_pic').css( 'max-height', $(document).height() +'px'  )
				    //     // $('#big_pic').css( 'width', 'auto'  )
				    //      // $('#big_pic').attr('src', img.fullSizeUrl )
				    //     // $('#big_pic').css( 'width', ( this.width * x ) /2 )
				    //     // $('#big_pic').css( 'background-size', 'contain')
				    //     // $('#big_pic').css( 'background-repeat', 'no-repeat')
				    //     // $('#big_pic').css( 'overflow', 'none')
				    // }
				    // newImg.src = img.fullSizeUrl
				    $scope.close_image = function() {
		    			$mdDialog.hide()
		    		}
				  }],

				clickOutsideToClose: true
			})
		}

		
		
		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data.photos
			
		}), function error( err ) {
			console.log( err )
		}

		$scope.finis = false
		$scope.imageCounter = 0
		$scope.complete = function() {
			$('.pointer').on( 'load', function() {
				$scope.imageCounter ++
				if ( $scope.imageCounter == $scope.images.length -4 ) { $scope.finis = true }
			})
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