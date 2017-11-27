'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	"$http",
	"$state",
	"$mdSidenav",
	"$mdMedia",
	"Alertify",
	function( $scope, $http, $state, $mdSidenav, $mdMedia, Alertify ) {
		console.log('staticController')

		$scope.$mdMedia = $mdMedia

		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
		$http({
			method: 'GET',
			url: window.location.origin + '/s3-list-all',
			headers: {
				"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
			}
		}).then( function successCallBack( res ) {
			console.log( res.data )
			for ( let img of res.data.Contents ){
				$scope.img_urls.push( "https://s3-eu-west-1.amazonaws.com/als-portfolio/" + img.Key )

			}
			// console.log($scope.img_urls)
		}), function error( err ) {
			console.log( err )
		}

		$scope.openLeftMenu = function() {
			$mdSidenav( 'left' ).toggle()
		}

		$scope.login = function() {
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