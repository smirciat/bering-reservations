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
    this.tabs=[{title:'Morning 1',isActive:'active'},
               {title:'Morning 2',isActive:''},
               {title:'Afternoon 1',isActive:''},
               {title:'Afternoon 2',isActive:''}];
  }
  
  updateTabs=function(flights){
    var morningCols=0;
    var afternoonCols=0;
    flights.forEach(flight=>{
      if (flight.morning){
        if (flight.inbound) morningCols++;
        if (flight.outbound) morningCols++;
      }else {
        if (flight.inbound) afternoonCols++;
        if (flight.outbound) afternoonCols++;
      }
    });
    if (morningCols>13) this.tabs.splice(2,0,{title:'Morning 3',isActive:''});
    if (morningCols>19) this.tabs.splice(3,0,{title:'Morning 4',isActive:''});
    if (afternoonCols>13) this.tabs.push({title:'Afternoon 3',isActive:''});
    if (afternoonCols>19) this.tabs.push({title:'Afternoon 4',isActive:''});
  }
  
  isRoute = function(route){
    return this.$location.path()===('/' + route);
  }
  
  clickTab = function(index){
    var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
    this.scope.main.updateRes(this.scope.main.oldObj,address,true);
    this.tabs.forEach(tab=>{
      tab.isActive='';
    });
    this.tabs[index].isActive='active';
    this.scope.main.updateTab(index+1);
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
