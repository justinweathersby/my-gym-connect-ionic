app.controller('MessageCtrl', function($scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate,
                                        currentUser, currentConversation,
                                        GYM_CONNECT_API)
{

  //---Call to get conversations
  getMessages();

  function getMessages() {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/messages",
            params: {
              "conversation_id": currentConversation.id
            },
            headers: {'Authorization' : currentUser.token}
          })
          .success( function( data )
          {
            $scope.messages = data.messages;
            $ionicScrollDelegate.scrollBottom(true);
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log( JSON.stringify(error, null, 4));
          if (error.errors === "Not authenticated"){
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: 'Sorry you have been logged out. Please re-login'
            });
            $state.go('login');
          }

          $ionicLoading.hide();
          $state.go('tab.conversations');
        });
  };

  $scope.changeName = function(name){
    console.log("Name: ", name);
    console.log("CurrentUser: ", currentUser.name);
    if (name === currentUser.name){
      return "Me";
    }
    return name;
  };

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
            getMessages();
    }).error( function(error){
            $ionicLoading.hide();
            console.log(error);
    });
  };
});
