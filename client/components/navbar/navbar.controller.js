'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth,$location,$window,$timeout,$scope,$state) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$location=$location;
    this.$window=$window;
    this.$timeout=$timeout;
    this.scope=$scope;
    this.state=$state;
    this.currDate=new Date();
  }
  
  isRoute = function(route){
    return this.$location.path()===('/' + route);
  }
  
  clickTab = function(index){
    var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
    this.scope.main.updateRes(this.scope.main.oldObj,address,true);
    angular.element(document.querySelector("#tab1")).removeClass("active");
    angular.element(document.querySelector("#tab2")).removeClass("active");
    angular.element(document.querySelector("#tab3")).removeClass("active");
    angular.element(document.querySelector("#tab4")).removeClass("active");
    var tag="#tab"+index;
    angular.element(document.querySelector(tag)).addClass("active");
    this.scope.main.updateTab(index);
  }
  
  upDate = function(){
    var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
    this.scope.main.updateRes(this.scope.main.oldObj,address,true);
    this.scope.main.upDate(this.currDate);
  }
  
  goto = function(sref){
    var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
    this.scope.main.updateRes(this.scope.main.oldObj,address,true);
    this.state.go(sref);
  }

}

angular.module('workspaceApp')
  .controller('NavbarController', NavbarController);
