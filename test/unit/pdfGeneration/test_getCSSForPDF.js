var _ = require('underscore');
var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');

describe("Getting CSS Files For PDF Generation ", function() {

  it("It should read the files first", function(done) {

    var mockFileRead = sinon.stub();

    mockFileRead.withArgs(sinon.match(/css/), sinon.match.string, sinon.match.func).callsArgWith(2, undefined, 'somecss');
    mockFileRead.withArgs(sinon.match(/js/), sinon.match.string, sinon.match.func).callsArgWith(2, undefined, 'somejs');

    var mocks = {
      fs: {
        readFile: mockFileRead
      }
    };

    var getCSSForPDF = proxyquire('../../../lib/impl/pdfGeneration/getCSSForPDF.js', mocks);

    getCSSForPDF(function(err, cssResult) {
      assert.ok(!err, "Expected no error " + err);

      console.log("cssResult", cssResult);


      assert.ok(cssResult.css.indexOf('somecss') > -1, "Expected css response from css read");
      assert.ok(cssResult.js.indexOf('somejs') > -1, "Expected js response from js read");

      sinon.assert.callCount(mockFileRead, 11, "Expeded only 11 files read");

      done();
    });
  });

});