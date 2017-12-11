'use strict'

angular.module('portfolio').controller( 'navController', [
	"$scope",
	"$http",
	"$mdSidenav",
	"$mdMedia",
	function( $scope, $http, $mdSidenav, $mdMedia ) {
		$scope.$mdMedia = $mdMedia
		$scope.openLeftMenu = function() {
			$mdSidenav( 'left' ).toggle()
		}
		$http({
			method: "GET",
			url: window.location.origin + "/api/category"
		}).then( function success( categories ) {
			console.log( categories )
		}), function error( err ) {
			console.log( err )
		}
	}
])