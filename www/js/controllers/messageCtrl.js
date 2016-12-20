app.controller('MessageCtrl', function($scope, $state, $http, $stateParams,
                                        $ionicPopup, $ionicLoading,
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
            console.log( JSON.stringify(data, null, 4));
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log( JSON.stringify(error, null, 4));
          $ionicLoading.hide();
          // $state.go('conversations');
        });
  };
});
