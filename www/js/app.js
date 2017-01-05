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

app.directive('profileimageslider', function($timeout) {
  return {
    restrict: 'AE',
    replace: true,
    link: function($scope, elem, attrs) {
      $scope.curProfileImageIndex= 0; // Initially the index is at the first image
      $scope.profileImages = [{image: $scope.matchSelected.image_url}];
      if ($scope.matchSelected.second_image_url){$scope.profileImages.push({image: $scope.matchSelected.second_image_url});}
      if ($scope.matchSelected.third_image_url){$scope.profileImages.push({image: $scope.matchSelected.third_image_url});}
      console.log("Profile Images: ", $scope.profileImages);

      $scope.next = function() {
        $scope.curProfileImageIndex < $scope.profileImages.length - 1 ? $scope.curProfileImageIndex++ : $scope.curProfileImageIndex = 0;
      };
      $scope.prev = function() {
        $scope.curProfileImageIndex > 0 ? $scope.curProfileImageIndex-- : $scope.curProfileImageIndex = $scope.profileImages.length - 1;
      };
      $scope.$watch('curProfileImageIndex', function() {
        $scope.profileImages.forEach(function(image) {
          image.visible = false; // make every image invisible
        });
        $scope.profileImages[$scope.curProfileImageIndex].visible = true; // make the current image visible
      });

      var timer;
      var sliderFunc = function() {
        timer = $timeout(function() {
          $scope.next();
          timer = $timeout(sliderFunc, 5000);
        }, 5000);
      };

      sliderFunc();

      $scope.$on('$destroy', function() {
        $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
      });
    },
    templateUrl: 'templates/partials/profile-image-slider.html'
  };
});

app.directive('imageOrientationCrop', function(){
   return {
     restrict: 'A',
     link: function(scope, elem, attr) {
         elem.on('load', function() {
            var img = elem[0];
            var imgWidth = img.naturalWidth;
            var imgHeight = img.naturalHeight;
            if (imgHeight > imgWidth){
            elem.addClass('imagePortrait');
            }
            //check width and height and apply styling to parent here.
         });
     }
   };
});

app.filter('capitalizeFirst', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
