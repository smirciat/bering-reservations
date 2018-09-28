'use strict';

angular.module('workspaceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('orphans', {
        url: '/orphans',
        template: '<orphans></orphans>'
      });
  });
