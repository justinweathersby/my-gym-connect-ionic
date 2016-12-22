app.controller('MyAccountCtrl', function($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup,$ionicPlatform, currentUser, currentUserService, $cordovaCamera, GYM_CONNECT_API){
  $scope.WorkoutLevels = ['beginner','intermediate','expert'];
  $scope.Genders = ['male', 'female'];
  $scope.WorkoutTimes = ['morning', 'afternoon', 'night', 'all'];
  $scope.GenderMatch = ['male', 'female', 'both'];

  $scope.imgLoadingCircle = "<spinner-blue.gif>";
  $scope.base64ImageData = '';

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  currentUserService.getUser().success(function(){
    console.log("Inside myaccount ctrl current user success");
    $scope.current_user = currentUser;
    $scope.profileImgSrc = currentUser.image_url;
    $ionicLoading.hide();

  }).error(function(error){
    console.log("Error in myAccount Ctrl");
    console.log("Error ", JSON.stringify(error, null, 4));
    if (error.errors === "Not authenticated"){
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Sorry you have been logged out. Please re-login'
      });
      ;
    }
    $state.go('login')
    $ionicLoading.hide();
  });

  ////--Used in addWorkoutTime Function below
  // $scope.selectedHour = 0;
  // $scope.selectedDay = '';
  // $scope.addWorkoutTime = function(day, hour)
  // {
  //   console.log("Selected day id: ", day);
  //   console.log("Selected hour: ", hour);
  //
  //   var index = (parseInt(day) * 24) + parseInt(hour);
  //
  //   console.log("Calc Index: ", index);
  //   currentUser.hours_in_gym.push(index);
  //   console.log("current user service hours: ", currentUser.hours_in_gym);
  //   $scope.current_user = currentUser;
  // };

  // $scope.indexToDayTime = function(index){
  //   var sunday = new Date("September 04, 2016 00:00:00");
  //   var actualDate = new Date();
  //   actualDate.setTime(sunday.getTime() + (index*60*60*1000));
  //   return actualDate;
  // };

  $scope.updateUser = function(){
    $ionicLoading.show({
        template: '<p>Updating your information please wait...</p><ion-spinner></ion-spinner>'
    });
    console.log("Inside update User function: ",  JSON.stringify(currentUser, null, 4));
    $http({ method: 'POST',
            url: GYM_CONNECT_API.url + "/users/" + currentUser.id,
            data: {
              "name": currentUser.name,
              "gender": currentUser.gender,
              "gender_match": currentUser.gender_match,
              "workout_time": currentUser.workout_time,
              "workout_level": currentUser.workout_level,
              "description": currentUser.description
            },
            headers: {'Authorization' : currentUser.token}

          })
          .success( function( data )
          {
            var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: 'Your account has been successfully updated'
            });
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log("Update User Failed...");
          console.log("Error: ", error);
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'Sorry your account could not be updated. Please log out and try again. If the problem persists please contact support'
          });
          $ionicLoading.hide();

        });
  };

  $scope.selectPicture = function() {
    console.log('Selected option to upload a picture...');

    $ionicLoading.show({
        template: '<p>Warming Camera Up...</p><ion-spinner></ion-spinner>',
        duration: 6000
    });

    $ionicPlatform.ready(function() {
        console.log("Device is ready..")
        var options = {
            quality: 100,
            targetWidth: 300,
            targetHeight: 300,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          $ionicLoading.hide(); //--Hide loading for camera
          currentUser.image = imageURI;
          $scope.profileImgSrc = currentUser.image;

          //------File Transfer of Image to Server
          var Uoptions = new FileUploadOptions();
          Uoptions.fileKey="image";
          Uoptions.mimeType ="image/jpeg";
          Uoptions.chunkedMode = false;
          Uoptions.params = {};
          Uoptions.headers = {'Authorization' : currentUser.token};

          var ft = new FileTransfer();
          console.log('File upload: ', currentUser.image);

          var uri = encodeURI(GYM_CONNECT_API.url + "/users/" + currentUser.id);

          var win = function (r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            $ionicLoading.hide();

          }//--End win

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

          ft.upload(currentUser.image, uri, win, fail, Uoptions);
          //------End File Transfer

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });

       }, false); // device ready
  }; // Select picture

});

// $scope.daysOfWeek = [
//       {id: 0, name: 'Sunday'},
//       {id: 1, name: 'Monday'},
//       {id: 2, name: 'Tuesday'},
//       {id: 3, name: 'Wednesday'},
//       {id: 4, name: 'Thursday'},
//       {id: 5, name: 'Friday'},
//       {id: 6, name: 'Saturday'}
//    ];
// $scope.hoursInDay = [
//      {id: 0, name: '12:00am'},
//      {id: 1, name: ' 1:00am'},
//      {id: 2, name: ' 2:00am'},
//      {id: 3, name: ' 3:00am'},
//      {id: 4, name: ' 4:00am'},
//      {id: 5, name: ' 5:00am'},
//      {id: 6, name: ' 6:00am'},
//      {id: 7, name: ' 7:00am'},
//      {id: 8, name: ' 8:00am'},
//      {id: 9, name: ' 9:00am'},
//      {id: 10, name: ' 10:00am'},
//      {id: 11, name: ' 11:00am'},
//      {id: 12, name: ' 12:00pm'},
//      {id: 13, name: ' 1:00pm'},
//      {id: 14, name: ' 2:00pm'},
//      {id: 15, name: ' 3:00pm'},
//      {id: 16, name: ' 4:00pm'},
//      {id: 17, name: ' 5:00pm'},
//      {id: 18, name: ' 6:00pm'},
//      {id: 19, name: ' 7:00pm'},
//      {id: 20, name: ' 8:00pm'},
//      {id: 21, name: ' 9:00pm'},
//      {id: 22, name: ' 10:00pm'},
//      {id: 23, name: ' 11:00pm'}
//   ];
