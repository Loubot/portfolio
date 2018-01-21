'use strict'

angular.module('portfolio').controller( 'adminController', [
	"$scope",
	"$rootScope",
	"$http",
	"Alertify",
	'imageClass',
	'$mdDialog',
	'log',
	function( $scope, $rootScope, $http, Alertify, imageClass, $mdDialog, log ) {
		console.log('adminController')

		$scope.upload_in_progress = false
		$scope.images = new Array()
		$scope.cat = null
		$scope.cat_check = {}
		document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
		document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"

		$scope.selected = new Array()



		$scope.change_category = function( cat, img ) {

			console.log( cat, img )
			$http({
				method: 'PUT',
				url: window.location.origin + '/api/photo/category',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				data: {
					category: cat,
					photo: img
				}
			}).then( function( res ) {
				console.log( res )
				$scope.images = res.data.photos
				Alertify.success( 'Category changed' )
			}), function error( err ) {
				console.log( err )
				Alertify.error( 'Failed to update category' )
			}
		}
		
		$http({
			method: 'GET',
			url: window.location.origin + '/api/photos'
		}).then( function success( res ) {
			console.log( res )
			$scope.images = res.data.photos
			
		}), function error( err ) {
			console.log( err )
		}


		$scope.create_category = function() {
			console.log( $scope.category )
			$http({
				method: "POST",
				url: window.location.origin + "/api/category",
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: $scope.category
			}).then( function successCallBack( res ) {
				console.log( res )
				$rootScope.categories = res.data
				$scope.category = {}
			}), function error( err ) {
				console.log( err )
			}
		} /*end of create category*/

		$scope.delete_category = function( cat_check ) {
			var confirm = $mdDialog.confirm()
			          .title('Delete category')
			          .textContent('Deleting category will delete all pictures in that category')
			          .ariaLabel('Delete Category')
			          .ok('YES!')
			          .cancel('Keep category');
			$mdDialog.show(confirm).then(function() {
				console.log( cat_check )
				$http({
					method: 'DELETE',
					url: window.location.origin + '/api/category',
					headers: {
						"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
					},
					params: {
						cat_check
					}
				}).then( function( res ) {
					console.log( res )
					$rootScope.categories = res.data
					$scope.cat_id = -1
					$scope.select_category( -1 )
				}), function error( err ) {
					console.log( err )
				}
			}).catch( function( err ) {
				// console.log( err )
				Alertify.success( 'No action taken' )
			}), function( e ) {
				Alertify.success( 'No action taken' )
			}
		}

		$scope.select_category = function( id ) {
			console.log( id )
			var url;
			if ( id === -1 ) {
				url = '/api/photos'
			} else {
				url = '/api/category'
			}
			console.log( id )
			$http({
				method: 'GET',
				url: window.location.origin + url,
				params: {
					id: id
				}
			}).then( function( res ) {
				console.log( res )
				$scope.images = res.data.photos
			}), function error( err ) {
				console.log( err )
			}
		}


		$scope.file = {}

		$scope.upload = function( file ) {

			function getOrientation(file, callback) {
			  var reader = new FileReader();
			  reader.onload = function(e) {

			    var view = new DataView(e.target.result);
			    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
			    var length = view.byteLength, offset = 2;
			    while (offset < length) {
			      var marker = view.getUint16(offset, false);
			      offset += 2;
			      if (marker == 0xFFE1) {
			        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
			        var little = view.getUint16(offset += 6, false) == 0x4949;
			        offset += view.getUint32(offset + 4, little);
			        var tags = view.getUint16(offset, little);
			        offset += 2;
			        for (var i = 0; i < tags; i++)
			          if (view.getUint16(offset + (i * 12), little) == 0x0112)
			            return callback(view.getUint16(offset + (i * 12) + 8, little));
			      }
			      else if ((marker & 0xFF00) != 0xFF00) break;
			      else offset += view.getUint16(offset, false);
			    }
			    return callback(-1);
			  };
			  reader.readAsArrayBuffer(file);
			}

			// getOrientation(file, function(orientation) {
			//     alert('orientation: ' + orientation);
			//  });


			// return false 
			$scope.upload_in_progress = true
			console.log( file )
			var photo = {}

			$http({
				method: 'POST',
				url: window.location.origin + '/api/photo',
				headers: {
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
					
					"accept-language":"en-US,en;q=0.9",
					"x-forwarded-proto": "https"
				},
				data: { 
					Key: file.name, 
					type: file.type, 
					category: file.category, 
					request_type: 'putObject' 
				}
			}).then( function( res ) {
				console.log( res )
				log( {message: 'photo create response' })
				log( res )
				photo = res.data
				return $http({
						method: 'GET',
						url: window.location.origin + '/api/s3-url',
						headers: {
							
							"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
							"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
							
							"accept-language":"en-US,en;q=0.9",
							"x-forwarded-proto": "https"
						},
						params: { 
							Key: file.name, 
							type: file.type, 
							category: file.category, 
							request_type: 'putObject',
							id: res.data.id
						}
					})
			}).then( function( s3_url ) {
				log( { message: 's3 url response' })
				log( s3_url )
				console.log( s3_url )
				return $http({
					method: 'PUT',
					url: s3_url.data.url,
					headers: {
						"Content-type": file.type
					},
					data: file
				})
			}).then( function( s3_upload ) {
				log( { message: 's3 upload response' } )
				log( s3_upload )
				console.log( s3_upload )
				return $http({
							method: "POST",
							url: window.location.origin + "/api/photo-thumb",
							headers: {
								"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
								"Authorization": "Bearer " + window.localStorage.getItem( 'token' ),
								
								"accept-language":"en-US,en;q=0.9",
								"x-forwarded-proto": "https"
							},
							data: {
								file_name: s3_upload.config.data.name,
								category: file.category,
								photo: photo
							}
						})
				
				
			}).then( function( thumb_response ) {
				console.log( thumb_response )
				$scope.images.push( thumb_response.data )
				$scope.upload_in_progress = false

			}), function photoErr( err ) {
				console.log( photoErr )
			}

			return false

			$http({
				method: 'GET',
				url: window.location.origin + '/api/s3-url',
				headers: {
					"Accept": "application/json",
					"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
				},
				params: { 
					Key: file.name, 
					type: file.type, 
					category: file.category, 
					request_type: 'putObject' 
				}
			}).then( function successCallBack( res ) {
				console.log(  res.data ) 
				log( { message: '1' })
				
				log( res  )
				photo = res.data.photo
				$http({
					method: 'PUT',
					url: res.data.url,
					headers: {
						"Content-type": file.type
					},
					data: file
				}).then( function s3CallBack( resp ) {
					console.log( resp.config )
					log( { message: '2' })
					log( resp )
					// $scope.images.push( "https://s3-eu-west-1.amazonaws.com/als-portfolio-dev/" + photo.id + "/" + resp.config.data.name )
					$http({
						method: "POST",
						url: window.location.origin + "/api/photo",
						headers: {
							"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
						},
						data: {
							file_name: resp.config.data.name,
							category: file.category,
							photo: photo
						}
					}).then( function postImageCallBack( res ) {
						$scope.file = {}
						console.log( res.data )
						log( { message: '3' })
						log( res )
						$scope.images.push( res.data )
						
						$scope.upload_in_progress = false

						
					}), function postImageError( err ) {
						console.log( err )
						log( { message: '4' })
						log( err )
						$scope.upload_in_progress = false
					}
				}), function s3Error( dooo ) {
					console.log( dooo )
					log( { message: '5' })
					log( dooo )
					$scope.upload_in_progress = false
				}
			}), function errors( doo ) {
				console.log( doo )
				log( { message: '6' })
				log( doo )
				$scope.upload_in_progress = false
			}
		} /* End of upload()*/


		$scope.delete_pic = function( id ) {
			var confirm = $mdDialog.confirm()
			          .title('Delete picture')
			          .textContent('Are you sure you want to DELETE?')
			          .ariaLabel('Delete picture')
			          .ok('YES!')
			          .cancel('Keep picture');

		    $mdDialog.show(confirm).then(function() {
		      	console.log( id )
				$http({
					method: 'DELETE',
					url: window.location.origin + "/api/photo",
					headers: {
						"Authorization": "Bearer " + window.localStorage.getItem( 'token' )
					},
					params: {
						id: id
					}
				}).then( function( res ) {
					console.log( res )
					Alertify.success( 'Picture deleted' )
					$scope.images = res.data
				}).catch( function( err ) {
					console.log( err )
				})
		    }, function() {
		      	Alertify.success( 'No action taken' )
		    });
			
		}
	}
])



