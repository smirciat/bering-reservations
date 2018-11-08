'use strict';

angular.module('workspaceApp', ['workspaceApp.auth', 'workspaceApp.admin', 'workspaceApp.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap',
    'AngularPrint','luegg.directives','angular-web-notification','emoji','angularMoment','ui.select','validation.match'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
