app.controller('MyAccountCtrl', function($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, currentUserService, $cordovaCamera, GYM_CONNECT_API){
  $scope.WorkoutLevels = [
    'beginner',
    'intermediate',
    'expert'
  ];

  //--Used in addWorkoutTime Function below
  $scope.selectedHour = 0;
  $scope.selectedDay = '';

  $scope.base64ImageData = '';

  $scope.daysOfWeek = [
        {id: 0, name: 'Sunday'},
        {id: 1, name: 'Monday'},
        {id: 2, name: 'Tuesday'},
        {id: 3, name: 'Wednesday'},
        {id: 4, name: 'Thursday'},
        {id: 5, name: 'Friday'},
        {id: 6, name: 'Saturday'}
     ];
  $scope.hoursInDay = [
       {id: 0, name: '12:00am'},
       {id: 1, name: ' 1:00am'},
       {id: 2, name: ' 2:00am'},
       {id: 3, name: ' 3:00am'},
       {id: 4, name: ' 4:00am'},
       {id: 5, name: ' 5:00am'},
       {id: 6, name: ' 6:00am'}
    ];

  $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/users/" + currentUserService.id,
            headers: {'Authorization' : currentUserService.token}
          })
          .success( function( data )
          {
            // TODO:
            console.log('Return Data From Get User Account Info from Api:', JSON.stringify(data, null, 4));
            currentUserService.name = data.name;
            currentUserService.email = data.email;
            currentUserService.workout_level = data.workout_level;
            currentUserService.gender = data.gender;
            currentUserService.image_url = data.image_url;
            currentUserService.gym = data.gym;
            currentUserService.hours_in_gym = data.hours_in_gym;

            $scope.profileImgSrc = data.image_url;

            $scope.current_user = currentUserService;
          }
        )
        .error( function(error)
        {
          console.log(error);
        });

  $scope.addWorkoutTime = function(day, hour)
  {
    console.log("Selected day id: ", day);
    console.log("Selected hour: ", hour);

    var index = (parseInt(day) * 24) + parseInt(hour);

    console.log("Calc Index: ", index);
    currentUserService.hours_in_gym.push(index);
    console.log("current user service hours: ", currentUserService.hours_in_gym);
    $scope.current_user = currentUserService;
  };

  $scope.indexToDayTime = function(index){
    var sunday = new Date("September 04, 2016 00:00:00");
    var actualDate = new Date();
    actualDate.setTime(sunday.getTime() + (index*60*60*1000));
    return actualDate;
  };

  $scope.updateUser = function(){
    $ionicLoading.show({
        template: '<p>Updating your information please wait...</p><ion-spinner></ion-spinner>'
    });
    console.log("Inside update User function: ",  JSON.stringify(currentUserService, null, 4));
    $http({ method: 'POST',
              url: GYM_CONNECT_API.url + "/users/" + currentUserService.id,
              data: {
                "name": currentUserService.name,
                "gender": currentUserService.gender,
                "hours_in_gym[]": currentUserService.hours_in_gym,
                "workout_level": currentUserService.workout_level
                // "image": currentUserService.image
              },
              headers: {'Authorization' : currentUserService.token}

            })
            .success( function( data )
            {
              // TODO:
              console.log('Return Data From Get User Account Info from Api:', JSON.stringify(data, null, 4));
              $ionicLoading.hide();

            }
          )
          .error( function(error)
          {
            console.log("Update User Failed...");
            console.log("Error: ", error);
            $ionicLoading.hide();

          });
  };

  $scope.selectPicture = function() {
    console.log('Selected option to upload a picture...');

    $ionicLoading.show({
        template: '<p>Warming Camera Up...</p><ion-spinner></ion-spinner>'
    });

    document.addEventListener('deviceready', function() {
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
          currentUserService.image = imageURI;
          $scope.profileImgSrc = currentUserService.image;

          //------File Transfer of Image to Server
          var Uoptions = new FileUploadOptions();
          Uoptions.fileKey="image";
          Uoptions.mimeType ="image/jpeg";
          Uoptions.chunkedMode = false;
          Uoptions.params = {};
          Uoptions.headers = {'Authorization' : currentUserService.token};

          var ft = new FileTransfer();
          console.log('File upload: ', currentUserService.image);

          var uri = encodeURI(GYM_CONNECT_API.url + "/users/" + currentUserService.id);

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

          ft.upload(currentUserService.image, uri, win, fail, Uoptions);
          //------End File Transfer

        }, function(err) {
            console.log("Did not get image from library");
            $ionicLoading.hide();
        });

      }, false); // device ready
  }; // Select picture

});
