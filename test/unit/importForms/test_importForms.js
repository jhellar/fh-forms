var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var importFormsPath = "../../../lib/impl/importForms";
var path = require('path');
var fs = require('fs');

describe("Importing Forms", function(){

  describe("Validation", function(){
    it("Validate Zip File Path", function(done){
      var importCBSpy = sinon.spy();
      var formsImport = proxyquire(importFormsPath, {});

      formsImport.importForms({}, {
        zipFilePath: "/some/path/to/zip/file.zip"
      }, importCBSpy);

      sinon.assert.calledWith(importCBSpy, sinon.match("workingDir"));
      done();
    });

    it("Validate Working Directory Path", function(done){
      var importCBSpy = sinon.spy();
      var formsImport = proxyquire(importFormsPath, {});

      formsImport.importForms({}, {
        workingDir: "/some/path/to/working/directory"
      }, importCBSpy);

      sinon.assert.calledWith(importCBSpy, sinon.match("zipFilePath"));
      done();
    });

    describe("Validate Actual Zip File", function(){
      var pdfPath = path.resolve(__dirname, '../../Fixtures/import.pdf');
      var samplePath = path.resolve(__dirname, '../../Fixtures/sample.pdf');

      it("Not ZIP File", function(done){
        // The file will be cleaned up after the import fails
        // so we have to create a fresh copy for every test
        var stream = fs.createWriteStream(pdfPath);
        fs.createReadStream(samplePath).pipe(stream);
        stream.on('finish', function (err) {
          assert.ok(!err, "Error copying the sample pdf file");

          var formsImport = proxyquire(importFormsPath, {});

          formsImport.importForms({}, {
            workingDir: "/tmp",
            zipFilePath: pdfPath
          }, function(err){
            assert.ok(err.indexOf("application/zip") > -1);
            assert.ok(err.indexOf("application/pdf") > -1);

            done();
          });
        });
      });

      it("Actual Zip File", function(done){
        var unzipFileStub = sinon.stub().callsArg(1);
        var importFromDirStub = sinon.stub().yields();
        var inputValidatorStub = sinon.stub().yields();
        var formsImport = proxyquire(importFormsPath, {
          './unzipFile': unzipFileStub,
          './importFromDir': importFromDirStub,
          './inputValidator': inputValidatorStub,
          'child_process':  {
            exec: sinon.stub().yields()
          }
        });

        formsImport.importForms({}, {
          workingDir: "/tmp",
          zipFilePath: path.resolve(__dirname, '../../Fixtures/forms.zip')
        }, function(err){
          assert.ok(!err, "Expected No Error " + err);

          sinon.assert.calledWith(unzipFileStub, sinon.match({
            workingDir: sinon.match("/tmp"),
            zipFilePath: path.resolve(__dirname, '../../Fixtures/forms.zip'),
            queueConcurrency: sinon.match.number
          }), sinon.match.func);

          done();
        });
      });
    });
  });
});
