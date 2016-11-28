var assert = require('assert');
var sinon = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
var _ = require('underscore');

module.exports = {
  setUp: function(done){
    done();
  },
  tearDown: function(done){
    done();
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

    var timestamp = Date.now();
    var expectedFilePath = "/some/place/to/export/pdf/and/files/to/someformid_somesubmissionid_" + timestamp + ".pdf";

    var _renderPdf = require('../../../lib/impl/pdfGeneration/renderSinglePDF');

    var setContentStub = sinon.stub();
    setContentStub.withArgs(sinon.match("somehtml")).resolves("OK");
    setContentStub.rejects("Expected 'somehtml' argument");

    var fakePhantomSession = {
      exit: sinon.stub(),
      createPage: sinon.stub().resolves({
        property: sinon.stub().resolves(),
        setContent: setContentStub,
        render: sinon.stub().resolves(),
        close: sinon.stub()
      })
    };

    var fakeTemplate = function(templateParams) {
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
      generationTimestamp: timestamp,
      location: "https://location.for.pdf.com",
      pdfExportDir: "/some/place/to/export/pdf/and/files/to"
    }, function(err, renderedPDFFilePath) {
      assert.ok(!err, "Expectd No Error " + err);
      assert.equal(expectedFilePath, renderedPDFFilePath);

      done();
    });
  }
};