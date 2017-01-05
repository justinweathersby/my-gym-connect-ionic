app.controller('TabsCtrl', function($scope, $state,
                                    $ionicActionSheet, $ionicHistory, $ionicPlatform, $ionicActionSheet){

// $scope.$on('cloud:push:notification', function(event, data) {
//   var msg = data.message;
//   var alertPopup = $ionicPopup.alert({
//     title: msg.title,
//     template: msg.text
//   });
// });
//
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
