app.controller('TabsCtrl', function($scope, $state,
                                    $ionicActionSheet, $ionicHistory, $ionicPlatform, $ionicActionSheet, $ionicPopup, $cordovaDialogs){


$scope.$on('cloud:push:notification', function(event, data) {
  console.log("PUSH NOTIFICATION: ", JSON.stringify(data));
  var msg = data.message;
  $cordovaDialogs.alert(
    msg.text,             // the message
    function() {},                      // a callback
    msg.title, // a title
    "OK"   // the button text
  ).then(function() {
    // callback success
  });
});

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
  localStorage.clear();
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $state.go('login', {}, {reload:true});
};
});
