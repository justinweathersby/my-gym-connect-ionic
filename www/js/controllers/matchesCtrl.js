app.controller('MatchesCtrl', function($scope, $state, $http, $stateParams,
                                       $ionicPopup, $ionicLoading, $ionicModal, $ionicPlatform, $cordovaDialogs,
                                       currentUser, currentConversation, $timeout,
                                       GYM_CONNECT_API)
{


    $scope.imgLoadingCircle = "<spinner-blue.gif>";
    $scope.matchDataShow = false;
    $scope.matchDataLoaded = false;
    $scope.matchSelectedLoaded = false;

    $scope.getMatches = function(){
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });

      localforage.getItem('user_token').then(function(value) {
        console.log("RETURN FROM GETITEM IN getMATCHES: ", value);

        var token = value;
        console.log("Token: " + token);
        $http({ method: 'GET',
                url: GYM_CONNECT_API.url + "/matches",
                headers: {'Authorization' : token}
        }).success( function( data ){
                console.log('getMatches success: ', data);
                $scope.matches = data;
        }).error( function(error){
              console.log(JSON.stringify(error));
              if (error.errors === "Not authenticated"){
                $cordovaDialogs.alert(
                  "Sorry you have been logged out. Please re-login",
                  "Woops",  // a title
                  "OK"                                // the button text
                );
              }
              $state.go('login');
        }).finally(function() {

           console.log('===========');
           $scope.matchDataShow = true;
           $timeout(function() {
             $scope.matchDataLoaded = true;
             $scope.$broadcast('scroll.refreshComplete');
             $ionicLoading.hide();
           }, 900);


        });
      }).catch(function(err) { console.log("GET ITEM ERROR::Matches::getMatches::", err); $ionicLoading.hide();});
      // var auth_token = localforage.getItem('user_token');
      // console.log("Auth Token: ", JSON.stringify(auth_token));
    };

    $ionicPlatform.ready(function() {
      // console.log("Calling get matches from ionic platform ready matches ctrl");
      //$scope.getMatches();
      // $scope.matches[0].visible = true;
    });

    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope)
          return;
      //alert('2');
      console.log("Calling get matches from ionic platform ready matches ctrl");
      $scope.getMatches();
    });

    $ionicModal.fromTemplateUrl('templates/modals/match-profile-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(match) {
      $scope.matchSelected = match;
      $scope.matchSelectedLoaded = true;
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
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
          template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
          delay: 500
      });

      $scope.token = "";
      localforage.getItem('user_token').then(function(value) {
        var token = value;
        $http({ method: 'POST',
                url: GYM_CONNECT_API.url + "/messages",
                data: {
                  "message":{
                  "body": body
                  },
                  "recipient_id":send_to
                },
                headers: {'Authorization' : token}
        }).success( function( data ){
                $ionicLoading.hide();
                // console.log('Return Data post new message from Api:', JSON.stringify(data, null, 4));
                //--add new current coversation
                //--then go to tab.messages
                currentConversation.id = data.conversation_id;
                currentConversation.sender_id = data.partner_id;
                currentConversation.sender_name = data.partner_name;

                localforage.setItem('conversation', currentConversation).then(function(value){
                  $state.go('tab.messages');
                });

                // console.log('Beefore headed to messages:', JSON.stringify(currentConversation, null, 4));
                // console.log('Current Convo id:', JSON.stringify(currentConversation.id, null, 4));

        }).error( function(error){
                $ionicLoading.hide();
                console.log(error);
        });
      }).catch(function(err) { console.log("GET ITEM ERROR::Matches::startConversation::", err);});
    };
});
