app.controller('MatchesCtrl', function($scope, $state, $http, $stateParams,
                                       $ionicPopup, $ionicLoading, $ionicModal,
                                       currentUser, currentConversation,
                                       GYM_CONNECT_API)
{
    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
    };
    
    $scope.imgLoadingCircle = "<spinner-blue.gif>";

    $scope.getMatches = function(){
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
      $http({ method: 'GET',
              url: GYM_CONNECT_API.url + "/matches",
              headers: {'Authorization' : currentUser.token}
      }).success( function( data ){
              console.log('Return Data From Get Matches from Api:', JSON.stringify(data, null, 4));
              $scope.matches = data;
              $ionicLoading.hide();
      }).error( function(error){
            console.log(error);
            if (error.errors === "Not authenticated"){
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Sorry you have been logged out. Please re-login'
              });
            }
            $state.go('login');
            $ionicLoading.hide();
      }).finally(function() {
             // Stop the ion-refresher from spinning
             $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.getMatches();


    $scope.indexToDayTime = function(index){
      var sunday = new Date("September 04, 2016 00:00:00");
      var actualDate = new Date();
      actualDate.setTime(sunday.getTime() + (index*60*60*1000));
      return actualDate;
    };

    $scope.startConversation = function(send_to, body){
      $ionicLoading.show({
          template: '<p>Sending Message...</p><ion-spinner></ion-spinner>'
      });
      $http({ method: 'POST',
              url: GYM_CONNECT_API.url + "/messages",
              data: {
                "message":{
                "body": body
                },
                "recipient_id":send_to
              },
              headers: {'Authorization' : currentUser.token}
      }).success( function( data ){
              $ionicLoading.hide();
              console.log('Return Data post new message from Api:', JSON.stringify(data, null, 4));
              //--add new current coversation
              //--then go to tab.messages
              currentConversation.id = data.conversation_id;
              currentConversation.sender_id = data.partner_id;
              currentConversation.sender_name = data.partner_name;
              console.log('Beefore headed to messages:', JSON.stringify(currentConversation, null, 4));
              console.log('Current Convo id:', JSON.stringify(currentConversation.id, null, 4));

              $state.go('tab.messages');
      }).error( function(error){
              $ionicLoading.hide();
              console.log(error);
      });
    };
});
