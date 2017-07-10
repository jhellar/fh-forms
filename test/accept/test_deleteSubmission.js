require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var logger = require('../../lib/common/logger').getLogger();
var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');
var util = require('util');
var _ = require('underscore');
var simpleForm = require('../Fixtures/simple');
var fieldData = require('../Fixtures/formSubmissions');
var baseSubmission = require('../Fixtures/baseSubmission');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var createdFormId, textFieldId, fileFieldId;
var testFilePath = "./test/Fixtures/test.pdf";

module.exports.test = {}; module.exports.test.before = function(done) {

  var form = simpleForm.getBaseForm();
  var textField = fieldData.textFieldData;
  var fileField = fieldData.fileFieldData;

  //Adding the fields to the form
  form.pages[0].fields.push(textField);
  form.pages[0].fields.push(fileField);

  forms.updateForm(options, form, function(err, createdForm) {
    assert.ok(!err, "Expected no error " + util.inspect(err));
    assert.ok(createdForm._id, "Expected a created form ID");
    assert.equal(textField.name, createdForm.pages[0].fields[0].name, "Expected the text field as the first field");
    assert.equal(fileField.name, createdForm.pages[0].fields[1].name, "Expected the file field as the second field");

    createdFormId = createdForm._id;
    textFieldId = createdForm.pages[0].fields[0]._id;
    fileFieldId = createdForm.pages[0].fields[1]._id;

    done();
  });

};

/**
 * Utility function to submit a JSON submission
 * @param {object}  full submission JSON definition
 * @param cb
 */
function submitFormData(submission, cb) {
  forms.submitFormData(_.extend({submission: submission}, options), function(err, submissionResult) {
    assert.ok(!err, "Expected no error " + util.inspect(err));
    assert.ok(!submissionResult.error, "Expected No Submission Error " + util.inspect(submissionResult.error));
    assert.ok(submissionResult.submissionId, "Expected A Submission ID");

    cb(undefined, submissionResult.submissionId);
  });
}

function submitFileField(submissionId, fieldId, fileField, cb){
  var fileSubmission = {
    "submissionId" : submissionId,
    "fileId": fileField.hashName,
    "fieldId": fieldId,
    "fileStream" : testFilePath,
    "keepFile": true
  };
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : fileSubmission}, function(err, result){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result.savedFileGroupId);
    cb(undefined, submissionId);
  });
}

function completeSubmission(submissionId, cb) {
  var form = {
    "uri": process.env.FH_DOMAIN_DB_CONN_URL,
    "submission": {"submissionId" : submissionId}
  };
  forms.completeFormSubmission(form, function(err, completionResult) {
    assert.ok(!err, "Expected no error " + util.inspect(err));
    assert.strictEqual(completionResult.formSubmission.status, "complete",
                       "should be COMPLETE submission: " + util.inspect(completionResult.formSubmission));
    cb(undefined, submissionId);
  });
}

module.exports.test.after = function(done) {
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err, "Expected no error " + util.inspect(err));
    done();
  });
};

module.exports.test.testDeleteSubmission = function(finish) {
  var submission = baseSubmission();
  submission.formId = createdFormId;
  submission.formFields = [{
    "fieldId": textFieldId,
    "fieldValues": ["Some Text Value1", "Some Text Value2"]
  }, {
    "fieldId": fileFieldId,
    "fieldValues": [{
      "fileName" : "test.pdf",
      "fileSize" : 123456,
      "fileType" : "application/pdf",
      "fileUpdateTime" : new Date().getTime(),
      "hashName" : "filePlaceHolder123456"
    }, {
        "fileName" : "test.pdf",
        "fileSize" : 123456,
        "fileType" : "application/pdf",
        "fileUpdateTime" : new Date().getTime(),
        "hashName" : "filePlaceHolder123456789"
    }]
  }];

  async.waterfall([
    async.apply(submitFormData, submission),
    function submitFile1(submissionId, callback) {
      submitFileField(submissionId, fileFieldId, submission.formFields[1].fieldValues[0], callback);
    },
    function submitFile2(submissionId, callback) {
      submitFileField(submissionId, fileFieldId, submission.formFields[1].fieldValues[1], callback);
    },
    completeSubmission,
    function getSubmission(submissionId, callback) {
      forms.getSubmission(options, {_id: submissionId}, function (err, submission){
        callback(err, submission);
      });
    },
    function extractGroupId(submission, callback) {
      assert.ok(submission, "Should have found a submission");
      var submissionId = submission._id;
      var groupId = submission.formFields[1].fieldValues[0].groupId;
      forms.getSubmissionFile(options, {'_id': groupId}, function(err, res) {
        logger.debug("getSubmissionFile", {err: err, groupId: groupId, res: res});
        callback(err, {submissionId: submissionId, groupId: groupId});
      });
    },
    function deleteSubmission(extractResult, callback) {
      forms.deleteSubmission(options, {_id: extractResult.submissionId}, function(err) {
        if(err){
          logger.error("Error deleting submission", {err: err});
        }
        callback(err, extractResult.groupId);
      });
    },
    function verifyFileRemoval(groupId, callback) {
      forms.getSubmissionFile(options, {'_id': groupId}, function(err) {
        assert.ok(err, "File with groupId " + groupId + " should have been deleted, hence err not found");
        callback(null);
      });
    }],
    function(err) {
      assert.ok(!err, "should not have returned error: " + util.inspect(err));
      finish();
    });
};

module.exports.test.testDeleteSubmissionSubmissionNotFound = function(finish) {
  var submission = baseSubmission();
  submission.formId = createdFormId;
  submission.formFields = [{
    "fieldId": textFieldId,
    "fieldValues": ["Some Text Value1", "Some Text Value2"]
  }];
  async.waterfall([
    async.apply(submitFormData, submission),
    completeSubmission,
    function deleteSubmission(submissionId, callback) {
      var missingObjectId = mongoose.Types.ObjectId();
      forms.deleteSubmission(options, {_id: missingObjectId}, function(err) {
        assert.ok(!err, "Deleting a non existing submission should not cause an error");
        callback(null);
      })
    }],
    function(err) {
      assert.ok(!err, "Should not have returned error: " + util.inspect(err));
      finish();
    });
};

module.exports.test.testDeleteSubmissionWithoutFileFields = function(finish) {
  var submission = baseSubmission();
  submission.formId = createdFormId;
  submission.formFields = [{
    "fieldId": textFieldId,
    "fieldValues": ["Some Text Value1", "Some Text Value2"]
  }];
  async.waterfall([
    async.apply(submitFormData, submission),
    completeSubmission,
    function getSubmission(submissionId, callback) {
      forms.getSubmission(options, {_id: submissionId}, function (err, submission){
        callback(err, submission);
      })
    },
    function deleteSubmission(submission, callback) {
      assert.ok(submission, "Should have found a submission");
      forms.deleteSubmission(options, {_id: submission._id}, function(err) {
        assert.ok(!err, "Should have deleted " + submission._id);
        callback(null);
      })
    }], function(err) {
      assert.ok(!err, "should not have returned error: " + util.inspect(err));
      finish();
    });
};
