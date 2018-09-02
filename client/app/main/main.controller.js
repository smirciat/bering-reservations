'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket,$timeout,$window,appConfig,moment) {
      var constSelf=this;
      this.http = $http;
      this.socket = socket;
      this.scope=$scope;
      this.window=$window;
      this.timeout=$timeout;
      this.appConfig=appConfig;
      this.flights=[];
      this.moment=moment;
      this.awesomeThings = [];
      this.colList=[];
      this.date=new Date();
      this.isDatepickerOpen=false;
      this.datePickerOptions={};
      this.currentTab=1;
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
        socket.unsyncUpdates('reservation');
      });
      $scope.$on('keydown', ( msg, obj )=> {
        var code = obj.code;
        this.keys.forEach((o)=> {
          if ( o.code !== code ) { return; }
          o.action();
          $scope.$apply();
        });
      });
      $scope.handleDragStart = function(e){
        constSelf.dragID=this.id.substring(4);
      };
      $scope.handleDragEnd = function(e){
      };
      $scope.handleDrop =function(e){
        e.preventDefault();
        e.stopPropagation();
        constSelf.dropID=this.id.substring(4);
        var drag=constSelf.dragID;
        var drop=constSelf.dropID;
        if (drag!==drop){
          var temp=angular.copy(constSelf.data[drag]);
          constSelf.data[drag]=angular.copy(constSelf.data[drop]);
          constSelf.data[drop]=angular.copy(temp);
        }
        $scope.$apply();//important
      };
      $scope.handleDragOver = function (e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
      };
      $scope.$watch('main.col',(newValue,oldValue)=>{
      });
      $scope.$watch('main.row',(newValue,oldValue)=>{
        //console.log(oldValue)
      });
      
    }

    $onInit() {
      this.upDate(this.date);
      //this.http.get('/api/reservations')
      //  .then(response => {
      //    console.log(response.data)
          //this.awesomeThings = response.data;
          //this.socket.syncUpdates('thing', this.awesomeThings);
      //  });
    }
    
    newFocus(type,col,row){
      //do stuff with old this.col & row?
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
      if (this.rows[this.rows.length-1]-row<10) return "dropup";
      else return;
    }
    
    checkRow(index){
      var rowClass="";
      if (index===9||index===33) rowClass+= " double-line";
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
    
    upDate(currDate){
      this.weekday=this.moment(currDate).day();
      switch(this.weekday){
        case 0: this.flightList=this.appConfig.flights.filter((flight)=>{
                                    return flight.sunday;
                                  });
                break;
        case 6: this.flightList=this.appConfig.flights.filter((flight)=>{
                                    return flight.saturday;
                                  });
                break;
        default: this.flightList=this.appConfig.flights.filter((flight)=>{
                                    return flight.weekday;
                                  }); 
      }
      this.date=currDate;
      this.currMoment=this.moment(currDate);
      this.updateTab(this.currentTab);
    }
    
    updateTab(index){
      this.currentTab=index;
      if (this.weekday>0&&this.weekday<6){
        switch (index){
          case 1: this.index=0;
                  this.numCols=7;
                  break;
          case 2: this.index=4;
                  this.numCols=6;
                  break;
          case 3: this.index=7;
                  this.numCols=6;
                  break;
          case 4: this.index=10;
                  this.numCols=7;
                  break;
          default: this.index=0;
                   this.numCols=7;
                   this.currentTab=1;
        }
      }
      if (this.weekday===6){
        switch (index){
          case 1: this.index=0;
                  break;
          case 2: this.index=3;
                  break;
          case 3: this.index=6;
                  break;
          case 4: this.index=9;
                  break;
          default: this.index=0;
                   this.currentTab=1;
        }
      }
      if (this.weekday===0){
        switch (index){
          case 1: this.index=0;
                  break;
          case 2: this.index=0;
                  break;
          case 3: this.index=3;
                  break;
          case 4: this.index=3;
                  break;
          default: this.index=0;
                   this.currentTab=1;
        }
      }
      if (this.weekday===6||this.weekday===0) this.numCols=6;
      this.setFlights();
    }
    
    setFlights(){
      this.date=new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),0,0,0); 
      var obj={date:this.date};
      this.http.post('/api/reservations/day', obj).then(response=>{
        console.log(response.data)
      });
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
      this.colList=[];
      for (var i=1;i<=this.numCols;i++) {
        if (outbound) {
          if (this.flightList[this.index].outbound){
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + this.flightList[this.index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 \u00A0\u00A0 On " + this.flightList[this.index].on;
            this.flights.one[i].route = this.flightList[this.index].number + " " + this.flightList[this.index].routing;
            this.flights.one[i].label="OUTBOUND";
            this.colList[i]={number:this.flightList[this.index].number,direction:"outbound"};
          }
          else {
            i--;//there is no outbound leg for this flight, do not take up a colum with it
          }
          outbound=false;
        }
        else {
          if (this.flightList[this.index].inbound){
            var arr=this.flightList[this.index].routing.split('-');
            arr.reverse();
            var route="";
            for (var j=0;j<arr.length;j++){
              route+=arr[j]+'-';
            }
            route=route.substring(0,route.length-1);
            this.flights.one[i]={};
            this.flights.one[i].times="Off Time " + this.flightList[this.index].off + 
                " A/C \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  On " + this.flightList[this.index].on;
            this.flights.one[i].route = this.flightList[this.index].number + " " + route;
            this.flights.one[i].label="INBOUND";
            this.colList[i]={number:this.flightList[this.index].number,direction:"inbound"};
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