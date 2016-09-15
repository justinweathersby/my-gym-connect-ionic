app.controller('matchesCtrl', function($scope,$state, $http, $stateParams, $ionicPopup, $ionicLoading, currentUserService, GYM_CONNECT_API)
{
  $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/matches",
            headers: {'Authorization' : currentUserService.token}
          })
          .success( function( data )
          {
            // TODO:
            console.log('Return Data From Get Matches from Api:', JSON.stringify(data, null, 4));

            $scope.matches = data;
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log(error);
          $ionicLoading.hide();
        });


    $scope.indexToDayTime = function(index){
      var sunday = new Date("September 04, 2016 00:00:00");
      var actualDate = new Date();
      actualDate.setTime(sunday.getTime() + (index*60*60*1000));
      return actualDate;
    };

});
