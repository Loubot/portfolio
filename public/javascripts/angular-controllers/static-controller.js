'use strict'

angular.module('portfolio').controller( 'staticController', [
	"$scope",
	"$http",
	"$state",
	function( $scope, $http, $state ) {
		console.log('staticController')
	}
])