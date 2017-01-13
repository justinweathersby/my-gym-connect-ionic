app.controller('MyAccountCtrl', function($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup,$ionicPlatform, currentUser, currentUserService, $cordovaCamera, $cordovaDialogs, GYM_CONNECT_API){
  $scope.WorkoutLevels = ['beginner','intermediate','expert'];
  $scope.Genders = ['male', 'female'];
  $scope.WorkoutTimes = ['morning', 'afternoon', 'night', 'all'];
  $scope.GenderMatch = ['male', 'female', 'both'];

  $scope.imgLoadingCircle = "<spinner-blue.gif>";
  $scope.base64ImageData = '';

  $scope.userLoaded = false;

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  currentUserService.getUser().success(function(){
    console.log("Inside myaccount ctrl current user success");
    $scope.current_user = currentUser;
    $scope.userLoaded = true;
    $ionicLoading.hide();

  }).error(function(error){
    console.log("Error in myAccount Ctrl");
    console.log("Error ", JSON.stringify(error, null, 4));
    if (error.errors === "Not authenticated"){
      $cordovaDialogs.alert(
        "Sorry you have been logged out. Please re-login",
        "Woops",  // a title
        "OK"                                // the button text
      );
    }
    $state.go('login')
    $ionicLoading.hide();
  });
});
