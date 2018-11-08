'use strict';
angular.module('workspaceApp')
  .controller('ChatController', function($scope,$timeout){
    var vm = this;
    
    vm.isHidden = false;
		vm.messages = $scope.messages;
		vm.username = $scope.username;
		
		vm.myUserId = $scope.myUserId;
		vm.inputPlaceholderText = $scope.inputPlaceholderText;
		vm.submitButtonText = $scope.submitButtonText;
		vm.title = $scope.title;
		vm.theme = 'chat-th-' + $scope.theme;
		vm.writingMessage = '';
		vm.panelStyle = {'display': 'block'};
		vm.chatButtonClass= 'fa-angle-double-down icon_minim';
    vm.toggle = toggle;
		vm.close = close;
		vm.submitFunction = submitFunction;
    
		function submitFunction() {
			$scope.submitFunction()(vm.writingMessage, vm.username);
			vm.writingMessage = '';
			scrollToBottom();
		}

		$scope.$watch('visible', function() { // make sure scroll to bottom on visibility change w/ history items
			scrollToBottom();
			$timeout(function() {
				$scope.$chatInput.focus();
			}, 250);
		});
		$scope.$watch('messages.length', function() {
			//seems unnecessary, but it solved my problem.  Link between this.messages and $scope.messages was lost after initialization
			
			scrollToBottom();
			if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
            if ($scope.expandOnNew && vm.isHidden) {
                toggle();
            }
		});

		function scrollToBottom() {
			$timeout(function() { // use $timeout so it runs after digest so new height will be included
				$scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
			}, 200, false);
		}

		function close() {
			$scope.visible = false;
		}

		function toggle() {
			if(vm.isHidden) {
				vm.chatButtonClass = 'fa-angle-double-down icon_minim';
				vm.panelStyle = {'display': 'block'};
				vm.isHidden = false;
				scrollToBottom();
			} else {
				vm.chatButtonClass = 'fa-expand icon_minim';
				vm.panelStyle = {'display': 'none'};
				vm.isHidden = true;
			}
		}
		console.log(vm);
    console.log($scope);
  
});

