app.controller('LoginCtrl', function($scope, $http, $ionicLoading, $state, $ionicPopup, authService, currentUser, GYM_CONNECT_API) {

  $scope.login = function(user) {
    $ionicLoading.show({
     template: '<p style="font-family:Brandon;color:grey;">Logging in</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
     duration: 6000,
     hideOnStageChange: true
    });

    if ($scope.loginForm.$valid){
      authService.login(user).success(function(){
        // console.log('Login Success, Token: ', currentUser.token);
        // console.log('Sign-In', user);
        $state.go('tab.dash');
        $ionicLoading.hide();
      }).error(function(){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login Unsuccessful',
          template: "Email and password did not match our records."
        });
      });
    }
    else{
      $ionicLoading.hide();
    }
  };

  $scope.resetPassword = function(email) {

    $ionicLoading.show({
     template: '<p style="font-family:Brandon;color:grey;">Checking to see if your account exists..</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
     hideOnStageChange: true
    });

    if ($scope.forgotPasswordForm.$valid){
      $http({method: 'POST', url: GYM_CONNECT_API.url + '/reset_password?email=' + email})
        .success( function( data )
        {
          $ionicLoading.hide();
          $ionicPopup.alert({
             title: 'Thank You',
             content: 'An email has been sent to the email provided with instructions to reset your password.'
           });
           $state.go('login');
        }
      )
      .error( function(error)
      {
        $ionicLoading.hide();
        $ionicPopup.alert({
           title: 'Woops..',
           content: 'The email you have entered does not exist in our records'
         });
         $state.go('signup');
      });
    }
    else {
      $ionicLoading.hide();
    }
  };//end of reset password function

  //end of login function
  $scope.goToSignUp = function() {
    $state.go('signup');
  };

  $scope.goToLogin = function() {
    $state.go('login');
  };

  // $scope.goToForgotPassword = function() {
  //   $state.go('forgot-password');
  // };
});
