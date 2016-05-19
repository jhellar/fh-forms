require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var util = require('util');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};


var TEST_TOTAL_NUM_SUBMISSIONS = 1;
var TEST_SUBMISSION_APPID = "thisisnowaprojectId123456";
var TEST_UNUSED_APPID = "ThisDidNotSubmit";
var TEST_SUBMISSION_FORMID; // will be populated by setup
var TEST_SUBMISSION_ID; // will be populated by setup
var TEST_UNUSED_FORMID = '123456789012345678901234';
var TEST_FIELD_NAME_PREFIX = "TestField";
var TEST_FIELD_VALUE_PREFIX = "TestFieldValue";

var globalFormId;
var globalFieldIds;
var submissionId;
var testFilePath = "./test/Fixtures/test.pdf";

var testSubmitFormBaseInfo = {
  "appId": TEST_SUBMISSION_APPID,
  "appClientId": "thisistheidpassedbytheclient",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
  "timezoneOffset" : 120,
  "userId": "user123456",
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

module.exports.testGetSubmission = function(finish){
// forms.getSubmission({"uri": mongoUrl}, {"_id" : req.params.submissionId, function(err, results){

  forms.getSubmission(options, {_id: TEST_SUBMISSION_ID}, function (err, results){
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    assert.ok(results);  // should have returned results
    assert.equal(results._id, TEST_SUBMISSION_ID, "Invalid id - actual: " + results._id + ", expected: " + TEST_SUBMISSION_ID);
    assert.equal(results.appId, TEST_SUBMISSION_APPID);
    assert.equal(results.formId, TEST_SUBMISSION_FORMID);
    finish();

  });
};

module.exports.testGetSubmissionsAndCheckFields = function(finish){
// forms.getSubmission({"uri": mongoUrl}, {"_id" : req.params.submissionId, function(err, results){

  forms.getSubmission(options, {_id: TEST_SUBMISSION_ID}, function (err, result){
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    assert.ok(result);  // should have returned results
    assert.equal(result._id, TEST_SUBMISSION_ID);
    assert.equal(result.appId, TEST_SUBMISSION_APPID);
    assert.equal(result.formId, TEST_SUBMISSION_FORMID);
    assert.ok(result.formFields.length > 3, "should be more than 3 fields returned in summary submissions list, actual: " + result.formFields.length);
    assert.ok(undefined !== result.formSubmittedAgainst,"formSubmittedAgainst should be populated");

    finish();
  });
};

module.exports.testGetInvalidSubmission = function(finish){
// forms.getSubmissions({"uri": mongoUrl}, {"appId" : req.params.appId, "formId": req.params.formId}, function(err, results){

  forms.getSubmission(options, {_id: TEST_UNUSED_FORMID}, function (err, results){
    assert.ok(err, "should have returned error: " + util.inspect(err));
    finish();
  });
};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err, 'error creating test data - err: ' + util.inspect(err));
      assert.ok(globalFormId, 'form has not been created during test setup');
      assert.notEqual(globalFormId, TEST_UNUSED_FORMID, "generated formid happens to match need to re-run");

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
        finish();
      });
    });
  });
};

module.exports.tearDown = function(finish){
  forms.deleteSubmission(options, {_id: TEST_SUBMISSION_ID}, function(err) {
    assert.ok(!err, "should not have returned error: " + util.inspect(err));
    forms.tearDownConnection(options, function(err) {
      assert.ok(!err);
      finish();
    });
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
    testFieldValue = TEST_FIELD_VALUE_PREFIX + i;
    testField = {"fieldId" : globalFieldIds[testFieldName], "fieldValues" : [testFieldValue]};
    submission.formFields.push(testField);
  }

  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    if(err) console.log(err);
    assert.ok(!err, "problem submitting test form data - err: " + util.inspect(err));
    assert.ok(dataSaveResult.submissionId, "problem submitting test form data - returned submissionId: " + util.inspect(dataSaveResult.submissionId));
    assert.ok(dataSaveResult.formSubmission, "Expected form submission return object but got nothing");
    assert.ok(dataSaveResult.formSubmission.appId, "Expected appId from result but got nothing: submitFormData: " + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appClientId, "Expected clientAppId from result but got nothing: submitFormData" + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appId === "thisisnowaprojectId123456", "Expected result appId to be thisisnowaprojectId123456 but was " + dataSaveResult.formSubmission.appId);
    assert.ok(dataSaveResult.formSubmission.appClientId === "thisistheidpassedbytheclient", "Expected result clientAppId to be thisistheidpassedbytheclient but was " + dataSaveResult.formSubmission.clientAppId);
    submissionId = dataSaveResult.submissionId;
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
    }, function(err){
     cb();
    });
  });
}

function completeSubmission(assert, cb){

  forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"submissionId" : submissionId}}, function(err, result){
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

  var requiredForm = new Form({"updatedBy" : "user@example.com", "createdBy":"test@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
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
    assert.ok(!err, 'error saving form - err: ' + util.inspect(err));
    assert.ok(formId, 'should have a form id');
    assert.ok(fieldIds, 'should have field ids');

    globalFormId = formId;
    TEST_SUBMISSION_FORMID = formId.toString();
    globalFieldIds = fieldIds;

    connection.close(cb);
  });

  function saveSingleForm(fields, testPage, testFieldsForm, cb){
    var globalFormId;
    var fieldIds = {};
    async.series([saveFields, savePage, saveForm], function(err){
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
