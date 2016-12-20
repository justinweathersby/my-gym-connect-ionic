//-- This service contains user information for authorization and authentication needs
app.service('currentUser', function(){
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
  this.image = null;

});

app.service('currentConversation', function(){
  this.id =
  this.sender_id =
  this.sender_name =
  this.sender_image =
  this.last_message = null;
});

app.service('conversationService', function(){
  this.getConversation = function(){
    ;
  };
});


//-- This service handles all authentication between app and Chatter API
app.service('authService', function($http, currentUser, GYM_CONNECT_API){
  this.login = function(user){
    return  $http({method: 'POST',
                   url: GYM_CONNECT_API.url + '/login',
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password}})
      .success( function( data )
      {
        // TODO:
        console.log('Return Data From Login Post to Api:', JSON.stringify(data, null, 4));
        currentUser.token = data.user.auth_token;
        currentUser.id = data.user.id;
        currentUser.role = data.user.role;
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
