app.controller('SignupCtrl', function($scope,$state, $http, $stateParams,
                                      $ionicPopup, $ionicLoading,
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
        console.log("Returned Success Data> ");
        console.log(JSON.stringify(data, null, 4));

        authService.login(user)
        .success(function(){
          $state.go('1st-step');
        }).error(function(error){
          var alertPopup = $ionicPopup.alert({
            title: 'Sorry',
            template: "An Error Occured While Loging You In. Please wait and try again. If problem persists please contact support with these errors: " + error.errors
          });
        });
      })
      .error( function(error)
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Sorry',
          template: "An Error Occured While Creating Your Account. Please wait and try again. If problem persists please contact support with these errors: " + error.errors
        });
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
