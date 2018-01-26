'use strict'

angular.module('portfolio').controller( 'navController', [
	"$scope",
	"$rootScope",
	"$state",
	"$http",
	"$mdSidenav",
	"$mdMedia",
	function( $scope, $rootScope, $state, $http, $mdSidenav, $mdMedia ) {
		$scope.$mdMedia = $mdMedia
		$scope.openLeftMenu = function() {
			$mdSidenav( 'left' ).toggle()
		}

		window.fbReady = function( FB ) {
			$rootScope.FB = FB
		}
		
		$http({
			method: "GET",
			url: window.location.origin + "/api/category/index"
		}).then( function success( res ) {
			console.log( res )
			$rootScope.categories = res.data
			$rootScope.$emit( 'categories_done', 'loaded ok' )
		}), function error( err ) {
			console.log( err )
		}

		$scope.view_category = function( id ) {
			console.log( id )
			$state.go( 'category', { id: id } )
		}
	}
])