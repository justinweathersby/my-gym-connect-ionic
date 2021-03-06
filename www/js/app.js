var app = angular.module('my-gym-connect-app', ['ionic', 'ionic.cloud', 'ngCordova', 'ngAnimate', 'angularMoment'])

.run(function($ionicPlatform, $ionicPush, currentUser) {
  $ionicPlatform.ready(function() {
    // setTimeout(function() {
    //   console.log("Ready");
    // }, 8000);
    $ionicPush.register().then(function(t) {
      // setTimeout(function() {
      //   console.log("DEVICE T: ", t);
      // }, 10000);
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      currentUser.device_token = t.token;
      currentUser.device_type = t.type;
      // setTimeout(function() {
      //   console.log("DEVICE TOKEN: ", t.token);
      //   console.log("DEVICE TYPE: ", t.type);
      // }, 10000);
    });

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
    link: function($scope, element, attrs) {
      $scope.matches.forEach(function(match) {
        match.visible = false; // make every image invisible
      });

      // console.log("ELEMENT: ", JSON.stringify(element));

      $scope.currentIndex = 0; // Initially the index is at the first image

      $scope.next = function() {
        var children = element.children();
        for(var i=0;i<children.length;i++){
            angular.element(children[i]).removeClass('slide-in-smooth-left');
            angular.element(children[i]).addClass('slide-in-smooth-right');
        }
        $scope.matches[$scope.currentIndex].visible = false;
        $scope.currentIndex < $scope.matches.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
      };

      $scope.prev = function() {
        var children = element.children();
        for(var i=0;i<children.length;i++){
            angular.element(children[i]).removeClass('slide-in-smooth-right');
            angular.element(children[i]).addClass('slide-in-smooth-left');
        }

        $scope.matches[$scope.currentIndex].visible = false;
        $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.matches.length - 1;
      };

      $scope.$watch('currentIndex', function() {
        console.log("Current Index is changing: " + $scope.currentIndex);
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

app.directive('accountImageSlider', function($timeout) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      user: '='
    },
    link: function(scope, elem, attrs) {
      console.log("Account Slider User: ", scope.user);

      scope.currentIndex = 0; // Initially the index is at the first image
      scope.profileImages = [{image: scope.user.image_url}];
      if (scope.user.second_image_url){scope.profileImages.push({image: scope.user.second_image_url});}
      if (scope.user.third_image_url){scope.profileImages.push({image: scope.user.third_image_url});}
      console.log("Profile Images: ", scope.profileImages);

      scope.next = function() {
        scope.currentIndex < scope.profileImages.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
      };
      scope.prev = function() {
        scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.profileImages.length - 1;
      };
      scope.$watch('currentIndex', function() {
        scope.profileImages.forEach(function(image) {
          image.visible = false; // make every image invisible
        });
        scope.profileImages[scope.currentIndex].visible = true; // make the current image visible
      });

      var timer;
      var sliderFunc = function() {
        timer = $timeout(function() {
          scope.next();
          timer = $timeout(sliderFunc, 5000);
        }, 5000);
      };

      sliderFunc();

      scope.$on('$destroy', function() {
        $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
      });

    },
    templateUrl: 'templates/partials/account-image-slider.html'

  };
});

app.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return val != null ? parseInt(val, 10) : null;
      });
      ngModel.$formatters.push(function(val) {
        return val != null ? '' + val : null;
      });
    }
  };
});

app.filter('capitalizeFirst', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
