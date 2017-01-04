var app = angular.module('my-gym-connect-app', ['ionic', 'ngCordova', 'ngAnimate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    TestFairy.begin('993218db594324f249e28bfa5a72f74f0d21732d');

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.directive('matchslider', function($timeout) {
  return {
    restrict: 'AE',
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.currentIndex = 0; // Initially the index is at the first image
      $scope.next = function() {
        $scope.currentIndex < $scope.matches.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
      };
      $scope.prev = function() {
        $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.matches.length - 1;
      };
      $scope.$watch('currentIndex', function() {
        $scope.matches.forEach(function(match) {
          match.visible = false; // make every image invisible
        });
        $scope.matches[$scope.currentIndex].visible = true; // make the current image visible
      });
    },
    templateUrl: 'templates/partials/match-slider.html'
  };
});

app.filter('capitalizeFirst', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
