app.controller('LoginCtrl', function($scope, $http, $ionicLoading, $state, $ionicPopup, $cordovaDialogs, authService, currentUser, GYM_CONNECT_API) {
  // var token = localStorage.getItem('token');
  // var storedUser = localStorage.getItem('currentUser');
  // if(storedUser !== null){
  //   // currentUser.token = token;
  //   // currentUser.name  = localStorage.getItem('email');
  //   currentUser = JSON.parse(storedUser);
  //   console.log("Inside login controller:::: " + JSON.stringify(currentUser));
  //   $http.defaults.headers.common['Authorization'] = currentUser.token;
  //   $state.go('tab.dash');
  // };
  localforage.getItem('user_token').then(function(value) {
    var token = value;
    if(token){
      console.log("Token: " + token);
      $state.go('tab.dash');
    }
  }).catch(function(err) { console.log("GET ITEM ERROR::Matches::getMatches::", err);});

  $scope.login = function(user) {
    $ionicLoading.show({
     template: '<p>Loading...</p><ion-spinner></ion-spinner>',
     duration: 6000,
     hideOnStageChange: true
    });

    if ($scope.loginForm.$valid){
      authService.login(user).success(function(){
        localforage.setItem('user_token', currentUser.token).then(function (value) {
            // Do other things once the value has been saved.
            console.log("SUCCESSFULLY STORED TOKEN AFTER AUTHSERVICE");
            console.log(value);

            localforage.setItem('user_id', currentUser.id).then(function (value) {
                // Do other things once the value has been saved.
                console.log("SUCCESSFULLY STORED ID AFTER AUTHSERVICE");
                console.log(value);
                $state.go('tab.dash');
                $ionicLoading.hide();
            }).catch(function(err) {
                // This code runs if there were any errors
                console.log("SET ITEM ERROR::Services::authService::token::",err);
            });

        }).catch(function(err) {
            // This code runs if there were any errors
            console.log("SET ITEM ERROR::Services::authService::token::",err);
        });
      }).error(function(){
        $ionicLoading.hide();
        $cordovaDialogs.alert(
          "Email and password did not match our records",
          "Woops",  // a title
          "OK"                                // the button text
        );
      });
    }
    else{
      $ionicLoading.hide();
    }
  };

  $scope.resetPassword = function(email) {
    $ionicLoading.show({
     template: '<p style="font-family:Brandon;color:grey;">Checking to see if your account exists..</p><ion-spinner></ion-spinner>',
     hideOnStageChange: true
    });

    if ($scope.forgotPasswordForm.$valid){
      $http({method: 'POST', url: GYM_CONNECT_API.url + '/reset_password?email=' + email})
        .success( function( data )
        {
          $ionicLoading.hide();
          $cordovaDialogs.alert(
            "An email has been sent to the email provided with instructions to reset your password.",
            "Thank You",
            "OK"                                // the button text
          );
           $state.go('login');
        }
      )
      .error( function(error)
      {
        console.log('resetPassword err: ', err);
        $ionicLoading.hide();
        $cordovaDialogs.alert(         // the message
          "Email and password did not match our records.", // a title
          "Woops",
          "OK"                                // the button text
        );
         $state.go('signup');
      });
    }
    else {
      $ionicLoading.hide();
    }
  };//end of reset password function

  $scope.goToSignUp = function() {
    $state.go('signup');
  };
  $scope.goToLogin = function() {
    $state.go('login');
  };
});
