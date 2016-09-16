app.controller('MessagesCtrl', function($scope,$state, $http, $stateParams, $ionicPopup, $ionicLoading, currentUserService, GYM_CONNECT_API)
{
  //---- Data
  $scope.replyMessage = {
    to_id: "",
    to: "",
    body: ""
  };

  $scope.current_user = currentUserService;


  $scope.getConversations = function() {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    $http({ method: 'GET',
            url: GYM_CONNECT_API.url + "/messages",
            headers: {'Authorization' : currentUserService.token}
          })
          .success( function( data )
          {
            // TODO:
            console.log('Return Data From Get Matches from Api:', JSON.stringify(data, null, 4));

            $scope.inbox_messages = data.inbox
            $scope.outbox_messages = data.outbox;
            $scope.conversations = data.conversations;


            console.log('Conversations: ', JSON.stringify(data.conversations, null, 4));
            $ionicLoading.hide();
          }
        )
        .error( function(error)
        {
          console.log(error);
          $ionicLoading.hide();
        });
  };

  $scope.reply = function(send_to, body){
    $ionicLoading.show({
        template: '<p>Sending Message...</p><ion-spinner></ion-spinner>'
    });
    $http({ method: 'POST',
              url: GYM_CONNECT_API.url + "/messages",
              params: {
                "user_id": send_to,
                "body": body
              },
              headers: {'Authorization' : currentUserService.token}

            })
            .success( function( data )
            {
              $ionicLoading.hide();
              // TODO:
              console.log('Return Data post new message from Api:', JSON.stringify(data, null, 4));
              $scope.getConversations();
            }
          )
          .error( function(error)
          {
            $ionicLoading.hide();
            console.log(error);
          });
  };

  //---Call to get conversations
  $scope.getConversations();
});
