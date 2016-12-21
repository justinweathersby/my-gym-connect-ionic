app.controller('ConversationsCtrl', function($scope, $state, $http, $stateParams,
                                        $ionicPopup, $ionicLoading,
                                        currentUser, currentConversation,
                                        GYM_CONNECT_API)
{
  $scope.current_user = currentUser;

  //---Call to get conversations
  getConversations();

  function getConversations() {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/conversations",
            headers: {'Authorization' : currentUser.token}
          })
          .success( function( data )
          {
            $scope.conversations = data.conversations;
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log(error);
          $ionicLoading.hide();
        });
  };

  $scope.openConversation = function(convo){
    //--Set Conversation
    console.log("OpenConvo Convo", JSON.stringify(convo,null, 4));
    currentConversation.id = convo.conversation_id;
    currentConversation.sender_id = convo.sender_id;
    currentConversation.sender_name = convo.sender_name;
    $state.go('tab.messages');
  };



});
