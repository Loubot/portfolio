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
	'cfpLoadingBar',
	function( $scope, $rootScope, $http, $state, Alertify, imageClass, $mdMedia, $mdDialog, $interval, cfpLoadingBar ) {
		console.log('staticController')
		$scope.$mdMedia = $mdMedia
		// document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		// document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

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
		

		$rootScope.fb_share = function( url ) {
			var link;
			if ( url == null ) {
				url = "https://www.alanrowell.com"
			}
			console.log( url )
			FB.ui({
				method: 'share_open_graph',
				action_type: 'og.shares',
				action_properties: JSON.stringify({
		            object: {
		                'og:url': window.location.href ,
		                'og:title': 'alanrowell.com',
		                'og:description': 'great photo',
		                'og:image': url,

		            }
		        })
			}, function( res ) {
				console.log( res )
			}), function( err ) {
				console.log( err )
			}
		}

		$scope.open_image = function( img ) {
			console.log( img )

			$state.transitionTo( 'home.show', { id: img.id } )
			

		}

		
		
		$scope.img_urls = new Array()
		/* Get all objects in port-practise bucket */
		cfpLoadingBar.start()
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos/main',
			ignoreLoadingBar: true
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data.photos
			function chunkArray(arr,n){
			     var chunkLength = Math.max(arr.length/n ,1);
			     var chunks = [];
			     for (var i = 0; i < n; i++) {
			         if(chunkLength*(i+1)<=arr.length)chunks.push(arr.slice(chunkLength*i, chunkLength*(i+1)));
			     }
			     $scope.images1 = chunks[0]
			     $scope.images2 = chunks[1]
			     // console.log( $scope.images )
			     // console.log( $scope.images1 )
			     // console.log( $scope.images2 )
			 }
			 chunkArray( $scope.images, 2 )
		}), function error( err ) {
			console.log( err )
		}

		$scope.finis = false
		$scope.imageCounter = 0
		$scope.complete = function() {
			// console.log( 'hup')

			$('.pointer').on( 'load', function() {
				$scope.imageCounter ++
				// console.log( $scope.imageCounter )
				if ( $scope.imageCounter == $scope.images1.length -1  ) { 
					// console.log( 'sea')
					// Alertify.success( 'All done')
					$scope.finis = true 
					cfpLoadingBar.complete()
				}
			})
		}
		

		
	}
])