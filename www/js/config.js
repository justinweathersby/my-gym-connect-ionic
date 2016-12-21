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

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'MatchesCtrl'
      }
    }
  })

  .state('tab.conversations', {
    url: '/conversations',
    views: {
      'tab-conversations': {
        templateUrl: 'templates/tab-conversations.html',
        controller: 'ConversationsCtrl'
      }
    }
  })

  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-conversations': {
        templateUrl: 'templates/tab-message.html',
        controller: 'MessageCtrl'
      }
    }
  })

  .state('tab.myAccount', {
    url: '/myAccount',
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
