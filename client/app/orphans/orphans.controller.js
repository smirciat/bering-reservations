'use strict';

(function(){

class OrphansComponent {
  constructor($http,moment) {
    $http.get('/api/reservations').then(response=>{
      this.reservations=response.data;
      this.filteredReservations=angular.copy(this.reservations);
      this.filteredReservations.sort((a,b)=>{
        if (moment(a.date).isSame(moment(b.date),'day')) {
          if (a.number===b.number){
            if (a.direction===b.direction){
              return b.row-a.row;
            }
            else return a.direction.localeCompare(b.direction);
          }
          else return parseInt(b.number,10)-parseInt(a.number,10);
        }
        else return new Date(b.date) - new Date(a.date);
      });
    });
  }
}

angular.module('workspaceApp')
  .component('orphans', {
    templateUrl: 'app/orphans/orphans.html',
    controller: OrphansComponent,
    controllerAs: 'orphans'
  });

})();
