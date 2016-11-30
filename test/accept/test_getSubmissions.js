require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var async = require("async");
var assert = require('assert');
var util = require('util');
var _ = require('underscore');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};


var TEST_TOTAL_NUM_SUBMISSIONS = 5;
var TEST_SUBMISSION_APPID = "thisisnowaprojectId123456";
var TEST_UNUSED_APPID = "ThisDidNotSubmit";
var TEST_APP_NAME = 'Joe';
var TEST_APP_MAP = {"result":[
  {guid: TEST_SUBMISSION_APPID, title: TEST_APP_NAME}
]
};


var TEST_SUBMISSION_FORMID; // will be populated by setup
var TEST_SUBMISSION_ID; // will be populated by setup
var TEST_UNUSED_FORMID = '123456789012345678901234';
var TEST_FIELD_NAME_PREFIX = "TestField";
var TEST_FIELD_VALUE_PREFIX = "TestFieldValue";
var TEST_FORM_NAME = "testFieldsForm";


var globalFormId;
var globalFieldIds;
var submissionId;
var testFilePath = "./test/Fixtures/test.pdf";

var testSubmitFormBaseInfo = {
  "appId": TEST_SUBMISSION_APPID,
  "appClientId": "thisistheidpassedbytheclient",
  "appCloudName": "appCloudName123456",
  "timezoneOffset" : 120,
  "appEnvironment": "devLive",
  "deviceId": "device123456",
  "deviceIPAddress": "192.168.1.1",
  "deviceFormTimestamp": new Date(Date.now()),
  "comments": [{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()),
    "value": "This is a comment"
  },{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()),
    "value": "This is another comment"
  }]
};



module.exports.testGetAllSubmissions = function(finish){

  forms.getSubmissions(options, {}, function (err, results){
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
    assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID, "Invalid id - actual: " + submissions[0]._id + ", expected: " + TEST_SUBMISSION_ID);
    assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
    assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
    assert.strictEqual(submissions[0].formName, TEST_FORM_NAME);
    finish();
  });
};

module.exports.testGetAllSubmissionsWithAppMap = function(finish){

  forms.getSubmissions(options, {appMap: TEST_APP_MAP}, function (err, results){
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
    assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID, "Invalid id - actual: " + submissions[0]._id + ", expected: " + TEST_SUBMISSION_ID);
    assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
    assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
    assert.strictEqual(submissions[0].formName, TEST_FORM_NAME);
    finish();
  });
};



module.exports.testGetAllSubmissionsByApp = function(finish){

  forms.getSubmissions(options, {appId: TEST_SUBMISSION_APPID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
    assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID);
    assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
    assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
    finish();
  });
};

module.exports.testGetAllSubmissionsByForm = function(finish){

  forms.getSubmissions(options, {formId: TEST_SUBMISSION_FORMID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
    assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID);
    assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
    assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
    finish();
  });
};

module.exports.testGetAllSubmissionsByFormObject = function(finish){

  forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : TEST_SUBMISSION_FORMID}, function(err, result){
    assert.ok(!err, "Unexpected Error When Getting A Form: ", err);

    forms.getSubmissions(options, {formId: [result]}, function (err, results){
      assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
      assert.ok(results);  // should have returned results
      var submissions = results.submissions;
      assert.ok(submissions);  // should have returned submissions in results
      assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
      assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID);
      assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
      assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
      finish();
    });
  });
};

