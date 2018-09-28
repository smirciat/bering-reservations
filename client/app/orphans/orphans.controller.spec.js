'use strict';

describe('Component: OrphansComponent', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var OrphansComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    OrphansComponent = $componentController('orphans', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
