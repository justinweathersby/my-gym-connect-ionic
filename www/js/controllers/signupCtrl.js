app.controller('SignupCtrl', function($scope,$state, $http, $stateParams,
                                      $ionicPopup, $ionicLoading,$cordovaDialogs,
                                      authService, GYM_CONNECT_API){

  $scope.createUser = function(user){
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

    if ($scope.signupForm.$valid){
      $http.post(GYM_CONNECT_API.url + "/users", {user: {email: user.email,
                                                         password: user.password},
                                                         gym_code: user.gym_code})
      .success( function (data) {
        authService.login(user)
        .success(function(){
          $state.go('1st-step');
        }).error(function(error){

          $cordovaDialogs.alert(
            "An Error Occured While Loging You In. Please wait and try again. If problem persists please contact support with these errors: " + JSON.stringify(error),
            "Woops",  // a title
            "OK"                                // the button text
          );
        });
      })
      .error( function(error)
      {
        errorString = "";
        angular.forEach(error.errors, function(value, key) {
          console.log("Error in signup=====> " + key + ': ' + value);
          errorString += key + ': ' + value + '\n';
        });
        $cordovaDialogs.alert(
          "An Error Occured While Creating Your Account.\n\n" + errorString,
          "Sorry",  // a title
          "OK"                                // the button text
        );
      })
      .finally(function() {
          $ionicLoading.hide();
      });
    }
    else{
      $ionicLoading.hide();
    }
  };//end createUser

});
