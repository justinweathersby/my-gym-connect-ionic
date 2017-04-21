app.controller('SignupTutorialCtrl', function($scope, $state, $cordovaCamera, $sce,
                                              $ionicPopup, $ionicLoading, $ionicPlatform, $ionicViewSwitcher, $ionicHistory, $cordovaDialogs,
                                              currentUser, currentUserService,
                                              GYM_CONNECT_API)
{
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

  console.log("CURRENTUSER: ", JSON.stringify(currentUser));
  if (currentUser.id == null){
    $state.go('tab.myAccount');
  }

    $scope.current_user = currentUser;


  $scope.WorkoutLevels = ['beginner','intermediate','advanced'];
  $scope.Genders = ['male', 'female'];
  $scope.WorkoutTimes = ['morning', 'afternoon', 'night', 'all'];
  $scope.GenderMatch = ['male', 'female', 'both'];
  $scope.WorkoutPreference = ['free weight', 'machines', 'both'];
  $scope.AttendClasses= ['yes', 'no'];
  $scope.CardioPerWeek = ['none', '< 15 minutes', 'an hour', 'a few hours', 'very often', 'continuously', 'I only do Cardio'];

  $scope.skipTutorial = function(){
    $cordovaDialogs.confirm(
      "Are you sure you want to skip setting up your account?",
      "Wait",
      ['Cancel', 'Skip']
    ).then(function(res){
      if(res == 2) {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('tab.myAccount');
      }
    });
  };

  $scope.ionicHistoryBack = function(){
    $ionicHistory.goBack();
  }

  $scope.NameDescNext = function(){
    console.log("Names Desc NExt clicked");
    if ($scope.current_user.name != null){
      console.log("Inside current_user name and desc not null");
      if ($scope.nameDescForm.$dirty){
        console.log("Inside name descform diry");
        updateUser('3rd-step');}
      else{
            console.log("Inside else ... go to 3rd step");
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('3rd-step');
      }
    }
    else{ confirmNext('3rd-step'); }
  };

  $scope.ImagesNext = function(){
    if ($scope.current_user.image_url == null){
      confirmNext('4th-step');
    }
    else{
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('4th-step');
    }
  };

  $scope.WorkoutNext = function(){
    // if($scope.current_user.workout_time != null){
      if ($scope.workoutForm.$dirty){ updateUser('5th-step');}
      else{ $ionicViewSwitcher.nextDirection('forward');
            $state.go('5th-step');
      }
    // }
    // else{ confirmNext('5th-step'); }
  };

  $scope.GenderNext = function(){
    if($scope.current_user.gender && $scope.current_user.gender_match){
      if ($scope.genderForm.$dirty){ updateUser('tab.myAccount');}
      else{ $ionicViewSwitcher.nextDirection('forward');
            $state.go('tab.myAccount');
      }
    }
    else{ confirmNext('tab.myAccount');}
  };

  function confirmNext(view){
    console.log("Inside confirm Next");
    $cordovaDialogs.confirm(
      "Are you sure you want to continue without setting up all of the fields?",
      "Wait",
      ['Cancel', 'Skip']
    ).then(function(res){
      console.log("dialog confirm cancel or skip: ", res);
      if(res == 2) {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go(view);
      }
    });
    // var confirmPopup = $ionicPopup.confirm({
    //   title: 'Wait',
    //   template: "Are you sure you want to continue without setting up all of the fields?"
    // }).then(function(res){
    //   if(res) {
    //     console.log('You are sure');
    //     $ionicViewSwitcher.nextDirection('forward');
    //     $state.go(view);
    //   } else {
    //     console.log('You are not sure');
    //   }
    // });
  };


  function updateUser(view){
    $ionicLoading.show({
        template: '<p>Updating your information please wait...</p><ion-spinner></ion-spinner>'
    });
    localforage.getItem('user_token').then(function(value) {
      currentUser.token = value;
      localforage.getItem('user_id').then(function(value) {
        currentUser.id = value;
        currentUserService.updateUser().success(function(){
          $ionicLoading.hide();
          $ionicViewSwitcher.nextDirection('forward');
          $state.go(view);

        }).error(function(){
          $ionicLoading.hide();
          $cordovaDialogs.alert(
            "Sorry you have been logged out. Please re-login",
            "Woops",  // a title
            "OK"                                // the button text
          ).then(function(res){
            $state.go('login');
          });
        });
      }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});
    }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});
  };


  $scope.selectSecondImage = function(){
    $ionicLoading.show({
        template: '<p>Warming Camera Up...</p><ion-spinner></ion-spinner>',
        duration: 6000
    });
    $ionicPlatform.ready(function() {
        console.log("Device is ready..")
        var options = {
            quality: 100,
            targetWidth: 700,
            targetHeight: 700,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $ionicLoading.hide(); //--Hide loading for camera
          currentUser.second_image_url = imageURI;
          localforage.getItem('user_id').then(function(value) {
            currentUser.id = value;
            imageUpload(imageURI, "second_image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));
          }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });
      }, false); // device ready
  };

  $scope.selectThirdImage = function(){
      $ionicPlatform.ready(function() {
      var options = {
          quality: 100,
          targetWidth: 700,
          targetHeight: 700,
          destinationType: Camera.DestinationType.FILE_URI,
          correctOrientation: true
      };
      $cordovaCamera.getPicture(options).then(function(imageURI) {
        $ionicLoading.hide(); //--Hide loading for camera
        currentUser.third_image_url = imageURI;
        localforage.getItem('user_id').then(function(value) {
          currentUser.id = value;
          imageUpload(imageURI, "third_image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));
        }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});

      }, function(err) {
          console.log("Did not get image from library");
          $ionicLoading.hide();
      });
     }, false); // device ready
  };

  $scope.selectMainImage = function() {

    $ionicLoading.show({
        template: '<p>Warming Camera Up...</p><ion-spinner></ion-spinner>',
        duration: 6000
    });

    $ionicPlatform.ready(function() {
        console.log("Device is ready..")
        var options = {
            quality: 75,
            targetWidth: 700,
            targetHeight: 700,
            correctOrientation: true,
            destinationType: Camera.DestinationType.FILE_URI
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $ionicLoading.hide(); //--Hide loading for camera
          currentUser.image_url = imageURI;
          localforage.getItem('user_id').then(function(value) {
            currentUser.id = value;
            imageUpload(imageURI, "image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));
          }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });

       }, false); // device ready
  }; // Select picture

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };

  function imageUpload(imageURI, fileKey, uri){
    //------File Transfer of Image to Server
    localforage.getItem('user_token').then(function(value) {
      currentUser.token = value;
      var Uoptions = new FileUploadOptions();
      Uoptions.fileKey = fileKey;
      Uoptions.mimeType ="image/jpeg";
      Uoptions.chunkedMode = false;
      Uoptions.params = {};
      Uoptions.headers = {'Authorization' : currentUser.token};

      var ft = new FileTransfer();

      var win = function (r) {
        $ionicLoading.hide();
      }

      var fail = function (error) {
        $cordovaDialogs.alert(
          "An error has occurred: Code = " + error.code,
          "Sorry",
          "OK"
        );
        $ionicLoading.hide();
      }

      ft.onprogress = function(progressEvent) {
          var loadingStatus = 0;
          $ionicLoading.show({
              template: '<p>Uploading Image.</p><progress max="100" value=' + loadingStatus +'></progress>',
              scope: $scope
          });

          if (progressEvent.lengthComputable) {
              loadingStatus = (progressEvent.loaded / progressEvent.total) * 100;
              $ionicLoading.show({
                  template: '<p>Uploading Image.</p><progress max="100" value='+ loadingStatus +'></progress>',
                  scope: $scope
              });
          } else {
              loadingStatus += .1;
          }
      };
      console.log("About to start file upload");
      ft.upload(imageURI, uri, win, fail, Uoptions);
      //------End File Transfer
    }).catch(function(err) { console.log("GET ITEM ERROR::Services::updateUser::id::", err);});
  };
});
