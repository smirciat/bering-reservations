'use strict';

(function() {

class AdminController {
  constructor($scope,User,Modal,Auth,appConfig,$timeout) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.quickModal = Modal.confirm.quickMessage();
    this.Auth=Auth;
    this.roles = appConfig.userRoles.slice(0);
    Auth.getCurrentUser(()=>{
      //if (!Auth.hasRole('superadmin')) this.roles.pop();
    });
    this.role={};
    this.role.selected = "user";
    this.sort={};
    this.sort.selected = "email";
    this.sortBy = ["_id","email","name"];
  }

  newSort() {
    this.users=this.users.sort((a,b)=>{
      if (this.sort.selected==="_id") return a[this.sort.selected]-b[this.sort.selected];
      else return a[this.sort.selected].localeCompare( b[this.sort.selected]);
    });
  }
  
  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
  
  resetPassword(user){
    var mailOptions = {
          to: user.email, // list of receivers
          subject: 'Bering Air Password reset' // Subject line
        };
    this.Auth.adminChangePassword(user,mailOptions)
      .then(() => {
            this.quickModal('Password successfully reset for ' + user.name + ' id: ' + user._id);
          })
          .catch((err) => {
            console.log(err);
          });
  }
  
  changeRole(user){
    var index = this.users.findIndex(x => x._id==user._id);
    this.users[index].role = this.role.selected;
    this.Auth.adminChangeRole(user._id,this.role.selected)
      .then(() => {
            this.quickModal('Role for ' + user.name + ' id: ' + user._id + ' changed to ' + this.role.selected);
          })
          .catch((err) => {
            console.log(err);
          });
  }
}

angular.module('workspaceApp.admin')
  .controller('AdminController', AdminController);

})();
