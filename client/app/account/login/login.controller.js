'use strict';

class LoginController {
  constructor(Auth, email, $state,Modal) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.email=email;
    this.Auth = Auth;
    this.$state = $state;
    this.quickMessage=Modal.confirm.quickMessage();
  }

  lostPassword() {
    if (this.user.email&&this.user.email!==""){
        this.email.lostPassword(this.user);
        this.quickMessage("Password reset requested.  You should receive an email with password reset information at the address you entered above.");
    }
    else this.quickMessage("Please enter an email address above first.");
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          this.errors.other = err.message;
        });
    }
  }
}

angular.module('workspaceApp')
  .controller('LoginController', LoginController);
