'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mailCtrlStub = {
  index: 'mailCtrl.index',
  show: 'mailCtrl.show',
  create: 'mailCtrl.create',
  update: 'mailCtrl.update',
  destroy: 'mailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mailIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './mail.controller': mailCtrlStub
});

describe('Mail API Router:', function() {

  it('should return an express router instance', function() {
    expect(mailIndex).to.equal(routerStub);
  });

  describe('GET /api/mails', function() {

    it('should route to mail.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'mailCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/mails/:id', function() {

    it('should route to mail.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'mailCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/mails', function() {

    it('should route to mail.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'mailCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/mails/:id', function() {

    it('should route to mail.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'mailCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/mails/:id', function() {

    it('should route to mail.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'mailCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/mails/:id', function() {

    it('should route to mail.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'mailCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
