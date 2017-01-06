app.controller('LoginCtrl', function($scope, $http, $state,
                                     $ionicLoading, $ionicPopup, $cordovaOauth,
                                     authService, currentUser, currentUserService,
                                     GYM_CONNECT_API, FACEBOOK_APP) {

  $scope.login = function(user) {
    $ionicLoading.show({
     template: '<p>Loading...</p><ion-spinner></ion-spinner>',
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
  // $cordovaOauth.facebook(string clientId, array appScope, object options);

  function getGymCodePopup() {
    $scope.gymInputData = {};
    $scope.gymInputPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="gymInputData.gym_code">',
        title: 'Enter Gym Code',
        subTitle: 'This is obtained from your gym',
        cssClass: 'showMessagePopup',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            type: 'button-small'},
          {
            text: '<b>Continue</b>',
            type: 'button-small button-positive',
            onTap: function(e) {
              if (!$scope.gymInputData.gym_code) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.gymInputData.gym_code;
              }
            }
          }
        ]
      })
    };

  $scope.LoginwithFacebook = function(){
    console.log("login with facebook clicked");
    $ionicLoading.show({
     template: '<p>Loading...</p><ion-spinner></ion-spinner>',
     duration: 6000,
     hideOnStageChange: true
    });
    // $cordovaOauth.facebook(FACEBOOK_APP.id, ["email"]).then(function(result) {
    //   currentUser.facebook_access_token = result.access_token;
      currentUser.facebook_access_token = "EAARnkcSTGcEBAH3ohhXrBk2ssoIEyQWddNAg8SDRFqaLezLfQNJbZCn7A06oYkq3uT1oIKPUuMng5Pfqc0us7rjxs5kZA4Q8Phkn8L6M2XwR2bS0exWQLEmrD3mhIjd95NC8JrA77QX2gWNHMkUx4ZA8dh5GvsZD";
      //--Check if user exists, try to log in

      // console.log("Auth Success..!!"+ JSON.stringify(result));
      $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: currentUser.facebook_access_token, fields: "id, name, gender, email, location,picture", format: "json" }}
                ).then(function(result) {
	                // $scope.profileData = result.data
                  console.log("After facebook call oath", JSON.stringify(result.data));
                  alert("Facebook call after oath!!"+ JSON.stringify(result.data));
                  if (result.data.name) { currentUser.name = result.data.name;}
                  if (result.data.email) { currentUser.email = result.data.email;}
                  if (result.data.gender) { currentUser.gender = result.data.gender;}
                  var user = {
                    "email": currentUser.email,
                    "password": result.data.id
                  };
                  // user.email = currentUser.email;
                  // user.password = result.data.id;
                  authService.login(user).success(function(){
                    console.log('Login Success, Token: ', currentUser.token);
                    console.log('Sign-In', user);
                    $state.go('tab.dash');
                    $ionicLoading.hide();
                  }).error(function(error){
                    console.log("Error from login " + JSON.stringify(error));
                    $ionicLoading.hide();
                    if(error.errors){
                      if(error.errors == "Invalid email or password"){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Weird..',
                          template: "The account that corresponds with your Facebook email has a password already setup. Please try to login without Facebook. Contact support if you believe this to be in error."
                        });
                        $state.go('login');
                      }
                      else if(error.errors == "User not found"){
                        user.gym_code = getGymCodePopup();
                        $scope.gymInputPopup.then(function(){
                          console.log("Facebook login--> about to create user:", JSON.stringify(user));
                          currentUserService.createUser(user)
                          .success(function(data){
                            $state.go('1st-step');
                          }).error(function(error){
                            var alertPopup = $ionicPopup.alert({
                              title: 'Sorry',
                              template: "An Error Occured While Loging You In. Please wait and try again. If problem persists please contact support with these errors: " + error.errors
                            });
                            $state.go('login');
                          });
                        });
                      }
                      else{
                        var alertPopup = $ionicPopup.alert({
                          title: 'Error',
                          template: "Login failed. If this problem persists please report this Error: " + JSON.stringify(error.errors)
                        });
                        console.log("Facebook login error: ", JSON.stringify(error.errors));
                      }
                    }
                    else{
                      var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: "Please check your internet connection. Contact support if this problem continues."
                      });
                      $state.go('login');
                    }
                  });

	            }, function(error) {
                  var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Facebook credentials failed. Error: " + JSON.stringify(error)
                  });
	                console.log(error);
	            });
    //   }, function(error) {
    //         var alertPopup = $ionicPopup.alert({
    //           title: 'Facebook Login Unsuccessful',
    //           template: "Error: " + JSON.stringify(error)
    //         });
    // });
   };


  // An alert dialog
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Don\'t eat that!',
      template: 'It might taste good'
    });

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
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
