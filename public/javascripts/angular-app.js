'use strict'


var app = angular.module( 'portfolio', [ 
    'ngMaterial',
    'ui.router',
    'Alertify',
    'angular-loading-bar',
    'wu.masonry',
    'ngMessages'
] )


app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //call the function that was passed
                scope.$apply(attrs.imageonload);
            });
        }
    };
})

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true; // Show the spinner.
    cfpLoadingBarProvider.includeBar = true; // Show the bar.
}])

app.run( function( $rootScope, $state ) {
    var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, function() {
        console.log('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
        $rootScope.$emit( 'phone_rotated', true )
    }, false);

    $state.defaultErrorHandler(function(error) {
        console.log( error )
       $state.go('home'); // careful not to create an infinite loop here
    });
    
})


app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //call the function that was passed
                scope.$apply(attrs.imageonload);
            });
        }
    };
})

app.factory( 'imageClass', [ 
    '$rootScope', 
    function( $rootScope ) {
    
    var calculate = function( height, width ) {
        if ( ( height / width ) > 1 ) {
            return "portrait"
        } else {
            return "landscape"
        }
    }

    return calculate
}])

app.factory( 'log', [ 
    '$http', 
    function( $http ) {
    // console.log( 'log called ')
    var upload = function( data ) {
        $http({
            method: 'POST',
            url: window.location.origin + '/api/log',
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem( 'token' )
            },
            data: data
        }).then( function( res ) {
            console.log( res )
        }), function error( err ) {
            console.log( err )
        }
    }

    return upload
}])

app.config( [ "$stateProvider" , "$urlRouterProvider", "$locationProvider", 
    function( $stateProvider, $urlRouterProvider, $locationProvider ) {

        $locationProvider.html5Mode({ enabled: true, requireBase: false });
        $urlRouterProvider.otherwise( "/")
        
        $stateProvider.state("home", {
            url: "/",
            views: {
                'nav': {
                    templateUrl: "../angular-views/static-views/nav.html",
                    controller: "navController"
                },
                'body':{
                    controller: "staticController",
                    templateUrl: "../angular-views/static-views/index.html"
                }
            },
            onEnter: [ '$rootScope', '$mdDialog', function( $rootScope, $mdDialog ) {
                
                $mdDialog.hide()
            }] 
            
        })

        $stateProvider.state( 'home.show', {
            url: 'show/:id',
            onEnter: [ '$rootScope', '$mdDialog', '$state', '$stateParams', '$http', function( $rootScope,  $mdDialog, $state, $stateParams, $http ) {
                console.log( $stateParams.id )
                $http({
                    method: "GET",
                    url: window.location.origin + "/api/photos/single",
                    params: { id: $stateParams.id }
                }).then( function success( res ) {
                    console.log( res )
                    $mdDialog.show({
                        templateUrl: '../angular-views/dialogs/big_pic_dialog.html',
                        locals: { img: res.data },
                        scope: $rootScope,
                        preserveScope: true,
                        controller: ['$scope', 'img', function($scope, img) {
                            $scope.url = res.data.fullSizeUrl
                            $scope.thumbUrl = res.data.thumbUrl
                            $scope.show_menu = function( a, b ) {
                                if( ( $('.start_invis').css( 'visibility' ) ) === 'hidden' ){
                                    $('.start_invis').css( 'visibility', 'visible' )
                                } else {
                                    $('.start_invis').css( 'visibility', 'hidden' )
                                }
                                
                            }

                            $scope.close_dialog = function() {
                                // $mdDialog.hide()
                                $state.go( 'home' )
                            }
                            
                            $scope.close_image = function() {
                                // $mdDialog.hide()
                                $state.go( 'home' )
                            }
                          }],

                        clickOutsideToClose: false
                    })
                }), function error( err ) {
                    console.log( err )
                }
                
            }],
            onExit: [ '$rootScope', '$mdDialog', function( $rootScope, $mdDialog ) {
                $mdDialog.hide()
            }] 
            
        })

        $stateProvider.state("contact", {
            url: "/contact",
            views: {
                'nav': {
                    templateUrl: "../angular-views/static-views/nav.html",
                    controller: "navController"
                },
                'body':{
                    controller: "contactController",
                    templateUrl: "../angular-views/static-views/contact.html"
                }
            }
            
        })

        $stateProvider.state( 'category', {
            url: "/category/{id}",
            views: {
                'nav': { 
                    templateUrl: "../angular-views/static-views/nav.html",
                    controller: "navController"
                },
                'body': {
                    controller: 'categoryController',
                    templateUrl: '../angular-views/static-views/view-category.html'
                }
            }
        })

        $stateProvider.state("login", {
            url: "/login",
            views: {
                
                'body':{
                    controller: "authController",
                    templateUrl: "../angular-views/static-views/login.html"
                }
            }
            
        })

        $stateProvider.state('register', {
            url: "/register",
            views: {
                
                'body':{
                    controller: "authController",
                    templateUrl: "../angular-views/static-views/register.html"
                }
            }
            
        })

        $stateProvider.state('admin', {
            url: "/admin-page",
            views: {
                'nav': {
                    templateUrl: "../angular-views/static-views/nav.html",
                    controller: "navController"
                },
                'body':{
                    controller: "adminController",
                    templateUrl: "../angular-views/admin-views/admin-page.html"
                }
            },
            resolve: {
                authenticated: [
                    "$http", "$q", "$rootScope", '$state', 'Alertify', function( $http, $q, $rootScope, $state, Alertify ){
                        var defer = $q.defer()
                        $http({
                            method: 'GET',
                            url: window.location.origin + '/user',
                            headers: {
                                "Authorization": "Bearer " + window.localStorage.getItem( 'token' )
                            }
                        }).then( function( res ) {
                            console.log( res )
                            if( res.data.admin ) {
                                defer.resolve()
                            } else {
                                $state.go( 'login' )
                                defer.reject( 'not admin' )
                            }
                            
                        }).catch( function( err ) {
                            Alertify.error( 'Not logged in' )
                            $state.go( 'login' )
                            defer.reject( 'not admin' )
                        })

                        return defer.promise
                    }
                ]
            },
            onEnter: [ '$rootScope', function( $rootScope ) {
                document.getElementsByTagName("html")[0].style = "background-color: #e9ebee;"
                document.getElementsByTagName("body")[0].style = "background-color: #e9ebee;"
            }],
            onExit: [ '$rootScope', function( $rootScope ) {
                document.getElementsByTagName("html")[0].style = "background-color: #FFF;"
                document.getElementsByTagName("body")[0].style = "background-color: #FFF;"
            }]
            
        })

        // $stateProvider.state("user", {
        //     url: "/user",
        //     controller: "user-controller",
        //     templateUrl: "../angular-views/user-views/user.html"
        // })
    }
])



app.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
});


app.directive('pin', function() {
    return {
        restrict: 'AE',
        
        templateUrl: '../angular-views/dialogs/pin.html'
        
    }
})

app.directive('pin2', function() {
    return {
        restrict: 'AE',
        
        templateUrl: '../angular-views/dialogs/pin2.html'
        
    }
})

app.directive( 'social', function() {
    return {
        restrict: 'AE',
        templateUrl: '../angular-views/dialogs/social.html'
    }
})


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
});