app.controller('MessageCtrl', function($scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs,
                                        currentUser, currentConversation,
                                        GYM_CONNECT_API)
{

  //---Call to get conversations
  $scope.current_user = currentUser;
  $scope.current_conv = currentConversation;

  $scope.$on('$ionicView.afterEnter', function(){
    $ionicScrollDelegate.scrollBottom();
  });

  $scope.getMessages = function() {
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
            console.log( JSON.stringify(data, null, 4));
            $scope.messages = data.messages;
            $ionicScrollDelegate.scrollBottom(true);
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
             $ionicLoading.hide();
             $scope.$broadcast('scroll.refreshComplete');
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
            getMessages();
    }).error( function(error){
            $ionicLoading.hide();
            console.log(error);
    });
  };
});