"url=https://als-portfolio.s3.eu-west-1.amazonaws.com/52/20180115_192127.jpg?AWSAccessKeyId=AKIAJPBUQBMORGTUCBSQ&Content-Type=image%2Fjpeg&Expires=1516379852&Signature=e5EdDebl9KNqAfMMoBLptG7v65s%3D&x-amz-acl=public-read, thumbUrl=undefined, fullSizeUrl=undefined, UserId=1, CategoryId=1, fileName=20180115_192127.jpg, id=52 "


"url=https://als-portfolio.s3.eu-west-1.amazonaws.com/51/IMG_7311-01-01.jpeg?AWSAccessKeyId=AKIAJPBUQBMORGTUCBSQ&Content-Type=image%2Fjpeg&Expires=1516379789&Signature=6j%2Fog1xJsuQBsX3P6368ZrK0JCI%3D&x-amz-acl=public-read, UserId=1, CategoryId=1, fileName=IMG_7311-01-01.jpeg, id=51, status=200, method=GET, transformRequest=[null], transformResponse=[null], jsonpCallbackParam=callback, url=https://als-portfolio.herokuapp.com/api/s3-url, Accept=application/json, Authorization=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.1Tb7ZLKflKv4HOx02hy7AhWra3YMEwjaeJFQB-z9ccQ, Key=IMG_7311-01-01.jpeg, type=image/jpeg, id=1, name=Street, createdAt=2017-12-20T11:22:20.000Z, updatedAt=2017-12-20T11:22:20.000Z, request_type=putObject, cached=false, statusText=OK, xhrStatus=complete "