module.exports.testGetAllSubmissionsByFormAndCheckFields = function(finish){

  forms.getSubmissions(options, {formId: TEST_SUBMISSION_FORMID}, function (err, results){
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, TEST_TOTAL_NUM_SUBMISSIONS);
    assert.strictEqual(submissions[0]._id, TEST_SUBMISSION_ID);
    assert.strictEqual(submissions[0].appId, TEST_SUBMISSION_APPID);
    assert.strictEqual(submissions[0].formId, TEST_SUBMISSION_FORMID);
    assert.strictEqual(submissions[0].formFields.length, 3, "should be 3 fields returned in summary submissions list, actual: " + submissions[0].formFields.length);

    assert.ok(submissions[0].formFields[0].fieldId.name.indexOf(TEST_FIELD_NAME_PREFIX) === 0,
              "incorrect field in summary field list, expected to start with: " + TEST_FIELD_NAME_PREFIX +
              ", but actual name was: " + submissions[0].formFields[0].fieldId.name);

    assert.ok(Array.isArray(submissions[0].formFields[0].fieldValues), "expected an array of values but actual was: " + util.inspect(submissions[0].formFields[0].fieldValues));
    assert.ok(submissions[0].formFields[0].fieldValues[0].indexOf(TEST_FIELD_VALUE_PREFIX) === 0,
              "incorrect field value in summary field list, expected to start with: " + TEST_FIELD_VALUE_PREFIX +
              ", but actual name was: " + submissions[0].formFields[0].fieldValues[0]);

    assert.ok(submissions[0].formFields[1].fieldId.name.indexOf(TEST_FIELD_NAME_PREFIX) === 0,
              "incorrect field in summary field list, expected to start with: " + TEST_FIELD_NAME_PREFIX +
              ", but actual name was: " + submissions[0].formFields[1].fieldId.name);

    assert.ok(Array.isArray(submissions[0].formFields[1].fieldValues), "expected an array of values but actual was: " + util.inspect(submissions[0].formFields[0].fieldValues));
    assert.ok(submissions[0].formFields[1].fieldValues[0].indexOf(TEST_FIELD_VALUE_PREFIX) === 0,
              "incorrect field value in summary field list, expected to start with: " + TEST_FIELD_VALUE_PREFIX +
              ", but actual name was: " + submissions[0].formFields[1].fieldValues[0]);

    assert.ok(submissions[0].formFields[2].fieldId.name.indexOf(TEST_FIELD_NAME_PREFIX) === 0,
              "incorrect field in summary field list, expected to start with: " + TEST_FIELD_NAME_PREFIX +
              ", but actual name was: " + submissions[0].formFields[2].fieldId.name);

    assert.ok(Array.isArray(submissions[0].formFields[2].fieldValues), "expected an array of values but actual was: " + util.inspect(submissions[0].formFields[0].fieldValues));
    assert.ok(submissions[0].formFields[2].fieldValues[0].indexOf(TEST_FIELD_VALUE_PREFIX) === 0,
              "incorrect field value in summary field list, expected to start with: " + TEST_FIELD_VALUE_PREFIX +
              ", but actual name was: " + submissions[0].formFields[2].fieldValues[0]);

    finish();
  });
};

module.exports.testGetAllSubmissionsForNonExistantForm = function(finish){

  forms.getSubmissions(options, {formId: TEST_UNUSED_FORMID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, 0);  // should be empty list returned
    finish();
  });
};

module.exports.testGetAllSubmissionsForNonExistantApp = function(finish){

  forms.getSubmissions(options, {appId: TEST_UNUSED_APPID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, 0); // should be empty list returned
    finish();
  });
};

module.exports.testGetAllSubmissionsForNonExistantFormAndApp = function(finish){

  forms.getSubmissions(options, {formId: TEST_UNUSED_FORMID, appId: TEST_UNUSED_APPID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, 0);  // should be empty list returned
    finish();
  });
};

module.exports.testGetAllSubmissionsForNonExistantFormAndGoodAppId = function(finish){

  forms.getSubmissions(options, {formId: TEST_UNUSED_FORMID, appId: TEST_SUBMISSION_APPID}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, 0);  // should be empty list returned
    finish();
  });
};

module.exports.testGetSubmissionsArraySubids = function(finish){

  forms.getSubmissions(options, {subid: [TEST_SUBMISSION_ID]}, function (err, results){
    assert.ok(!err); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions);  // should have returned submissions in results
    assert.strictEqual(submissions.length, 1); // should be empty list returned
    finish();
  });
};

//Testing that when a getSubmissions call is made, that the reduced payload is returned from the database.
module.exports.testGetSubmissionsSmallPayload = function(finish){
  forms.getSubmissions(options, {subid: [TEST_SUBMISSION_ID]}, function (err, results){
    assert.ok(!err, "Expected No Error"); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results, "Expected a result");  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions, "Expected A Submissions Result");  // should have returned submissions in results
    assert.strictEqual(submissions.length, 1); // should be a single submission returned

    //The submission Should Not Have Any Pages Set
    assert.ok(!submissions[0].formSubmittedAgainst.pages);

    finish();
  });
};

