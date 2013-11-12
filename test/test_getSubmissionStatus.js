require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./setup.js').initDatabase;
var fs = require('fs');
var async = require("async");

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

var globalFormId = undefined;
var globalFieldIds = undefined;
var submissionId = undefined;
var testFilePath = "./test/Fixtures/test.pdf";


var testSubmitFormBaseInfo = {
  "appId": "appId123456",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
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

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      test.finish();
    });
  });
}

module.exports.testGetSubmissionStatusWorks = function(test, assert){

  async.series([
    async.apply(submitData, assert, ["filePlaceHolder123456", "filePlaceHolder123456789"]),
    async.apply(checkPending, assert, "pending", ["filePlaceHolder123456", "filePlaceHolder123456789"]),
    async.apply(submitFile, assert, "filePlaceHolder123456", testFilePath, "test.pdf"),
    async.apply(checkPending, assert, "pending", ["filePlaceHolder123456789"]),
    async.apply(submitFile, assert, "filePlaceHolder123456789", testFilePath, "test.pdf"),
    async.apply(checkPending, assert, "pending", []),
    async.apply(completeSubmission, assert),
    async.apply(checkPending, assert, "complete", [])
  ], function(err){
    test.finish();
  });
}


module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

function submitData(assert, filesToSubmit, cb){
  var submission = testSubmitFormBaseInfo;
  var filePlaceHolderEntries = filesToSubmit;
  submission.formId = globalFormId;
  submission.formFields = [{"fieldId" : globalFieldIds["fileField"], "fieldValues" : filePlaceHolderEntries}];

  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    if(err) console.log(err);
    assert.ok(!err);
    assert.isDefined(dataSaveResult.submissionId);
    submissionId = dataSaveResult.submissionId;
    cb();
  });
}

function submitFile(assert, placeholderText, filePath, fileName, cb){
  var testFileSubmission = {"submissionId" : submissionId, "fileName": fileName, "fileId": placeholderText, "fieldId": globalFieldIds["fileField"], "fileStream" : filePath, "keepFile": true};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    if(err) console.log(err);
    assert.ok(!err);
    assert.isDefined(result);
    assert.isDefined(result.savedFileGroupId);

    cb();
  });
}

function checkPending(assert, expectedStatus, expectedPendingFiles, cb){

  forms.getSubmissionStatus({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"submissionId" : submissionId}}, function(err, result){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(result);

    assert.eql(expectedStatus, result.status, "Expected a submission status of " + expectedStatus + " but got " + result.status);
    assert.eql(expectedPendingFiles.length, result.pendingFiles.length, "Expected pending files array of size " + expectedPendingFiles.length + " but got " + result.pendingFiles.length);

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

  var requiredForm = new Form({"updatedBy" : "user@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
  var testRequiredPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

  var testData = require("./Fixtures/formSubmissions.js");

  var fileField = new Field(testData.fileFieldData);
  var photoField = new Field(testData.photoFieldData);
  var signatureField = new Field(testData.signatureFieldData);

  var fields = [];
  fields.push(fileField);
  fields.push(photoField);
  fields.push(signatureField);

  saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
    assert.ok(!err);
    assert.isDefined(formId);
    assert.isDefined(fieldIds);

    globalFormId = formId;
    globalFieldIds = fieldIds;

    connection.close(function(err){
      if(err) console.log(err);
      cb();
    });
  });

  function saveSingleForm(fields, testPage, testFieldsForm, cb){
    var globalFormId = undefined;
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

        assert.isDefined(testFieldsForm._id);
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

          assert.isDefined(field._id);

          fieldIds[field.name] = field._id;

          cb(err);
        });
      }, function(err){
        if(err) console.log(err);
        assert.ok(!err);

        cb(err, globalFormId, fieldIds);
      });
    }
  };
}