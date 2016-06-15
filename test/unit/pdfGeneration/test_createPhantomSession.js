var _ = require('underscore');
var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');

describe('Create A PhantomJS Session', function() {

  function createMockedFunction(createStub, getNextPortNumberStub){
    var mocks = {
      'phantom': {
        create: createStub
      },
      './getNextPhantomPort': getNextPortNumberStub
    };

    this.createPhantomSession = proxyquire('../../../lib/impl/pdfGeneration/createPhantomSession.js', mocks);
  }

  it("It should create a phantom session", function(done) {
    var mockPhantomSession = {
      id: "somephantomsession"
    };
    var createStub = sinon.stub().callsArgWith(1, mockPhantomSession);
    var getNextPortNumberStub = sinon.stub().returns(10100);

    _.bind(createMockedFunction, this)(createStub, getNextPortNumberStub);

    this.createPhantomSession(function(err, createdSession) {
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(mockPhantomSession, createdSession, "Expected phantom sessions to be equal");

      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, sinon.match({
        port: sinon.match.number,
        onExit: sinon.match.func
      }), sinon.match.func);

      sinon.assert.calledOnce(getNextPortNumberStub);

      done();
    });
  });

  it("It should handle creation errors", function(done) {
    var errMessage = "MOCK PHANTOM CREATE ERROR";
    var createStub = sinon.stub().throws(errMessage);
    var getNextPortNumberStub = sinon.stub().returns(10100);

    _.bind(createMockedFunction, this)(createStub, getNextPortNumberStub);

    this.createPhantomSession(function(err, createdSession) {
      assert.ok(err, "Expected An Error ");
      assert.ok(err.indexOf(errMessage) > -1, "Expected the thrown error to be passed " + err);
      assert.equal(undefined, createdSession, "Expected phantom sessions to be undefined");

      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, sinon.match({
        port: sinon.match.number,
        onExit: sinon.match.func
      }), sinon.match.func);

      sinon.assert.calledOnce(getNextPortNumberStub);

      done();
    });
  });

});