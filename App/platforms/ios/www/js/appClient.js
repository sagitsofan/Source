var ctrlApp = angular.module('app', ['ionic'])
.run(function ($ionicPlatform) {

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
            StatusBar.overlaysWebView(true);
            StatusBar.style(2)
        }




    });
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.navBar.alignTitle("center");




    $stateProvider.state('tabs', {
        url: '/tabs',
        templateUrl: 'views/tabs.html'
    });
    
    $urlRouterProvider.otherwise('/tabs');
});