//Testing that when a getSubmissions call is made with the includeFullSubmission, that the full submission json response is returned from the database.
module.exports.testGetSubmissionsIncludeFullSubmission = function(finish){
  var getSubmissionsOptions = _.extend({
    includeFullSubmission: true
  }, options);
  forms.getSubmissions(getSubmissionsOptions, {subid: [TEST_SUBMISSION_ID]}, function (err, results){
    assert.ok(!err, "Expected No Error"); //, "should not have returned error: " + util.inspect(err));
    assert.ok(results, "Expected a result");  // should have returned results
    var submissions = results.submissions;
    assert.ok(submissions, "Expected A Submissions Result");  // should have returned submissions in results
    assert.strictEqual(submissions.length, 1); // should be a single submission returned

    //The submission Should Have Pages Set.
    assert.ok(submissions[0].formSubmittedAgainst.pages);

    finish();
  });
};

module.exports.testGetSubmissionsPagination = function(finish){
  function _getAndCheckSubmissionPages(page, limit, expectedCount, expectedPages, expectedTotal, cb){
    forms.getSubmissions(options, {paginate: {
      page: page,
      limit: limit
    }}, function (err, result){
      assert.equal(undefined, err);

      assert.equal(expectedCount, result.submissions.length);
      //No form data should be returned as part of the list.
      if (expectedCount > 0) {
        assert.equal(undefined, result.submissions[0].formSubmittedAgainst.pages);
        assert.equal(undefined, result.submissions[0].formSubmittedAgainst.pageRules);
        assert.equal(undefined, result.submissions[0].formSubmittedAgainst.fieldRules);
      }
      assert.equal(expectedPages, result.pages);
      assert.equal(expectedTotal, result.total);
      cb();
    });
  }

  async.series([
    function checkFirstPage(cb){
      //Getting the first page with a limit of 3 entries per page.
      //First page should have 3 submissions
      _getAndCheckSubmissionPages(1, 3, 3, 2, 5, cb);
    },
    function checkSecondPage(cb){
      //Second page should only have 2 submissions
      _getAndCheckSubmissionPages(2, 3, 2, 2, 5, cb);
    },
    function checkThirdPage(cb){
      //Third page should have no submissions
      _getAndCheckSubmissionPages(3, 3, 0, 2, 5, cb);
    }
  ], finish);
};


/**
 * submitFullSubmission - Performing all of the steps required to make a full submission with 2 files.
 *
 * @param  {function} cb
 */
function submitFullSubmission(cb){
  var  file1Details = {
    "fileName" : "test.pdf",
    "fileSize" : 123456,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder123456"
  };

  var  file2Details = {
    "fileName" : "test.pdf",
    "fileSize" : 123456,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder123456789"
  };

  async.series([
    async.apply(submitData, assert, [file1Details, file2Details]),
    async.apply(submitFile, assert, "filePlaceHolder123456", testFilePath),
    async.apply(submitFile, assert, "filePlaceHolder123456789", testFilePath),
    async.apply(completeSubmission, assert),
    async.apply(checkPending, assert, "complete", [])
  ], function(err){
    assert.ok(!err, 'error in setUp - err: ' + util.inspect(err));
    cb();
  });
}

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      assert.ok(globalFormId, 'form has not been created during test setup');
      assert.notEqual(globalFormId, TEST_UNUSED_FORMID, "generated formid happens to match need to re-run");

      async.timesSeries(TEST_TOTAL_NUM_SUBMISSIONS, function(index, cb){
        submitFullSubmission(cb);
      }, function(err){
        assert.ok(!err, 'error in setUp - err: ' + util.inspect(err));
        finish();
      });
    });
  });
};

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

function submitData(assert, filesToSubmit, cb){
  var submission = testSubmitFormBaseInfo;
  var filePlaceHolderEntries = filesToSubmit;
  submission.formId = globalFormId;
  submission.formFields = [{"fieldId" : globalFieldIds["fileField"], "fieldValues" : filePlaceHolderEntries}];

  var testField;
  var testFieldName;
  for(var i = 0; i < 6; i += 1) {

    testFieldName = TEST_FIELD_NAME_PREFIX + i;
    var testFieldValue = TEST_FIELD_VALUE_PREFIX + i;
    testField = {"fieldId" : globalFieldIds[testFieldName], "fieldValues" : [testFieldValue]};
    submission.formFields.push(testField);
  }

  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    if(err) console.log(err);
    assert.ok(!err, "problem submitting test form data - err: " + util.inspect(err));
    assert.ok(dataSaveResult.submissionId, "problem submitting test form data - returned submissionId: " + util.inspect(dataSaveResult.submissionId));
    submissionId = dataSaveResult.submissionId;
    assert.ok(dataSaveResult.formSubmission, "Expected form submission return object but got nothing");
    assert.ok(dataSaveResult.formSubmission.appId, "Expected appId from result but got nothing: submitFormData: " + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appClientId, "Expected clientAppId from result but got nothing: submitFormData" + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appId === "thisisnowaprojectId123456", "Expected result appId to be thisisnowaprojectId123456 but was " + dataSaveResult.formSubmission.appId);
    assert.ok(dataSaveResult.formSubmission.appClientId === "thisistheidpassedbytheclient", "Expected result clientAppId to be thisistheidpassedbytheclient but was " + dataSaveResult.formSubmission.clientAppId);

    TEST_SUBMISSION_ID = submissionId.toString();
    cb();
  });
}

