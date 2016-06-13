var assert = require('assert');
var proxyquire = require('proxyquire');
var Handlebars = require('handlebars');
var _ = require('underscore');

module.exports = {
  setUp: function(done){
    done();
  },
  tearDown: function(done){
    done();
  },
  "Test Create Phantom Session": function(done){

    var mocks = {
      'phantom': {
        create: function(params, cb) {
          return cb({
            fake: "phantom",
            exit: function(){}
          });
        }
      }
    };

    var _createPhantomSession = proxyquire('../../../lib/impl/pdfGeneration/renderPDF.js', mocks).createPhantomSession;

    _createPhantomSession(function(err, createdPhantomSession){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(createdPhantomSession.fake, "phantom");

      //Creating It again should return the same object
      _createPhantomSession(function(err, shouldBeTheSameObject){
        assert.ok(!err, "Expected No Error " + err);

        done();
      });
    });
  },
  "Test Load PDF Template": function(done){

    var _loadPdfTemplate = require('../../../lib/impl/pdfGeneration/renderPDF.js').loadPdfTemplate;

    _loadPdfTemplate({
      location: "http://somehost.com"
    }, function(err, formTemplate){
      assert.ok(!err, "Expected No Error " + err);

      assert.ok(_.isFunction(formTemplate), "Expected A Compiled Form Template");
      done();
    });
  },
  "Test Render PDF": function(done){
    var fileDetails = {
      groupId: "fileGroupId",
      fileName: "file.pdf",
      fileSize: 1234,
      fileType: "application/pdf",
      hashName: "filePlaceholderfile1234"
    };

    var photoDetails = {
      groupId: "photoFileGroupId",
      fileName: "photo.jpeg",
      fileSize: 412,
      fileType: "application/jpeg",
      hashName: "filePlaceholderphoto1234"
    };

    var testSubmission = {
      _id: "somesubmissionid",
      formId: "someformid",
      formFields: [
        {
          fieldId: "somefilefieldid",
          values: [fileDetails]
        },
        {
          fieldId: "somephotofieldid",
          values: [photoDetails]
        }
      ],
      formSubmittedAgainst: {
        _id: "someformid",
        pages: [
          {
            _id: "somepageid",
            fields: [{
              _id: "somefilefieldid",
              type: "file",
              values: [fileDetails]
            }, {
              _id: "somephotofieldid",
              type: "photo",
              values: [photoDetails]
            }]
          }
        ]
      }
    };

    var _renderPdf = require('../../../lib/impl/pdfGeneration/renderPDF.js').renderPdf;


    var fakePhantomSession = {
      exit: function(){},
      createPage: function(cb){
        return cb({
          set: function(param, params, cb){
            return cb();
          },
          setContent: function(html, param, cb){
            assert.equal(html,"somehtml");
            cb("ok");
          },
          render: function(filePath, cb){
            assert.equal(filePath, "/some/place/to/export/pdf/and/files/to/someformid_somesubmissionid.pdf");
            return cb();
          },
          close: function(){}
        });
      }
    };

    var fakeTemplate = function(templateParams){
      assert.ok(templateParams.subexport, "Expected A Submission To Export");
      assert.ok(templateParams.form, "Expected A Form To Export");
      assert.equal(templateParams.location, "http://location.for.pdf.com");
      return "somehtml";
    };

    _renderPdf({
      template: fakeTemplate,
      session: fakePhantomSession,
      form: testSubmission.formSubmittedAgainst,
      submission: testSubmission,
      location: "https://location.for.pdf.com",
      pdfExportDir: "/some/place/to/export/pdf/and/files/to"
    }, function(err, renderedPDFFilePath){
      assert.ok(!err, "Expectd No Error " + err);
      assert.equal(renderedPDFFilePath, "/some/place/to/export/pdf/and/files/to/someformid_somesubmissionid.pdf");

      done();
    });
  }
};