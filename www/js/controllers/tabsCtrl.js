app.controller('TabsCtrl', function($rootScope, $scope, $state,
                                    $ionicActionSheet, $ionicHistory, $ionicPlatform, $ionicActionSheet, $ionicPopup, $cordovaDialogs, $cordovaBadge){

$scope.$on('cloud:push:notification', function(event, data) {
  var payload = data.message.raw.additionalData.payload;
  console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
  console.log("MESSAGE BADGE COUNT" + $scope.message_badge_count);
  if (payload.user_message == 1){
    $rootScope.$apply(function () {
      $rootScope.message_badge_count++;
    });
  }
  else{
    var msg = data.message;
    $cordovaDialogs.alert(
      msg.text,  // the message
      msg.title, // a title
      "OK"       // the button text
    ).then(function() {
      $cordovaBadge.clear();
    });
  }
});

$rootScope.message_badge_count = 0;

$scope.goToMatches = function(){
  $state.go('tab.dash', {}, {reload:true});
}

$scope.openMoreModal = function(){
  var hideSheet = $ionicActionSheet.show({
    buttons: [
      { text: 'Logout' }
    ],
    cancelText: 'Cancel',
    cancel: function() {},
    buttonClicked: function(index) {
      hideSheet();
      switch(index){
        case 0:
        logout();
        break;
      }
    }
  });
};

function logout() {
//   authService.resetCurrent();
//   dealerService.resetCurrent();
  localforage.clear();
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $state.go('login', {}, {reload:true});
};
});
