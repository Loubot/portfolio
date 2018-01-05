'use strict'


var app = angular.module( 'portfolio', [ 
    'ngMaterial',
    'ui.router',
    'Alertify',
    'angular-loading-bar'
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


app.factory( 'imageClass', [ '$rootScope', function( $rootScope ) {
    
    var calculate = function( height, width ) {
        if ( ( height / width ) > 1 ) {
            return "portrait"
        } else {
            return "landscape"
        }
    }

    return calculate
}])

app.config( [ "$stateProvider" , "$urlRouterProvider", "$locationProvider", 
    function( $stateProvider, $urlRouterProvider, $locationProvider ) {

        $locationProvider.html5Mode({ enabled: true, requireBase: false });
        
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

        $stateProvider.state("/login", {
            url: "/login",
            views: {
                
                'body':{
                    controller: "staticController",
                    templateUrl: "../angular-views/static-views/login.html"
                }
            }
            
        })

        $stateProvider.state('register', {
            url: "/register",
            views: {
                
                'body':{
                    controller: "staticController",
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
            }
            
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


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
});