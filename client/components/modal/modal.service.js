'use strict';

angular.module('workspaceApp')
  .factory('Modal', function($rootScope, $uibModal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $uibModal.open() returns
     */
    function openModal(scope = {}, modalClass = 'modal-default') {
      var modalScope = $rootScope.$new();

      angular.extend(modalScope, scope);

      return $uibModal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {
        quickMessage(del = angular.noop) {
          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                quickModal;

            quickModal = openModal({
              modal: {
                dismissable: true,
                title: 'Important Message',
                html: '<p> <strong>' + name + '</strong> </p>',
                buttons: [ {
                  classes: 'btn-success',
                  text: 'OK',
                  click: function(event) {
                    quickModal.close(event);
                  }
                }]
              }
            }, 'modal-success');

            quickModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        } ,
        enterData: function(cb) { //my new modal
          cb = cb || angular.noop;
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                obj,
                formData = {},
                theModal;
            if (args.length>0) obj=args[0]||{};
            else obj={};
            formData.obj=obj;
            theModal = openModal({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
              modal: {
                formData:formData,
                dismissable: true,
                title: 'Enter Required Information',
                html: '<p>' + name + '</p>', //set the modal message here, name is the parameter we passed in
                buttons: [ {//this is where you define you buttons and their appearances
                  classes: 'btn-primary',
                  text: 'Confirm',
                  click: function(event) {
                    theModal.close(event);
                  }
                },]
              }
            }, 'modal-success');
            theModal.result.then(function(event) {
              cb.apply(event, [formData]); //this is where all callback is actually called
            });
          };
        },
        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete(del = angular.noop) {
          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name +
                  '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });
