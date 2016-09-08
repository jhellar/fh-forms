var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var fakeForms = require('../../Fixtures/mockforms.js');
var sinon = require('sinon');

var fakeMongoString = "mongo://127.0.0.1:27017";
var mockSubmissions = require('../../Fixtures/mockSubmissions');
var mocks = {
  '../forms.js': fakeForms
};

var submissionsHandler = proxyquire('../../../lib/middleware/submissions.js', mocks);

module.exports = {
  setUp: function(done){
    done();
  },
  tearDown: function(done){
    done();
  },
  "It Should List All Submissions": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    submissionsHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected No Error");
      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected An Array Of Submissions To Be Returned");
      done();
    });
  },
  "It Should Get A Specific Permission": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somesubmissionid"
      }
    };

    submissionsHandler.get(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected A Single Submission To Be Returned");
      assert.ok(req.appformsResultPayload.data._id, "Expected A Submissions Result ID");
      done();
    });
  },
  "It Should Update A Submission": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somesubmissionid"
      },
      body: {
        _id: "somesubmissionid",
        submissionCompletedTimestamp: 123456
      }
    };

    submissionsHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected A Single Submission To Be Returned");
      assert.ok(req.appformsResultPayload.data.submissionCompletedTimestamp, "Expected A Submissions Result Timestamp");
      done();
    });
  },
  "It Should Remove A Submission": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somesubmissionid"
      }
    };

    submissionsHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      done();
    });
  },
  "It Should Get A Submission File": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somesubmissionfile",
        fieldId: "someFieldId",
        fileId: "someFileId"
      }
    };

    submissionsHandler.getSubmissionFile(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(req.appformsResultPayload.data, "Expected A Submissions Result");
      assert.ok(req.appformsResultPayload.data.stream, "Expected A File Stream");

      done();
    });
  },
  "It Should Update A Submission File": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somesubmissionfile",
        fieldId: "someFieldId",
        fileId: "someFileId"
      },
      body: {
        hashName: "somefilehashname"
      },
      appformsResultPayload: {
        data: {
          submission: {
            fileStream: "path/to/file/on/local/filesystem",
            fileName: "somefile.pdf"
          },
          fileDetails: {
            fileName: "somefile.pdf",
            fileType: "application/pdf"
          }
        }
      }
    };

    submissionsHandler.updateSubmissionFile(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      done();
    });
  },
  "It Should Search Submissions": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: {
        formId: "someformid",
        clauseOperator: "or",
        queryFields: {
          clauses: [{
            fieldId: "somefieldid",
            restriction: "is",
            value: "somecomparisonvalue"
          }]
        },
        queryMeta: {

        }
      }
    };

    submissionsHandler.search(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected A Submissions Array.");
      done();
    });
  },
  "It Should Filter on getSubmissions": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        projectid: mockSubmissions.complexSubmission1.appId
      },
      body: {
        formId: "someSubmissionFormId",
        subid: "someSubmissionId"
      }
    };
    submissionsHandler.listProjectSubmissions(req, {}, function(err) {
      assert.ok(!err, "Expected No Error");
      sinon.assert.calledWith(fakeForms.getSubmissions,
        sinon.match({
          uri: sinon.match(fakeMongoString)
        }),
        sinon.match({
          formId: req.body.formId,
          subid: [sinon.match(req.body.subid)],
          wantRestrictions: sinon.match.bool,
          appId: sinon.match(mockSubmissions.complexSubmission1.appId)
        }),
        sinon.match.func
      );
      assert.equal(req.appformsResultPayload.data.submissions[0]._id, req.body.subid, "Expected same submission id");
      done();
    });
  }
};