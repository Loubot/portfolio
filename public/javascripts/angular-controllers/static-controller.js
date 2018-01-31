'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	"$http",
	"$state",
	"Alertify",
	'imageClass',
	'$mdMedia',
	'$mdDialog',
	function( $scope, $http, $state, Alertify, imageClass, $mdMedia, $mdDialog ) {
		console.log('staticController')
		$scope.$mdMedia = $mdMedia
		document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

		$scope.open_image = function( img ) {
			console.log( img )
			$mdDialog.show({
				templateUrl: '../angular-views/dialogs/big_pic_dialog.html',
				locals: { img: img },
				controller: ['$scope', 'img', function($scope, img,) { 
				    $scope.image = img
				    var newImg = new Image;
				    newImg.onload = function() {
				    	console.log( $( window).height() )
				    	console.log( $( window).width() )
				    	var x = $(window).height() / this.height 
				    	console.log( x )
				    	// console.log( $(document).width() + 'px' )
				    	// console.log( this.height  )
				    	// console.log( this.width  )
				    	// $('md-dialog-content').css( 'height', $(window).height() + 'px' )
				    	// $('md-dialog-content').css( 'width', this.width * x )
				    	// $('md-dialog').css( 'height', $(window).height() + 'px' )
				    	// $('md-dialog').css( 'width', this.width * x )
				    	// $('#image').css( 'height', '682px' )
				    	// $('#image').css( 'width', '1079px' )
				        $('#image').css( 'background-image', 'url(' + img.fullSizeUrl + ')')
				     //    $('#image').css( 'background-size', (this.width * x + 'px')  + ',' +  $(window).height() + 'px')
				     //   console.log((this.width * x + 'px')  + ',' +  $(window).height() + 'px') 
				        // $('#big_pic').css( 'height', $(document).height() * .5 + 'px' )
				        // $('#big_pic').css( 'max-height', $(document).height() +'px'  )
				        // $('#big_pic').css( 'width', 'auto'  )
				         // $('#big_pic').attr('src', img.fullSizeUrl )
				        // $('#big_pic').css( 'width', ( this.width * x ) /2 )
				        // $('#big_pic').css( 'background-size', 'contain')
				        // $('#big_pic').css( 'background-repeat', 'no-repeat')
				        // $('#big_pic').css( 'overflow', 'none')
				    }
				    newImg.src = img.fullSizeUrl
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

		$('#container').imagesLoaded( function() {
		  var elem = document.querySelector('.grid');
		  var msnry = new Masonry( elem, {
		    // options
		    itemSelector: '.grid-item',
		    columnWidth: 150
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