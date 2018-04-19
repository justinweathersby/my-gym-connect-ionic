app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,
                                        $ionicPopup, $ionicLoading,
                                        currentUser, currentConversation,moment,
                                        GYM_CONNECT_API)
{
  $scope.$on('cloud:push:notification', function(event, data) {
    var payload = data.message.raw.additionalData.payload;
    console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
    if (payload.user_message == 1){
        $scope.getConversations();
    }
  });

  $scope.current_user = currentUser;
  //$rootScope.message_badge_count = 0;

  $scope.getConversations = function() {
    if(window.cordova){
      $cordovaBadge.clear();
    }
    console.log("inside getConversations");
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    localforage.getItem('user_token').then(function(value) {
      var token = value;
      $http({ method: 'GET',
              url: GYM_CONNECT_API.url + "/conversations",
              headers: {'Authorization' : token}
      }).success( function( data ){
              console.log("Data from conversations: ", data);
              console.log("Data from conversations: ", JSON.stringify(data, null, 4));
              $scope.conversations = data.conversations;
              $scope.conversations.forEach(function(conv) {
                var created_at = conv.last_message.created_at;
                console.log('create_at: ', created_at);
                var createDate = new Date(created_at);
                var now = moment();
                var showTime;
                if (now.isSame(createDate, 'd')) {
                    // They are on the same day
                    showTime = moment(createDate).format('h:mm A');
                } else {
                    // They are not on the same day
                    showTime = moment(createDate).format('MMM D');
                }
                conv.last_message.show_time = showTime;
              });
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
    }).catch(function(err) { console.log("GET ITEM ERROR::Conversations::getConversation::", JSON.stringify(err));});
  };

  $scope.openConversation = function(convo){
    //--Set Conversation
    console.log("OpenConvo Convo", JSON.stringify(convo,null, 4));
    currentConversation.id = convo.conversation_id;
    currentConversation.sender_id = convo.sender_id;
    currentConversation.sender_name = convo.sender_name;
    currentConversation.sender_image = convo.sender_image;

    localforage.setItem('conversation', currentConversation).then(function(value){
      $state.go('tab.messages');
    });
  };
});
