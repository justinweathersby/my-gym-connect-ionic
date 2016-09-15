app.controller('SignupCtrl', function($scope,$state, $http, $stateParams, $ionicPopup, authService, GYM_CONNECT_API)
{
  $scope.createUser = function(user)
  {
  	console.log(user);
  	$http.post(GYM_CONNECT_API.url + "/users", {user: {email: user.email,
                                                       password: user.password,
                                                       name: user.name}, gym_code: user.gym_code})
  	.success( function (data) {
      console.log("Returned Success Data> ");
      console.log(JSON.stringify(data, null, 4));

      authService.login(user);
      // window.location.reload();
  		$state.go('myAccount');
  	})
    .error( function(error)
    {
      // window.plugins.toast.showShortCenter('username already taken');
      var alertPopup = $ionicPopup.alert({
        title: 'Sorry',
        template: error.errors
      });
    });

  };

});
