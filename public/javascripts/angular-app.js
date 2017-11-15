'use strict'


var app = angular.module( 'portfolio', [ 
    'ngMaterial',
    'ui.router'
] )


app.config( [ "$stateProvider" , "$urlRouterProvider", "$locationProvider", 
    function( $stateProvider, $urlRouterProvider, $locationProvider ) {

        $locationProvider.html5Mode({ enabled: true, requireBase: false });
        
        $stateProvider.state("home", {
            url: "/",
            controller: "staticController",
            templateUrl: "../angular-views/static-views/index.html"
        })

        $stateProvider.state('admin', {
            url: "/admin-page",
            controller: "adminController",
            templateUrl: "../angular-views/admin-views/admin-page.html"
        })

        // $stateProvider.state("user", {
        //     url: "/user",
        //     controller: "user-controller",
        //     templateUrl: "../angular-views/user-views/user.html"
        // })
    }
])


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
});