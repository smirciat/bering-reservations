'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket,$timeout,$window,appConfig,moment,Modal,Auth,$q) {
      var constSelf=this;
      this.http = $http;
      this.getCurrentUser=Auth.getCurrentUser;
      this.isUser=Auth.isUser;
      this.socket = socket;
      this.scope=$scope;
      this.$q=$q;
      this.canceller = this.$q.defer();
      this.window=$window;
      this.loaded=false;
      this.timeout=$timeout;
      this.appConfig=appConfig;
      this.flights=[];
      this.tabs=[];
      this.moment=moment;
      this.awesomeThings = [];
      this.colList=[];
      this.date=new Date();
      this.isDatepickerOpen=false;
      this.datePickerOptions={};
      this.currentTab=1;
      this.timeoutInterval=0;
      this.data={};
      this.oldObj={};
      this.oldCol=-1;
      this.oldRow=-1;
      this.morningTabs=2;
      this.afternoonTabs=2;
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
      this.quickMessage=Modal.confirm.quickMessage();
      this.reschedule = Modal.confirm.enterData(formData =>{
        if (!formData.number||!formData.date||formData.number===""||formData.date===null) {
          this.quickMessage("Fail!  Try again and enter the new flight number and date");
        }
        else {
          this.oldObj.number=formData.number;
          this.oldObj.date=formData.date;
          var address=this.oldCol+','+this.oldRow;
          this.updateRes(this.oldObj,address,false,true);
        }
        
      });
      this.return = Modal.confirm.enterData(formData=>{
        if (!formData.number||!formData.date||formData.number===""||formData.date===null) {
          this.quickMessage("Fail!  Try again and enter the new flight number and date");
        }
        else {
          var obj=angular.copy(formData.obj);
          obj._id=undefined;
          obj.number=formData.number;
          obj.date=formData.date;
          if (obj.direction==="inbound") obj.direction="outbound";
          else obj.direction="inbound";
          var address=this.oldCol+','+this.oldRow;
          this.updateRes(obj,address,false,false);
        }
      });
      this.keys = [];
      this.keys.push({ code: 38, action: ()=> { this.oldRow=this.row; this.row--; this.updateFocus(); }});
      this.keys.push({ code: 40, action: ()=> { this.oldRow=this.row; this.row++; this.updateFocus(); }});
      this.keys.push({ code: 13, action: ()=> { this.oldRow=this.row; this.row++; this.updateFocus(); }});
      this.keys.push({ code: 37, action: ()=> { this.oldCol=this.col; this.col--; this.updateFocus(); }});
      this.keys.push({ code: 39, action: ()=> { this.oldCol=this.col; this.col++; this.updateFocus(); }});
      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('reservation');
      });
      $scope.$on('keydown', ( msg, obj )=> {
        this.keys.forEach((o)=> {
          if ( o.code !== obj.code ) return;
          o.action();
          $scope.$apply();
        });
      });
      $scope.handleDragStart = function(e){
        constSelf.dragID=this.id.substring(4);
        e.dataTransfer.setData('text', 'foo');
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
          constSelf.updateRes(constSelf.data[drag],drag,true);
          constSelf.updateRes(constSelf.data[drop],drop,true);
        }
        $scope.$apply();//important
      };
      $scope.handleDragOver = function (e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
      };
      $scope.$watchGroup(['main.col','main.row'],(newValues,oldValues)=>{
        //var address=this.oldCol+','+this.oldRow;
        //this.updateRes(this.oldObj,address,true);
      });
      
    }

    $onInit() {
      this.user=this.getCurrentUser();
      this.timeout(()=>{
        this.loaded=true;
        if (this.isUser()) this.upDate(this.date);
      },750);
    }
    
    reservedBy(col,row){
      if (this.data&&this.data[col+','+row]) return this.data[col+','+row].reservedBy;
      return;
    }
    
    setOldObj(col,row){
      this.oldObj=this.data[col+','+row];
      this.oldCol=col;
      this.oldRow=row;
      this.timeout(()=>{
        var address=this.oldCol+','+this.oldRow;
        this.updateRes(this.oldObj,address,true);
      });
    }
    
    newFocus(type,col,row){
      //do stuff with old this.col & row?
      this.col=col;
      this.row=row;
      if (!this.data[col+','+row]) this.data[col+','+row]={};
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
      if (this.rows[this.rows.length-1]-row<16) return "dropup";
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
    
    purple(col,row){
      if (this.data[col+','+row]&&this.data[col+','+row].purple) return "purple";
    }
    
    red(col,row){
      if (this.data[col+','+row]&&this.data[col+','+row].red) return "red";
    }
    
    orange(col,row){
      if (this.data[col+','+row]&&this.data[col+','+row].canceled) return "orange";
    }
    
    blue(col,row){
      if (this.data[col+','+row]&&this.data[col+','+row].checkedIn) return "blue";
    }
    
    check(col,row){
      if (this.data[col+','+row]&&this.data[col+','+row].checkedIn) {
        return "short-name-input";
      }
    }
    
    cancel(col,row){
      this.data[col+','+row].canceled=!this.data[col+','+row].canceled;
      var address=col+','+row;
      this.updateRes(this.data[col+','+row],address,true);
    }
    
    checkIn(col,row){
      this.data[col+','+row].checkedIn=!this.data[col+','+row].checkedIn;
      var address=col+','+row;
      this.updateRes(this.data[col+','+row],address,true);
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
      this.date=currDate;
      this.currMoment=this.moment(currDate);
      this.weekday=this.moment(currDate).day();
      this.extras=this.appConfig.extras.filter(extra=>{
        return this.moment(extra.date).isSame(this.currMoment,'day');
      });
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
      var flights=angular.copy(this.flightList);
      if (this.extras&&this.extras.length===1) this.extras[0].flights.forEach(extra=>{
        flights.forEach(flight=>{
          if (flight.number===extra.substring(1)) {
            var i=-1;
            this.flightList.forEach((f,index)=>{
              if (f.number.slice(-3)===flight.number) i=index;
            });
            var tempFlight = angular.copy(flight);
            tempFlight.number=extra;
            this.flightList.splice(i+1,0,tempFlight);
          }
        });
      });
      var blankFlight=angular.copy(this.flightList[1]);
      blankFlight.number='XXX';
      blankFlight.off='';
      blankFlight.on='';
      blankFlight.routing='';
      for (var i=0;i<this.flightList.length;i++){
        if (!this.flightList[i].morning){
          var modifier=0;
          if (this.weekday>0&&this.weekday<6) modifier=1;
          if ((i-modifier)%3===2) this.flightList.splice(i,0,blankFlight);
          if ((i-modifier)%3===1) {
            this.flightList.splice(i,0,blankFlight);
            this.flightList.splice(i,0,blankFlight);
          }
          i=this.flightList.length;
        }
      }
      this.updateTab(this.currentTab);
    }
    
    updateTab(index){
      this.socket.unsyncUpdates('reservation');
      this.reservations=[];
      this.data={};
      this.row=-1;
      this.col=-1;
      this.currentTab=index;
      var morningCols=0;
      var afternoonCols=0;
      this.flightList.forEach(flight=>{
        if (flight.morning){
          if (flight.inbound) morningCols++;
          if (flight.outbound) morningCols++;
        }else {
          if (flight.inbound) afternoonCols++;
          if (flight.outbound) afternoonCols++;
        }
      });
      if (this.scope.nav) this.scope.nav.updateTabs(morningCols,afternoonCols);
      var remainingAM=Math.floor((morningCols+1)/2);
      var remainingPM=Math.floor((afternoonCols+1)/2);
      var indexList=[0];
      var numColList=[0];
      var indexCount=0;
      this.tabs.forEach((tab,i)=>{
        var count=3;
        if (this.weekday>0&&this.weekday<6&&i===0) count=4;
        if (this.weekday>0&&this.weekday<6&i===(this.tabs.length-1)) count=4;
        if (tab.morning){
          if (remainingAM>0) indexList.push(indexCount);
          else {
            indexList.push(-1);
            indexCount-=count;
          }
        }
        if (!tab.morning) {
          if (remainingPM>0) indexList.push(indexCount);
          else {
            indexList.push(-1);
            indexCount-=count;
          }
        }
        if (count===3) numColList.push(6);
        else numColList.push(7);
        indexCount+=count;
        if (tab.morning) remainingAM-=count;
        else remainingPM-=count;
      });
      this.index=indexList[this.currentTab];
      this.numCols=numColList[this.currentTab];
      this.setCols();
      this.http.get('/api/things').then(res=>{
        this.setFlights();
      },res=>{
        this.setFlights();
      });
    }
    
    findCol(number,direction){
      var returnCol=-1;
      this.colList.forEach((col,index)=>{
        if (col.number===number&&col.direction===direction) returnCol=index;
      });
      return returnCol;
    }
    
    findNumber(col){
      return this.colList[col];
    }
    
    setCols(){
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
      if (this.index>=this.flightList.length||this.index<0) return;
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
      this.date=new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),0,0,0); 
    }
    
    setFlights(){
      var obj={date:this.date};
      this.canceller.resolve();
      this.canceller = this.$q.defer();
      var req={
        method:"POST",
        url:'/api/reservations/day',
        data:obj,
        timeout:this.canceller.promise
      };
      this.http(req).then(response=>{
        var arr=response.data.filter(res=>{
          return res.name!==""&&res.row<=39;
        });
        this.reservations=arr.filter(res=>{
          var answer=false;
          this.colList.forEach(col=>{
            if (col.direction===res.direction&&col.number===res.number) answer=true;
          });
          return answer;
        });
        this.reservations.forEach(res=>{
          var col=this.findCol(res.number,res.direction);
          if (this.data[col+','+res.row]&&this.data[col+','+res.row].name&&this.data[col+','+res.row].name!==''){
            var newRow=this.copyToNextBlank(res,col,res.row);  //unfortunately, the table is not yet populated, so newRow may be occupied        
            //console.log(col + ',' + newRow)
          }
          else this.data[col+','+res.row]=res;
        });
        this.socket.unsyncUpdates('reservation');
        this.socket.syncUpdates('reservation', this.reservations, (event, item, array)=>{
          this.timeout(()=>{
            var col=this.findCol(item.number,item.direction);
            for (var i=1;i<=this.numCols;i++) {
              for (var j=1;j<=39;j++){
                if (this.data[i+','+j]&&this.data[i+','+j]._id===item._id) {
                  this.data[i+','+j]={};
                }  
                if (this.data[i+','+j]&&!this.data[i+','+j]._id&&this.data[i+','+j].name===item.name
                    &&this.colList[i].number===item.number) {
                      this.data[i+','+j]={};
                    }
              }
            }
            if (event!=="deleted") {
              var valid=false;
              this.colList.forEach(col=>{
                if (col.direction===item.direction&&col.number===item.number&&this.currMoment.isSame(this.moment(item.date),'day')) valid=true;
              });
              if (valid){
                if (this.data[col+','+item.row]&&!this.data[col+','+item.row]._id){
                    this.copyToNextBlank(this.data[col+','+item.row],col,item.row);
                }
                  this.data[col+','+item.row]=item;
              }
            }
          },0);
        });
      },err=>{
        if (err.status===-1) console.log('cancelled, click slower!');
        else console.log(err);
      });
    }
    
    copyToNextBlank(obj,col,row){
      var done=false;
      var address;
      while (done===false){
        row++;
        address=col+','+row;
        if (!this.data[col+','+row]||typeof this.data[col+','+row]==="undefined"||this.data[col+','+row].name===null||this.data[col+','+row].name===""){
          obj.row=row;
          this.data[col+','+row]=obj;
          done=true;
          //this.timeout(()=>{this.updateRes(obj,address,true)},500);
        }
      }
      return row;
    }
    
    delete(obj){
      if (this.user.name==='pilots') return;
      this.http.delete('/api/reservations/'+obj._id).then(response=>{});
    }
    
    updateRes(obj,address,inTable,reschedule){
      if (!obj||Object.keys(obj).length === 0||typeof obj==="undefined"||typeof this.data[address]==="undefined") return;
      if (obj.name===null||obj.name===""){
        this.data[address]={};
        if (obj._id){
          this.delete(obj);
        }
        return;
      }
      var addrArray=address.split(',');
      if (addrArray[0]==="-1"||addrArray[1]==="-1") return;
      if (addrArray[1]==="33") return;
      this.data[address].red=false;
      this.data[address].purple=true;
      if (inTable){
        obj.number=this.colList[addrArray[0]].number;
        obj.row=parseInt(addrArray[1],10);
        obj.date=this.date;
      }
      if (inTable||reschedule) obj.direction=this.colList[addrArray[0]].direction;
      if (inTable) this.commit(obj,address,true);
      else{
        var params={date:obj.date};
        obj.row=-1;
        this.http.post('/api/reservations/day', params).then(response=>{
          var reservations=response.data.filter(res=>{
            return res.number===obj.number&&res.direction===obj.direction&&res.name!==""&&res.row<=39;
          });
          for (var i=1;i<=39;i++){
            var exist=false;
            reservations.forEach(res=>{
              if (res.row===i) exist=true;
            });
            if (!exist) {
              obj.row=i;
              i=40;
            }
          }
          if (obj.row>0){
            this.commit(obj,address,false);
            if (reschedule) this.data[address]={};
          }
          });
      }
    }
    
    commit(obj,address,inTable){
      if (this.user.name==='pilots') return;
      if (obj._id) {
        var sameTable=false;//change to false to re-enable same tab checking prior to update
        var sameDate=false;
        this.http.get('/api/reservations/'+obj._id).then(response=>{
          if (this.moment(obj.date).isSame(this.moment(this.date),'day')) sameDate=true;
          var col = this.findCol(obj.number,obj.direction);
          if (col>=0) sameTable=true;
          //only do if not inTable or same table
          if (!inTable||(sameTable&&sameDate)) {
            obj.lastModifiedBy=this.user.name;
            obj.dateModified=new Date();
            this.http.put('/api/reservations/'+obj._id,obj).then(response=>{
              if (this.data[address]) this.data[address].purple=false;
              this.reservations.forEach(res=>{
                if (res._id===response.data._id) {
                  res=response.data;//perhaps not needed?
                }
              });
            },err=>{
              console.log(err);
              this.data[address].purple=false;
              this.data[address].red=true;
            });
          }
        },err=>{
          console.log(err);
        });
      }
      else {
        obj.reservedBy=this.user.name;
        obj.dateReserved=new Date();
        this.http.post('/api/reservations',obj).then(response=>{
          if (!this.data[address]) return;
          this.data[address].purple=false;
          if (inTable) this.data[address]._id=response.data._id;
          this.reservations.push(response.data);
        },err=>{
          console.log(err);
          this.data[address].purple=false;
          this.data[address].red=true;
        });
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