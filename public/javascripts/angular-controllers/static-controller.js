'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	"$http",
	"$state",
	"Alertify",
	function( $scope, $http, $state, Alertify ) {
		console.log('staticController')

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