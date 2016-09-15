app.controller('MyAccountCtrl', function($scope, $http, $state, $stateParams, $ionicPopup, currentUserService, GYM_CONNECT_API){
  $scope.WorkoutLevels = [
    'beginner',
    'intermediate',
    'expert'
  ];

  //--Used in addWorkoutTime Function below
  $scope.selectedHour = 0;
  $scope.selectedDay = '';

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
    $http({ method: 'POST',
              url: GYM_CONNECT_API.url + "/users/" + currentUserService.id,
              params: {
                "name": currentUserService.name,
                "gender": currentUserService.gender,
                "hours_in_gym[]": currentUserService.hours_in_gym,
                "workout_level": currentUserService.workout_level
              },
              headers: {'Authorization' : currentUserService.token}

            })
            .success( function( data )
            {
              // TODO:
              console.log('Return Data From Get User Account Info from Api:', JSON.stringify(data, null, 4));
            }
          )
          .error( function(error)
          {
            console.log(error);
          });
  };

});
