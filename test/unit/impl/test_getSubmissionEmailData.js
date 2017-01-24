var sinon = require('sinon');
var _ = require('underscore');
var proxyquire = require('proxyquire');
var assert = require('assert');

describe("Building Submission Email Data", function() {
  var mockSubmission = require('../../Fixtures/mockSubmissions').complexSubmission1;
  var mockNotificationMessage = {
    submittedFields: []
  };

  beforeEach(function() {
    this.getSubmissionStub = sinon.stub().callsArgWith(3, undefined, mockSubmission);
    this.buildNotificationParamsStub = sinon.stub().callsArgWith(2, undefined, mockNotificationMessage);

    var mocks = {
      './getSubmission': this.getSubmissionStub,
      './notification': {
        buildNotificationParams: this.buildNotificationParamsStub
      }
    };
    this.getSubmissionEmailData = proxyquire('../../../lib/impl/getSubmissionEmailData', mocks);
  });



  it("It should get a submission and build the email data.", function(done) {
    var self = this;

    var mockConnections = {
      mongooseConnection: {

      },
      databaseConnection: {

      }
    };

    var mockParams = {
      _id: "mocksubmissionid"
    };

    var mockConnectionParams = {
      uri: "mongodb://test.url/database"
    };

    this.getSubmissionEmailData(mockConnections, mockConnectionParams, mockParams, function(err, messageDetails) {
      assert.ok(!err, "Expected no error");

      assert.equal(mockSubmission, messageDetails.formSubmission, "Expected the full submission in the response object");
      assert.equal(mockNotificationMessage, messageDetails.notificationMessage, "Expected the email notification in the response object");

      sinon.assert.calledOnce(self.getSubmissionStub);
      sinon.assert.calledWith(self.getSubmissionStub, sinon.match(mockConnections), sinon.match(mockConnectionParams), sinon.match(mockParams), sinon.match.func);

      sinon.assert.calledOnce(self.buildNotificationParamsStub);
      sinon.assert.calledWith(self.buildNotificationParamsStub, sinon.match(mockConnections), sinon.match({formSubmission: sinon.match(mockSubmission)}), sinon.match.func);

      done();
    });
  });
});