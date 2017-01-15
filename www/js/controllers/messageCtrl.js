app.controller('MessageCtrl', function($rootScope, $scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, $cordovaBadge,
                                        currentUser, currentConversation,
                                        GYM_CONNECT_API)
{

  $scope.$on('cloud:push:notification', function(event, data) {
    var payload = data.message.raw.additionalData.payload;
    console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
    if (payload.user_message == 1){
      if (payload.conversation_id == currentConversation.id){
        $scope.getMessages();
        $rootScope.$apply(function () {
          $rootScope.message_badge_count=0;
        });
      }
    }
  });

  window.addEventListener('native.keyboardshow', keyboardShowHandler);

  function keyboardShowHandler(e){
      console.log('Keyboard height is: ' + e.keyboardHeight);
      $ionicScrollDelegate.scrollBottom(true);
  }

  // This event fires when the keyboard will hide

  window.addEventListener('native.keyboardhide', keyboardHideHandler);

  function keyboardHideHandler(e){
      console.log('Goodnight, sweet prince');
      $ionicScrollDelegate.scrollBottom(true);
  }

  $rootScope.message_badge_count = 0;

  //---Call to get conversations
  $scope.current_user = currentUser;
  $scope.current_conv = currentConversation;
  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');


  $scope.getMessages = function() {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    console.log("BEFORE GET MESSAGES CHECK TOKEN: " + currentUser.token + "::::ID::::" + currentUser.id);
    $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/messages",
            params: {
              "conversation_id": currentConversation.id
            },
            headers: {'Authorization' : currentUser.token}
          })
          .success( function( data )
          {
            console.log("GOT MESSAGES SUCCESS::::");
            console.log( JSON.stringify(data, null, 4));
            $scope.messages = data.messages;
          }
        )
        .error( function(error)
        {
          console.log( JSON.stringify(error, null, 4));
          if (error.errors === "Not authenticated"){
            $cordovaDialogs.alert(
              "Sorry you have been logged out. Please re-login",
              "Woops",  // a title
              "OK"                                // the button text
            );
            $state.go('login');
          }
          $state.go('tab.conversations');
        }).finally(function() {
              console.log("AFTER MESSAGES HAVE LOADED");
             $ionicLoading.hide();
             $scope.$broadcast('scroll.refreshComplete');
             $timeout(function() {
                viewScroll.resize(true);
                viewScroll.scrollBottom(true);
              }, 1000);

        });
  };

  $scope.getMessages();


  $scope.reply = function(body){
    $ionicLoading.show({
        template: '<p>Sending Message...</p><ion-spinner></ion-spinner>'
    });

    $http({ method: 'POST',
              url: GYM_CONNECT_API.url + "/messages",
              data: {
                "message":{
                "body": body
                },
                "recipient_id": currentConversation.sender_id
              },
              headers: {'Authorization' : currentUser.token}
    }).success( function( data ){
            $ionicLoading.hide();
            var message = {
              "message":{
              "body": $scope.replyMessage.body
              },
              "recipient_id": currentConversation.sender_id
            };
            $scope.messages.push(message);
            delete $scope.replyMessage.body;
            $scope.getMessages();
    }).error( function(error){
            $ionicLoading.hide();
            console.log(error);
    });
  };

  $scope.afterMessagesLoad = function(){
    $timeout(function() {
       viewScroll.resize(true);
       viewScroll.scrollBottom(true);
     }, 1000);
  }

});
