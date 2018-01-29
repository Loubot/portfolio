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
		$scope.$mdMedia = $mdMedia

		document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"
		
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