app.controller('MatchesCtrl', function($scope, $state, $http, $stateParams,
                                       $ionicPopup, $ionicLoading, $ionicModal,
                                       currentUser, currentConversation,
                                       GYM_CONNECT_API)
{
    $scope.imgLoadingCircle = "<spinner-blue.gif>";
    $scope.matchDataLoaded = false;
    $scope.matchSelectedLoaded = false;

    $scope.getMatches = function(){
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
      $http({ method: 'GET',
              url: GYM_CONNECT_API.url + "/matches",
              headers: {'Authorization' : currentUser.token}
      }).success( function( data ){
              // console.log('Return Data From Get Matches from Api:', JSON.stringify(data, null, 4));
              $scope.matches = data;
              $scope.matchDataLoaded = true;
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
             $ionicLoading.hide();
             $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.getMatches();

    $ionicModal.fromTemplateUrl('templates/modals/match-profile-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(match) {
      $scope.matchSelected = match;
      $scope.matchSelectedLoaded = true;
      console.log("openModal: ", JSON.stringify($scope.matchSelected, null, 4));
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

    // Triggered on a button click, or some other target
    $scope.showPopup = function(send_to_id) {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        templateUrl: "templates/popups/send-message-input.html",
        cssClass: 'showMessagePopup',
        title: 'Send A Message To Connect',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            type: 'button-small'},
          {
            text: '<b>Send</b>',
            type: 'button-small button-positive',
            onTap: function(e) {
              if (!$scope.data.msg) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                startConversation(send_to_id, $scope.data.msg);
                return $scope.data.msg;
              }
            }
          }
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
     };

    function startConversation(send_to, body){
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
