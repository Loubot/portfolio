'use strict'

angular.module('portfolio').controller( 'categoryController', [
	"$scope",
	"$stateParams",
	function( $scope, $stateParams ) {

		console.log( 'categoryController' )
		console.log( $stateParams )
	}

])