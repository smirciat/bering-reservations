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
    this.location=$location;
    this.$window=$window;
    this.$timeout=$timeout;
    this.scope=$scope;
    this.state=$state;
    this.currDate=new Date();
    this.tabsStatic=[{title:'Morning 1',isActive:'active',morning:true},
               {title:'Morning 2',isActive:'',morning:true},
               {title:'Afternoon 1',isActive:'',morning:false},
               {title:'Afternoon 2',isActive:'',morning:false}];
    this.tabs=angular.copy(this.tabsStatic);
  }
  
  updateTabs=function(morningCols,afternoonCols){
    var active=0;
    this.tabs.forEach((tab,index)=>{
      if (tab.isActive==="active") active=index;
    });
    this.tabs=angular.copy(this.tabsStatic);
    this.tabs[0].isActive="";
    if (morningCols>13) this.tabs.splice(2,0,{title:'Morning 3',isActive:'',morning:true});
    if (morningCols>19) this.tabs.splice(3,0,{title:'Morning 4',isActive:'',morning:true});
    if (afternoonCols>13) this.tabs.push({title:'Afternoon 3',isActive:'',morning:false});
    if (afternoonCols>19) this.tabs.push({title:'Afternoon 4',isActive:'',morning:false});
    this.tabs[active].isActive="active";
    this.scope.main.tabs=angular.copy(this.tabs);
  }
  
  isRoute = function(route){
    return this.location.path()===('/' + route);
  }
  
  clickTab = function(index){
    if (this.location.path()==='/') {
      if (this.scope.main.httpRunning) {
        console.log('stopped');
        return;
      }
      var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
      this.scope.main.updateRes(this.scope.main.oldObj,address,true);
      this.tabs.forEach(tab=>{
        tab.isActive='';
      });
      this.tabs[index].isActive='active';
      this.scope.main.updateTab(index+1);
    }
  }
  
  upDate = function(){
    if (this.location.path()==='/') {
      var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
      this.scope.main.updateRes(this.scope.main.oldObj,address,true);
      this.scope.main.upDate(this.currDate);
    }
  }
  
  goto = function(sref){
    if (this.location.path()==='/') {
      var address=this.scope.main.oldCol+','+this.scope.main.oldRow;
      this.scope.main.updateRes(this.scope.main.oldObj,address,true);
    }
    this.state.go(sref);
  }

}

angular.module('workspaceApp')
  .controller('NavbarController', NavbarController);
