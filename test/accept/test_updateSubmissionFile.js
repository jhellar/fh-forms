require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var fs = require('fs');
var assert = require('assert');
var util = require('util');

var testFilePath = "./test/Fixtures/test.pdf";
var testPhotoPath = "./test/Fixtures/test.jpg";
var testSignaturePath = "./test/Fixtures/test.jpg";
var testSubmissionId = undefined;
var globalFormId = undefined;
var globalFieldIds = undefined;

var testSubmitFormBaseInfo = {
  "appId": "thisisnowaprojectId123456",
  "appClientId": "thisistheidpassedbytheclient",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
  "userId": "user123456",
  "deviceId": "device123456",
  "deviceIPAddress": "192.168.1.1",
  "timezoneOffset" : 120,
  "deviceFormTimestamp": new Date().getTime(),
  "comments": [{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date().getTime(),
    "value": "This is a comment"
  },{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date().getTime(),
    "value": "This is another comment"
  }]
};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
}



module.exports.testUpdateSubmissionFile = function(finish){

  var submission = testSubmitFormBaseInfo;
  submission.formId = globalFormId;

  //Upload file
  //CompleteSubmission
  //UpdateSubmission File

  //previous file should be deleted -- new file should be saved.
  var file2Details = {
    "fileName" : "test.jpg",
    "fileSize" : 1000,
    "fileType" : "image/jpeg",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder124124"
  };

  var file1Details = {
    "fileName" : "test.pdf",
    "fileSize" : 1000,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder124125"
  };

  var testValues = [{
    "fieldId" : globalFieldIds["fileField"],
    "fieldValues": [file1Details, file2Details]
  }];

  submission.formFields = testValues;

  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    assert.ok(!err);
    assert.ok(dataSaveResult);
    assert.ok(dataSaveResult.submissionId, "Expected submissionId from result but got nothing: submitFormData");
    assert.ok(dataSaveResult.formSubmission, "Expected form submission return object but got nothing");
    assert.ok(dataSaveResult.formSubmission.appId, "Expected appId from result but got nothing: submitFormData: " + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appClientId, "Expected clientAppId from result but got nothing: submitFormData" + util.inspect(dataSaveResult));
    assert.ok(dataSaveResult.formSubmission.appId === "thisisnowaprojectId123456", "Expected result appId to be thisisnowaprojectId123456 but was " + dataSaveResult.formSubmission.appId);
    assert.ok(dataSaveResult.formSubmission.appClientId === "thisistheidpassedbytheclient", "Expected result clientAppId to be thisistheidpassedbytheclient but was " + dataSaveResult.formSubmission.clientAppId);

    var testFileSubmissionGroupId;
    var testFileSubmission2GroupId;

    var testFileSubmission = {"submissionId" : dataSaveResult.submissionId, "fileId": "filePlaceHolder124124", "fieldId": globalFieldIds["fileField"], "fileStream" : testPhotoPath, "keepFile" : true};

    forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
      assert.ok(!err);
      assert.ok(result);
      assert.ok(result.status === 200);
      assert.ok(result.savedFileGroupId);

      testFileSubmissionGroupId = result.savedFileGroupId;

      var testFileSubmission2 = {"submissionId" : dataSaveResult.submissionId, "fileId": "filePlaceHolder124125", "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath, "keepFile" : true};
      forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission2}, function(err, result){
        assert.ok(!err);
        assert.ok(result);
        assert.ok(result.status === 200);
        assert.ok(result.savedFileGroupId);

        testFileSubmission2GroupId = result.savedFileGroupId;

        forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission": {"submissionId" : dataSaveResult.submissionId}}, function(err, result){
          assert.ok(!err);
          assert.ok(result);
          assert.ok(result.status === "complete");

          //Submission complete
          //Now update a single file with another file
          var fileUpdateDetails = {
            "fileName" : "test2.pdf",
            "fileType" : "application/pdf",
            "hashName" : "filePlaceHolder124124"
          };
          forms.updateSubmissionFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"keepFile" : true, "submissionId": dataSaveResult.submissionId, "fieldId" : globalFieldIds["fileField"] ,"fileGroupId" : testFileSubmissionGroupId, "fileStream" : testSignaturePath, "fileDetails" : fileUpdateDetails}}, function(err, result){
            if(err) console.log(err);
            assert.ok(!err);
            assert.ok(result);

            //Verify that the submission now contains the updated file.

            verifyUpdatedFile("test2.pdf", "application/pdf",testFileSubmissionGroupId,  "filePlaceHolder124124", dataSaveResult.submissionId, function(err){
              assert.ok(!err);

              finish();
            });
          });
        });
      });
    });
  });
}

function verifyUpdatedFile(fileName, fileType, fileGroupId, placeholderId, submissionId, cb){

  var connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);

  models.init(connection);

  var Submissions = models.get(connection, models.MODELNAMES.FORM_SUBMISSION);

  Submissions.findOne({"_id" : submissionId}, function(err, foundSubmission){
    assert.ok(!err);

    var filteredFileEntries = foundSubmission.formFields[0].fieldValues.filter(function(fileEntry){
      return fileEntry.hashName.toString() === placeholderId.toString();
    });

    assert.ok(filteredFileEntries.length === 1);

    var fileEntry = filteredFileEntries[0];

    assert.ok(fileEntry.fileName === fileName); //File details have changed, file updated sucessfully.
    assert.ok(fileEntry.fileType === fileType);
    assert.ok(fileEntry.groupId.toString() === fileGroupId.toString());

    connection.close(function(err){
      if(err) console.log(err);
      cb();
    });
  });
}


module.exports.tearDown = function(finish){
  forms.tearDownConnection(process.env.FH_DOMAIN_DB_CONN_URL, function(err) {
    assert.ok(!err);
    finish();
  });
};

function createTestData(assert, cb){

  //Need to create a single form with a single field that is repeatable. --> File, photo, signature

  var connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);

  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);

  var requiredForm = new Form({"updatedBy" : "user@example.com","createdBy" : "user@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
  var testRequiredPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

  var testData = require("./../Fixtures/formSubmissions.js");

  var fileField = new Field(testData.fileFieldData);

  var fields = [];
  fields.push(fileField);

  saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
    assert.ok(!err);
    assert.ok(formId);
    assert.ok(fieldIds);

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
  };
}
