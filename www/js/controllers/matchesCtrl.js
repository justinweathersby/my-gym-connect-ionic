app.controller('MatchesCtrl', function($scope, $state, $http, $stateParams,
                                       $ionicPopup, $ionicLoading, $ionicModal,
                                       currentUser, currentConversation,
                                       GYM_CONNECT_API)
{
    $scope.imgLoadingCircle = "<spinner-blue.gif>";
    $scope.matchDataLoaded = false;
    // $scope.matches = [];
    // {
    //     "id": 32,
    //     "name": "First Example",
    //     "email": "firstuser@email.com",
    //     "gender": "male",
    //     "workout_time": "all",
    //     "workout_level": "beginner",
    //     "description": "This is my description.. Not much huh? Message me for more details.",
    //     "image_url": "https://s3.amazonaws.com/my-gym-connect-staging/users/images/000/000/032/medium/image.jpg?1482364702"
    // },
    // {
    //     "id": 42,
    //     "name": "George Clooney",
    //     "email": "george_clooney@email.com",
    //     "gender": "male",
    //     "workout_time": "afternoon",
    //     "workout_level": "intermediate",
    //     "description": "I love hitting the gym after work. Pumping iron is best done after a full days work.",
    //     "image_url": "https://s3.amazonaws.com/my-gym-connect-staging/users/images/000/000/042/medium/image.jpg?1482368359"
    // }];
    //
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
              $scope.matchDataLoaded = true;
              // $scope.$apply();
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

    $ionicModal.fromTemplateUrl('templates/modals/send-message-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

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
