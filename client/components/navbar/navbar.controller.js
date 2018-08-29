'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth,$location) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$location=$location;
  }
  
  isRoute = function(route){
    return this.$location.path()===('/' + route);
  }

}

angular.module('workspaceApp')
  .controller('NavbarController', NavbarController);
