'use strict';

angular.module('workspaceApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main id="main"></main>'
    });
  });
