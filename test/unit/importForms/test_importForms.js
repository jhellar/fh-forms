var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var importFormsPath = "../../../lib/impl/importForms";

describe("Importing Forms", function(){

  describe("Validation", function(){
    it("Validate Zip File Path", function(done){
      var importCBSpy = sinon.spy();
      var formsImport = proxyquire(importFormsPath, {});

      formsImport.importForms({}, {
        zipFilePath: "/some/path/to/zip/file.zip"
      }, importCBSpy);

      sinon.assert.calledWith(importCBSpy, sinon.match.match("workingDir"));
      done();
    });

    it("Validate Working Directory Path", function(done){
      var importCBSpy = sinon.spy();
      var formsImport = proxyquire(importFormsPath, {});

      formsImport.importForms({}, {
        workingDir: "/some/path/to/working/directory"
      }, importCBSpy);

      sinon.assert.calledWith(importCBSpy, sinon.match.match("fileZipPath"));
      done();
    });

    describe("Validate Actual Zip File", function(){
      it("Not ZIP File", function(done){
        var formsImport = proxyquire(importFormsPath, {});

        formsImport.importForms({}, {
          workingDir: "/some/path/to/working/directory",
          zipFilePath: "/Fixtures/test.pdf"
        }, function(err){
          assert.ok(err.indexOf("application/zip") > -1);
          assert.ok(err.indexOf("application/pdf") > -1);

          done();
        });
      });

      it("Actual Zip File", function(done){
        var unzipFileStub = sinon.stub().callsArg(1);
        var formsImport = proxyquire(importFormsPath, {
          './unzipFile': unzipFileStub
        });

        formsImport.importForms({}, {
          workingDir: "/some/path/to/working/directory",
          zipFilePath: "/Fixtures/test.zip"
        }, function(err){
          assert.ok(!err, "Expected No Error " + err);

          sinon.assert.calledOnceWith(unzipFileStub, sinon.match({
            workingDir: "/some/path/to/working/directory",
            zipFilePath: "/Fixtures/test.zip",
            queueConcurrency: sinon.match.number
          }), sinon.match.func);

          done();
        });
      });
    });
  });
});
