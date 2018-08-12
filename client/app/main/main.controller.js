'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket,$timeout,$window,appConfig) {
      this.$http = $http;
      this.socket = socket;
      this.window=$window;
      this.timeout=$timeout;
      this.awesomeThings = [];
      this.data={};
      this.data={'2,1':{name:'Passenger Name',village:'OTZ',phone:'907-555-1212',
          weight:199,email:'test@example.com',comment:'comment',ticket:'ticket#'}};
      this.rows=[];
      for (var i=1;i<=39;i++) {
        this.rows.push(i);
      }
      this.cols=[];
      for (var i=1;i<=7;i++) {
        this.cols.push(i);
        this.data[i+',33']={};
        this.data[i+',33'].name='INTER VILLAGE';
      }
      this.flights={};
      this.flights.one=[];
      var index=0;
      var outbound=true;
      for (var i=1;i<=7;i++) {
        if (outbound) {
          if (appConfig.flights[index].outbound){
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + appConfig.flights[index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 \u00A0\u00A0 On " + appConfig.flights[index].on;
            this.flights.one[i].route = appConfig.flights[index].number + " " + appConfig.flights[index].routing;
            this.flights.one[i].label="OUTBOUND";
          }
          else {
            i--;//there is no outbound leg for this flight, do not take up a colum with it
          }
          outbound=false;
        }
        else {
          if (appConfig.flights[index].inbound){
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + appConfig.flights[index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  On " + appConfig.flights[index].on;
            this.flights.one[i].route = appConfig.flights[index].number + " " + appConfig.flights[index].routing;
            this.flights.one[i].label="INBOUND";
          }
          else {
            i--;//there is no inbound leg for this flight, do not take up a colum with it
          }
          index++;
          outbound=true;
        }
      }
      this.isOpen={};
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
      if (this.dropdownOpen()==="true") return;
      if (this.col<1) this.col=1;
      if (this.row<1) this.row=1;
      if (this.col>this.cols.length) this.col=this.cols.length;
      if (this.row>this.rows.length) this.row=this.rows.length;
      var myId=this.col+","+this.row;
      this.timeout(()=>{
        var myEl = this.window.document.getElementById(myId);
        if (myEl) myEl.focus();
      });
    }
    
    dropdownOpen(){
      var open="false";
      for (var c=0;c<this.cols.length;c++){
        for (var r=0;r<this.rows.length;r++){
          if (this.isOpen[this.cols[c]+','+this.rows[r]]){
            open="true";
            c=this.cols.length;
            r=this.rows.length;
          }
        }
      }
      return open;
    }
    
    bottomFour(row){
      if (this.rows[this.rows.length-1]-row<7) return "dropup";
      else return;
    }
    
    checkRow(index){
      var rowClass="";
      if (index===8||index===33) rowClass+= " double-line";
      return rowClass;
    }
    
    isInterVillage(row){
      if (row===33) return "inter-village";
      return;
    }
    
    toggleDropdown(col,row){
      this.col=col;
      this.row=row;
    }
    
    amIFocused(col,row){
      if (col===this.col&&row===this.row) return "input-focus";
      return;
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