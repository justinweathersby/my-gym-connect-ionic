app.controller('SignupTutorialCtrl', function($scope, $state, $cordovaCamera, $sce,
                                              $ionicPopup, $ionicLoading, $ionicPlatform, $ionicViewSwitcher, $ionicHistory,
                                              currentUser, currentUserService,
                                              GYM_CONNECT_API)
{
  $scope.current_user = currentUser;
  // $scope.current_user.second_image_url = "https://s3.amazonaws.com/my-gym-connect-staging/users/images/000/000/082/medium/image.jpg?1482980133";
  // $scope.current_user.third_image_url = "https://s3.amazonaws.com/my-gym-connect-staging/users/images/000/000/082/medium/image.jpg?1482980133";
  // $scope.current_user.image_url = "https://s3.amazonaws.com/my-gym-connect-staging/users/images/000/000/082/medium/image.jpg?1482980133";
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

  $scope.check = {
scale: 'best-fill',
 onLoad: function(imagecontainer, container) {},
   onError: function(imagecontainer, container) {},
   onStart: function(imagecontainer, container) {},

/**
 Align the image within its frame. Possible values:

 * **left**
 * **right**
 * **center**
 * **top**
 * **bottom**
 * **top-left**
 * **top-right**
 * **bottom-left**
 * **bottom-right**

 @type String
 @default center
 @since Version 1.2
*/
align: 'center',
parent: null,
hideParentOverflow: true,
fadeInDuration: 0,
rescaleOnResize: false,
didScale: function(firstTime, options) {},

};

  $scope.ionicHistoryBack = function(){
    $ionicHistory.goBack();
  }

  $scope.NameDescNext = function(){
    console.log("Names Desc NExt clicked");
    if ($scope.current_user.name != null || $scope.current_user.description != null){
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
    if($scope.current_user.workout_time != null){
      if ($scope.workoutForm.$dirty){ updateUser('5th-step');}
      else{ $ionicViewSwitcher.nextDirection('forward');
            $state.go('5th-step');
      }
    }
    else{ confirmNext('5th-step'); }
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
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $ionicLoading.hide(); //--Hide loading for camera
          currentUser.second_image_url = imageURI;
          imageUpload(imageURI, "second_image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });
      }, false); // device ready
  };

  $scope.selectThirdImage = function(){
      $ionicPlatform.ready(function() {
      console.log("Device is ready..")
      var options = {
          quality: 100,
          targetWidth: 700,
          targetHeight: 700,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };
      $cordovaCamera.getPicture(options).then(function(imageURI) {
        $ionicLoading.hide(); //--Hide loading for camera
        currentUser.third_image_url = imageURI;
        imageUpload(imageURI, "third_image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));

      }, function(err) {
          console.log("Did not get image from library");
          $ionicLoading.hide();
      });
     }, false); // device ready
  };

  $scope.selectMainImage = function() {
    console.log('Selected option to upload a picture...');

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
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $ionicLoading.hide(); //--Hide loading for camera
          currentUser.image = imageURI;
          imageUpload(imageURI, "image", encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id));

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });

       }, false); // device ready
  }; // Select picture

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  function imageUpload(imageURI, fileKey, uri){
    //------File Transfer of Image to Server
    var Uoptions = new FileUploadOptions();
    Uoptions.fileKey = fileKey;
    Uoptions.mimeType ="image/jpeg";
    Uoptions.chunkedMode = false;
    Uoptions.params = {};
    Uoptions.headers = {'Authorization' : currentUser.token};

    var ft = new FileTransfer();

    var win = function (r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
      $ionicLoading.hide();
    }

    var fail = function (error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
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
            console.log("In If, loadingStatus: ", $scope.loadingStatus);
        } else {
            loadingStatus += .1;
            console.log("In else, loadingStatus: ", $scope.loadingStatus);

        }
    };
    console.log("About to start file upload");
    ft.upload(imageURI, uri, win, fail, Uoptions);
    //------End File Transfer
  };
});
