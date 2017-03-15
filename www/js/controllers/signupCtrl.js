app.controller('SignupCtrl', function($scope,$state, $http, $stateParams,
                                      $ionicPopup, $ionicLoading,$cordovaDialogs,
                                      authService, currentUser, GYM_CONNECT_API){

  $scope.createUser = function(user){
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

    if ($scope.signupForm.$valid){
      $http.post(GYM_CONNECT_API.url + "/users", {user: {email: user.email,
                                                         password: user.password},
                                                         gym_code: user.gym_code})
      .success( function (data) {
        console.log("Returned data from create user: " + JSON.stringify(data));
        authService.login(user)
        .success(function(){
          localforage.setItem('user_token', currentUser.token).then(function (value) {
              // Do other things once the value has been saved.
              console.log("SUCCESSFULLY STORED TOKEN AFTER AUTHSERVICE");
              console.log(value);

              localforage.setItem('user_id', currentUser.id).then(function (value) {
                  $state.go('1st-step');
              }).catch(function(err) {
                  console.log("SET ITEM ERROR::Controller::signupCtrl::token::",err);
              });

          }).catch(function(err) {
              // This code runs if there were any errors
              console.log("SET ITEM ERROR::Controller::signupCtrl::token::",err);
          });

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
