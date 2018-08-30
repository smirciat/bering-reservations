'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth,$location,$window,$timeout,$scope) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$location=$location;
    this.$window=$window;
    this.$timeout=$timeout;
    this.scope=$scope;
    this.currDate=new Date();
  }
  
  isRoute = function(route){
    return this.$location.path()===('/' + route);
  }
  
  clickTab = function(index){
    angular.element(document.querySelector("#tab1")).removeClass("active");
    angular.element(document.querySelector("#tab2")).removeClass("active");
    angular.element(document.querySelector("#tab3")).removeClass("active");
    angular.element(document.querySelector("#tab4")).removeClass("active");
    var tag="#tab"+index;
    angular.element(document.querySelector(tag)).addClass("active");
    this.scope.main.updateTab(index);
  }

}

angular.module('workspaceApp')
  .controller('NavbarController', NavbarController);
