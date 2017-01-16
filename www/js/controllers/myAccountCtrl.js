app.controller('MyAccountCtrl', function($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup,$ionicPlatform, currentUser, currentUserService, $cordovaCamera, $cordovaDialogs, GYM_CONNECT_API){
  // $scope.$on('cloud:push:notification', function(event, data) {
  //   var msg = data.message;
  //   $cordovaDialogs.alert(
  //     msg.text,  // the message
  //     msg.title, // a title
  //     "OK"       // the button text
  //   ).then(function() {
  //     $cordovaBadge.clear();
  //   });
  // });

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

  localforage.getItem('user_token').then(function(value) {
    currentUser.token = value;
    localforage.getItem('user_id').then(function(value) {
      currentUser.id = value;

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
    }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});
  }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::token::", err);});

});
