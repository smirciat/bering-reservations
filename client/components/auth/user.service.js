'use strict';

(function() {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      adminChangePassword: {
        method: 'POST',
        params: {
          controller:'resetpassword'
        }
      },
      adminChangeRole: {
        method: 'PUT',
        params: {
          controller:'changerole'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('workspaceApp.auth')
    .factory('User', UserResource);
})();
