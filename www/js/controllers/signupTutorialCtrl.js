app.controller('SignupTutorialCtrl', function($scope, $state,
                                              $ionicPopup, $ionicLoading, $ionicViewSwitcher,
                                              currentUser, currentUserService)
{
  $scope.current_user = currentUser;
  console.log("Reload SignupTutorialCtrl currentUser: ", JSON.stringify($scope.current_user, null, 4));

  $scope.WorkoutLevels = ['beginner','intermediate','expert'];
  $scope.Genders = ['male', 'female'];
  $scope.WorkoutTimes = ['morning', 'afternoon', 'night', 'all'];
  $scope.GenderMatch = ['male', 'female', 'both'];

  $scope.skipTutorial = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Wait',
      template: "Are you sure you want to skip setting up your account?"
    }).then(function(res){
      if(res) {
        console.log('You are sure');
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('tab.myAccount');
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.NameDescNext = function(){
    if ($scope.current_user.name != null || $scope.current_user.description != null){ updateUser('3rd-step');}
    else{ confirmNext('3rd-step'); }
  };

  $scope.ImagesNext = function(){
    confirmNext('4th-step');
  };

  $scope.WorkoutNext = function(){
    if($scope.current_user.workout_time != null){ updateUser('5th-step'); }
    else{ confirmNext('5th-step'); }
  };

  $scope.GenderNext = function(){
    if($scope.current_user.gender && $scope.current_user.gender_match){ updateUser('tab.dash');}
    else{ confirmNext('tab.dash');}
  };

  function confirmNext(view){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Wait',
      template: "Are you sure you want to continue without setting up all of the fields?"
    }).then(function(res){
      if(res) {
        console.log('You are sure');
        $ionicViewSwitcher.nextDirection('forward');
        $state.go(view);
      } else {
        console.log('You are not sure');
      }
    });
  };

  function updateUser(view){
    $ionicLoading.show({
        template: '<p>Updating your information please wait...</p><ion-spinner></ion-spinner>'
    });
    currentUserService.updateUser().success(function(){
      $ionicLoading.hide();
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(view);

    }).error(function(){
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: "Sorry about that. Please try to re-login. If the problem persists please contact us."
      }).then(function(res){
        $state.go('login');
      });
    });
  };
});
