'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket,$timeout,$window) {
      this.$http = $http;
      this.socket = socket;
      this.window=$window;
      this.timeout=$timeout;
      this.awesomeThings = [];
      this.data={name:{'2,1':'hereisis'},village:{}};
      this.seven=[1,2,3,4,5,6,7];
      this.twelve=[1,2,3,4,5,6,7,8,9,10,11,12];
      this.col=1;
      this.row=1;
      this.keys = [];
      this.keys.push({ code: 38, action: ()=> { this.row--; this.updateFocus(); }});
      this.keys.push({ code: 40, action: ()=> { this.row++; this.updateFocus(); }});
      this.keys.push({ code: 37, action: ()=> { this.col--; this.updateFocus(); }});
      this.keys.push({ code: 39, action: ()=> { this.col++; this.updateFocus(); }});
      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('thing');
      });
      $scope.$on('keydown', ( msg, obj )=> {
        var code = obj.code;
        this.keys.forEach((o)=> {
          if ( o.code !== code ) { return; }
          o.action();
          $scope.$apply();
        });
      });
    }

    $onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
          this.socket.syncUpdates('thing', this.awesomeThings);
        });
    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', {
          name: this.newThing
        });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }
    
    newFocus(type,col,row){
      this.col=col;
      this.row=row;
    }
    
    updateFocus(){
      var myId=this.col+","+this.row;
      console.log(myId);
      this.timeout(()=>{
        var myEl = this.window.document.getElementById(myId);
        if (myEl) myEl.focus();
      });
    }
  }

  angular.module('workspaceApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'main'
    })
    .directive('keyTrap', function() {
      return function( scope, elem ) {
        elem.bind('keydown', function( event ) {
          scope.$broadcast('keydown', { code: event.keyCode } );
        });
      };
    });
})();