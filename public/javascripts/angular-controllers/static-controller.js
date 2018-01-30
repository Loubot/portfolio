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
				fullscreen: true,
				controller: ['$scope', 'img', function($scope, img,) { 
				    $scope.image = img
				    var newImg = new Image;
				    newImg.onload = function() {

				    	var x = $(document).height() / this.height 
				    	console.log( x )
				    	console.log( $(document).height() )
				    	console.log( this.height  )
				    	console.log( this.width  )
				        $('#big_pic').css( 'background-image', 'url(' + img.fullSizeUrl + ')')
				        $('#big_pic').css( 'height', $(document).height() )
				        $('#big_pic').css( 'width', ( this.width * x ) /2 )
				        $('#big_pic').css( 'background-size', 'contain')
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