'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket,$timeout,$window,appConfig) {
      this.$http = $http;
      this.socket = socket;
      this.scope=$scope;
      this.window=$window;
      this.timeout=$timeout;
      this.appConfig=appConfig;
      this.awesomeThings = [];
      this.date=new Date();
      this.isDatepickerOpen=false;
      this.datePickerOptions={};
      this.data={};
      this.data={'2,1':{name:'Passenger Name',village:'OTZ',phone:'907-555-1212',
          weight:199,email:'test@example.com',comment:'comment',ticket:'ticket#'}};
      this.rows=[];
      for (var i=1;i<=39;i++) {
        this.rows.push(i);
      }
      this.cols=[];
      this.isOpen={};
      this.col=1;
      this.row=1;
      this.index=0;
      this.numCols=7;
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
      this.setFlights();
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
    
    updateTab(index){
      switch (index){
        case 1: this.index=0;
                this.numCols=7;
                break;
        case 2: this.index=4;
                this.numCols=6;
                break;
        case 3: this.index=10;
                this.numCols=6;
                break;
        case 4: this.index=13;
                this.numCols=7;
                break;
        default: this.index=0;
                 this.numCols=7;
      }
      this.setFlights();
    }
    
    setFlights(){
      this.data={};
      this.cols=[];
      for (var i=1;i<=this.numCols;i++) {
        this.cols.push(i);
        this.data[i+',33']={};
        this.data[i+',33'].name='INTER VILLAGE';
      }
      this.flights={};
      this.flights.one=[];
      var outbound=true;
      for (var i=1;i<=this.numCols;i++) {
        if (outbound) {
          if (this.appConfig.flights[this.index].outbound){
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + this.appConfig.flights[this.index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 \u00A0\u00A0 On " + this.appConfig.flights[this.index].on;
            this.flights.one[i].route = this.appConfig.flights[this.index].number + " " + this.appConfig.flights[this.index].routing;
            this.flights.one[i].label="OUTBOUND";
          }
          else {
            i--;//there is no outbound leg for this flight, do not take up a colum with it
          }
          outbound=false;
        }
        else {
          if (this.appConfig.flights[this.index].inbound){
            var arr=this.appConfig.flights[this.index].routing.split('-');
            arr.reverse();
            var route="";
            for (var j=0;j<arr.length;j++){
              route+=arr[j]+'-';
            }
            route=route.substring(0,route.length-1);
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + this.appConfig.flights[this.index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  On " + this.appConfig.flights[this.index].on;
            this.flights.one[i].route = this.appConfig.flights[this.index].number + " " + route;
            this.flights.one[i].label="INBOUND";
          }
          else {
            i--;//there is no inbound leg for this flight, do not take up a colum with it
          }
          this.index++;
          outbound=true;
        }
      }
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