//-- This service contains user information for authorization and authentication needs
app.service('currentUser', function(){
  this.id = null;
  this.token = null;
  this.role = null;

  this.name = null;
  this.email = null;
  this.image_url = null;
  this.second_image_url = null;
  this.third_image_url = null;
  this.workout_level = null;
  this.workout_time = null;
  this.gender = null;
  this.gender_match = null;
  this.gym = null;
  // this.image = null;
  this.description = null;

  this.device_token = null;
  this.device_type = null;

});

app.service('currentUserService', function($http, currentUser, GYM_CONNECT_API){
  // this.clear = function(){};
  this.updateUser = function(){
    console.log("Updating currentUserService...", JSON.stringify(currentUser, null, 4));
    return $http({ method: 'POST',
                   url: GYM_CONNECT_API.url + "/users/" + currentUser.id,
                   data: {
                      "name": currentUser.name,
                      "gender": currentUser.gender,
                      "gender_match": currentUser.gender_match,
                      "workout_time": currentUser.workout_time,
                      "workout_level": currentUser.workout_level,
                      "description": currentUser.description
                   },
                   headers: {'Authorization' : currentUser.token}

     }).success( function( data ){

     }).error( function(error) {
          console.log("Update User Failed...");
          console.log("Error: ", JSON.stringify(error, null, 4));
     });
  };
  this.getUser = function(){
    console.log("inside currentUserService ", JSON.stringify(currentUser, null, 4));
    return $http({ method: 'GET',
              url: GYM_CONNECT_API.url + "/users/" + currentUser.id,
              headers: {'Authorization' : currentUser.token}
    }).success( function( data )
    {
      console.log("Inside currentUserService getUser success");
      currentUser.name = data.name;
      currentUser.email = data.email;
      currentUser.workout_level = data.workout_level;
      currentUser.workout_time = data.workout_time;
      currentUser.gender = data.gender;
      currentUser.gender_match = data.gender_match;
      currentUser.image_url = data.image_url;
      currentUser.second_image_url = data.second_image_url;
      currentUser.third_image_url = data.third_image_url;
      currentUser.gym = data.gym;
      currentUser.description = data.description;
    }
  ).error( function(error){console.log(JSON.stringify(error,null,4));});
  };
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
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password, 'X-API-DEVICE-TOKEN' : currentUser.device_token, 'X-API-DEVICE-TYPE' : currentUser.device_type}})
      .success( function( data ){
        // TODO:
        console.log('Return Data From Login Post to Api:', JSON.stringify(data, null, 4));
        currentUser.token = data.user.auth_token;
        currentUser.id = data.user.id;
        currentUser.role = data.user.role;
        currentUser.name = data.user.name;
        currentUser.description = data.user.description;
        // console.log('UserService token: ', data.user.auth_token)

        localStorage.setItem('user', user.email);
        localStorage.setItem('token', data.user.auth_token);

        //--Set header for all subsequent requests
        $http.defaults.headers.common['Authorization'] = data.user.auth_token;

    }).error( function(error){
      console.log(error);
    });
  }; //--End of login function

  this.logout = function(user){
    return  $http({method: 'POST', url: GYM_CONNECT_API.url + '/logout', headers: {'Authorization' : user.token}});
  };// --End of logout function
});
