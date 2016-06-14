var sinon = require('sinon');
var assert = require('assert');

describe('Destroy A Phantom Session', function() {

  it('It Should Destroy an exising session', function(done) {

    var exitSpy = sinon.spy();

    var mockPhantomSession = {
      exit: exitSpy
    };

    var destroyPhantomSession = require('../../../lib/impl/pdfGeneration/destroyPhantomSession.js');

    destroyPhantomSession(mockPhantomSession, function(err) {
      assert.ok(!err, "Expected no error");
      sinon.assert.calledOnce(exitSpy);

      done();
    });
  });

  it('It Should Require a session to destroy', function(done) {

    var destroyPhantomSession = require('../../../lib/impl/pdfGeneration/destroyPhantomSession.js');

    destroyPhantomSession(null, function(err) {
      assert.ok(err, "Expected an error");

      done();
    });
  });

});

