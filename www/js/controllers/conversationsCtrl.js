app.controller('ConversationsCtrl', function($scope, $state, $http, $stateParams,
                                        $ionicPopup, $ionicLoading,
                                        currentUser, currentConversation,
                                        GYM_CONNECT_API)
{
  $scope.current_user = currentUser;

  //---Call to get conversations
  // getConversations();

  $scope.getConversations = function() {
    console.log("inside getConversations");
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/conversations",
            headers: {'Authorization' : currentUser.token}
    }).success( function( data ){
            console.log("Data from conversations: ", JSON.stringify(data, null, 4));
            $scope.conversations = data.conversations;
            $ionicLoading.hide();
    }).error( function(error){
            console.log("Error in Conversations", error.errors)
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

  $scope.openConversation = function(convo){
    //--Set Conversation
    console.log("OpenConvo Convo", JSON.stringify(convo,null, 4));
    currentConversation.id = convo.conversation_id;
    currentConversation.sender_id = convo.sender_id;
    currentConversation.sender_name = convo.sender_name;
    $state.go('tab.messages');
  };
});
