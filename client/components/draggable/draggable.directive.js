'use strict';

angular.module('workspaceApp')
  .directive('draggable', function () {
    return {
      //template: '<div></div>',
      restrict: 'A',
      link: function (scope, element, attrs) {
        element[0].addEventListener('dragstart', scope.handleDragStart, false);
        element[0].addEventListener('dragend', scope.handleDragEnd, false);
      }
    };
  })
  .directive('droppable', function () {
    return {
      //template: '<div></div>',
      restrict: 'A',
      link: function (scope, element, attrs) {
        element[0].addEventListener('drop', scope.handleDrop, false);
        element[0].addEventListener('dragover', scope.handleDragOver, false);
      }
    };
  });
