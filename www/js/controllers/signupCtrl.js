app.controller('SignupCtrl', function($scope,$state, $http, $stateParams, $ionicPopup, $ionicLoading, authService, GYM_CONNECT_API)
{
  $scope.createUser = function(user)
  {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

  	$http.post(GYM_CONNECT_API.url + "/users", {user: {email: user.email,
                                                       password: user.password,
                                                       name: user.name}, gym_code: user.gym_code})
  	.success( function (data) {
      console.log("Returned Success Data> ");
      console.log(JSON.stringify(data, null, 4));

      authService.login(user)
      .success(function(){
        var alertPopup = $ionicPopup.alert({
          title: 'Welcome!',
          template: "Thanks for choosing Gym Connect. Please complete your profile to begin finding matches."
        });
        $state.go('tab.myAccount');
      }).error(function(error){
        var alertPopup = $ionicPopup.alert({
          title: 'Sorry',
          template: "An Error Occured While Loging You In. Please wait and try again. If problem persists please contact support." + error.errors
        });
      });
  	})
    .error( function(error)
    {
      // window.plugins.toast.showShortCenter('username already taken');
      var alertPopup = $ionicPopup.alert({
        title: 'Sorry',
        template: "An error occured while creating your account.. Please try again. If problem continues please contact support with these errors: " + error.errors
      });
    });

  };

});
