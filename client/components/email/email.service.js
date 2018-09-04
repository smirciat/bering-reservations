'use strict';

function emailService(Auth) {
  // Service logic
  // ...

  // Public API here
  return {
    lostPassword: function(user){
        user = user||{};
        var mailOptions = {
          to: user.email, // list of receivers
          subject: 'Bering Air Password reset' // Subject line
          
        };
        Auth.adminChangePassword(user,mailOptions);
          
      }
  };
}


angular.module('workspaceApp')
  .factory('email', emailService);
