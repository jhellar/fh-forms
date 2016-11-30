var assert = require('assert');

describe("Get Next Phantom Port Number", function() {

  before(function(done) {
    this.getNextPhantomPort = require('../../../lib/impl/pdfGeneration/getNextPhantomPort.js');
    done();
  });

  it("The first port should be 10100 for cluster worker 1", function(done) {
    var port = this.getNextPhantomPort();

    assert.strictEqual(10100, port);
    done();
  });

  it("The next one should be 10101", function(done){
    var port = this.getNextPhantomPort();

    assert.strictEqual(10101, port);
    done();
  });

  it("It should reset to 10100 after 100 calls for worker 1", function(done){
    var port;

    //98 more calls to get to 100
    for (var time = 0; time < 98; time++) {
      port = this.getNextPhantomPort();
    }

    //The 100th call should have port 10199 as it is 0 based.
    assert.strictEqual(10199, port);

    //The 101st call should reset to port 10100 as % 100 is used.
    port = this.getNextPhantomPort();

    assert.strictEqual(10100, port);
    done();
  });

});