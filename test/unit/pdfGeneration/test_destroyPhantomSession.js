var sinon = require('sinon');
var assert = require('assert');

describe('Destroy A Phantom Session', function() {

  before(function(done){
    this.destroyPhantomJSPath = '../../../lib/impl/pdfGeneration/destroyPhantomSession.js';
    done();
  });

  it('It Should Destroy an exising session', function(done) {

    var exitSpy = sinon.spy();

    var mockPhantomSession = {
      exit: exitSpy
    };

    var destroyPhantomSession = require(this.destroyPhantomJSPath);

    destroyPhantomSession(mockPhantomSession, function(err) {
      assert.ok(!err, "Expected no error");
      sinon.assert.calledOnce(exitSpy);

      done();
    });
  });

  it('It Should Require a session to destroy', function(done) {

    var destroyPhantomSession = require(this.destroyPhantomJSPath);

    destroyPhantomSession(null, function(err) {
      assert.ok(err, "Expected an error");

      done();
    });
  });

});