function submitFile(assert, placeholderText, filePath, cb){

  var testFileSubmission = {"submissionId" : submissionId, "fileId": placeholderText, "fieldId": globalFieldIds["fileField"], "fileStream" : filePath, "keepFile": true};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result.savedFileGroupId);

    cb();
  });
}

function checkPending(assert, expectedStatus, expectedPendingFiles, cb){

  forms.getSubmissionStatus({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"submissionId" : submissionId}}, function(err, result){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(result);

    assert.equal(expectedStatus, result.status, "Expected a submission status of " + expectedStatus + " but got " + result.status);
    assert.equal(expectedPendingFiles.length, result.pendingFiles.length, "Expected pending files array of size " + expectedPendingFiles.length + " but got " + result.pendingFiles.length);

    //Check the array contains the resulting array.
    async.eachSeries(expectedPendingFiles, function(expectedFile){
      assert.ok(result.pendingFiles.indexOf(expectedFile) > -1);
      cb();
    }, function(){
     cb();
    });
  });
}

function completeSubmission(assert, cb){

  forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"submissionId" : submissionId}}, function(err){
    if(err) return cb(err);
    assert.ok(!err);

    cb();
  });
}

function createTestData(assert, cb){

  //Need to create a single form with a single field that is repeatable. --> File, photo, signature

  var connection = mongoose.createConnection(options.uri);

  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);

  var requiredForm = new Form({"updatedBy" : "user@example.com", "createdBy":"test@example.com", "name" : TEST_FORM_NAME, "description": "This form is for testing fields."});
  var testRequiredPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

  var testData = require("./../Fixtures/formSubmissions.js");

  var fileField = new Field(testData.fileFieldData);
  var photoField = new Field(testData.photoFieldData);
  var signatureField = new Field(testData.signatureFieldData);

  var textFieldOrig = testData.textFieldData;

  var fields = [];
  fields.push(fileField);
  fields.push(photoField);
  fields.push(signatureField);

  var testField;
  for(var i = 0; i < 6; i += 1) {
    testField = JSON.parse(JSON.stringify(textFieldOrig));
    testField.name = TEST_FIELD_NAME_PREFIX + i;
    testField.repeating = false;  // fixtures file specifies a repeating field, should add a non repeating field
    delete testField.fieldOptions.definition;
    fields.push(new Field(testField));
  }

  saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
    assert.ok(!err);
    assert.ok(formId);
    assert.ok(fieldIds);

    globalFormId = formId;
    TEST_SUBMISSION_FORMID = formId.toString();
    globalFieldIds = fieldIds;

    connection.close(function(err){
      if(err) console.log(err);
      cb();
    });
  });

  function saveSingleForm(fields, testPage, testFieldsForm, cb){
    var globalFormId;
    var fieldIds = {};
    async.series([saveFields, savePage, saveForm], function(err){
      if(err) console.log(err);
      cb(err, globalFormId, fieldIds);
    });

    function saveForm(cb){
      testFieldsForm.pages.push(testPage);
      testFieldsForm.save(function(err){
        if(err) console.log(err);
        assert.ok(!err);

        assert.ok(testFieldsForm._id);
        globalFormId = testFieldsForm._id;

        cb(err);
      });
    }

    function savePage(cb){
      async.eachSeries(fields, function(field, cb){
        testPage.fields.push(field);
        cb();
      }, function(err){
        if(err) console.log(err);
        assert.ok(!err);
        testPage.save(cb);
      });
    }

    function saveFields(cb){
      async.eachSeries(fields, function(field, cb){
        field.save(function(err){
          if(err) console.log(err);
          assert.ok(!err);

          assert.ok(field._id);

          fieldIds[field.name] = field._id;

          cb(err);
        });
      }, function(err){
        if(err) console.log(err);
        assert.ok(!err);

        cb(err, globalFormId, fieldIds);
      });
    }
  }
}
