app.controller('LoginCtrl', function($scope, $http, $ionicLoading, $state, $ionicPopup, authService, currentUser, GYM_CONNECT_API) {

  $scope.login = function(user) {
    $ionicLoading.show({
     template: '<p style="font-family:Brandon;color:grey;">Logging in</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
     hideOnStageChange: true
    });

    if ($scope.loginForm.$valid){
      authService.login(user).success(function(){
        $ionicLoading.hide();
        console.log('Login Success, Token: ', currentUser.token);
        console.log('Sign-In', user);
        // localStorage.setItem('user', user.email);
        // alert(user.email);
        // alert(localStorage.getItem('user'));
        // localStorage.setItem('token', currentUser.token);
        // localStorage.setItem('id', currentUser.id);
        //window.location.reload();
        $state.go('myAccount');
      }).error(function()
      {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login Unsuccessful',
          template: "Email and password did not match our records."
        });
      });
    }
  }; //end of login function
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
