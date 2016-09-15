//-- This service contains user information for authorization and authentication needs
app.service('currentUserService', function(){
  this.id = null;
  this.token = null;
  this.role = null;

  this.name = null;
  this.email = null;
  this.image_url = null;
  this.workout_level = null;
  this.gender = null;
  this.gym = null;
  this.hours_in_gym = [];

});

//-- This service handles all authentication between app and Chatter API
app.service('authService', function($http, currentUserService, GYM_CONNECT_API){
  this.login = function(user){
    return  $http({method: 'POST',
                   url: GYM_CONNECT_API.url + '/login',
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password}})
      .success( function( data )
      {
        // TODO:
        console.log('Return Data From Login Post to Api:', JSON.stringify(data, null, 4));
        currentUserService.token = data.user.auth_token;
        currentUserService.id = data.user.id;
        currentUserService.role = data.user.role;
        // console.log('UserService token: ', data.user.auth_token)

        localStorage.setItem('user', user.email);
        localStorage.setItem('token', data.user.auth_token);

        //--Set header for all subsequent requests
        $http.defaults.headers.common['Authorization'] = data.user.auth_token;

      }
    )
    .error( function(error)
    {
      console.log(error);

    });
  }; //--End of login function

  this.logout = function(user){
    return  $http({method: 'POST', url: GYM_CONNECT_API.url + '/logout', headers: {'Authorization' : user.token}});
  };// --End of logout function
});

app.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
