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

    //98 more calls and it should reset to 10100 for worker 1
    for (var time = 0; time < 99; time++){
      port = this.getNextPhantomPort();
    }

    assert.strictEqual(10100, port);
    done();
  });

});