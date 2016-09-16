app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('matches', {
    url: '/matches',
    templateUrl: 'templates/matches.html',
    controller: 'MatchesCtrl'
  })

  .state('messages', {
    url: '/messages',
    templateUrl: 'templates/messages.html',
    controller: 'MessagesCtrl'
  })

  .state('myAccount', {
    url: '/myAccount',
    templateUrl: 'templates/myAccount.html',
    controller: 'MyAccountCtrl'
  });

  // setup an abstract state for the tabs directive
  // .state('tab', {
  //   url: '/tab',
  //   abstract: true,
  //   templateUrl: 'templates/tabs.html'
  // })
  //
  // // Each tab has its own nav history stack:
  // .state('tab.dash', {
  //   url: '/dash',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',
  //       controller: 'DashCtrl'
  //     }
  //   }
  // })
  //
  // .state('tab.chats', {
  //     url: '/chats',
  //     views: {
  //       'tab-chats': {
  //         templateUrl: 'templates/tab-chats.html',
  //         controller: 'ChatsCtrl'
  //       }
  //     }
  //   })
  //   .state('tab.chat-detail', {
  //     url: '/chats/:chatId',
  //     views: {
  //       'tab-chats': {
  //         templateUrl: 'templates/chat-detail.html',
  //         controller: 'ChatDetailCtrl'
  //       }
  //     }
  //   })
  //
  // .state('tab.account', {
  //   url: '/account',
  //   views: {
  //     'tab-account': {
  //       templateUrl: 'templates/tab-account.html',
  //       controller: 'AccountCtrl'
  //     }
  //   }
  //});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login'); //--default go to page

  //--Cordova white list plugin
  // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});
