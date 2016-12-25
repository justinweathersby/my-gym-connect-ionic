app.config(function($stateProvider, $urlRouterProvider) {
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
  .state('forgot-password', {
    url: '/forgot-password',
    templateUrl: 'templates/forgot-password.html',
    controller: 'LoginCtrl'
  })
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })
  .state('tab.dash', {
    url: '/dash',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'MatchesCtrl'
      }
    }
  })
  .state('tab.conversations', {
    url: '/conversations',
    cache: false,
    views: {
      'tab-conversations': {
        templateUrl: 'templates/tab-conversations.html',
        controller: 'ConversationsCtrl'
      }
    }
  })
  .state('tab.messages', {
    url: '/messages',
    cache: false,
    views: {
      'tab-conversations': {
        templateUrl: 'templates/tab-message.html',
        controller: 'MessageCtrl'
      }
    }
  })
  .state('tab.myAccount', {
    url: '/myAccount',
    cache: false,
    views: {
      'tab-myAccount': {
        templateUrl: 'templates/tab-myAccount.html',
        controller: 'MyAccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login'); //--default go to page

  //--Cordova white list plugin
  // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});
