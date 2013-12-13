require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var fs = require('fs');
var assert = require('assert');

var testFilePath = "./test/Fixtures/test.pdf";
var testPhotoPath = "./test/Fixtures/test.jpg";
var testSignaturePath = "./test/Fixtures/test.jpg";
var testSubmissionId = undefined;


var globalFormId = undefined;
var globalFieldIds = undefined;

var testSubmitFormBaseInfo = {
  "appId": "appId123456",
  "appCloudName": "appCloudName123456",
  "timezoneOffset" : 120,
  "appEnvironment": "devLive",
  "userId": "user123456",
  "deviceId": "device123456",
  "deviceIPAddress": "192.168.1.1",
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
}

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
}

module.exports.testSubmitFormFileWorks = function(finish){
  submitDataAndTest(assert, "fileField", "test.pdf", testFilePath, {}, function(err){
    assert.ok(!err);

    finish();
  });
}


module.exports.testSubmitFormPhotoWorks = function(finish){
  submitDataAndTest(assert, "photoField", "test.jpg", testPhotoPath, {}, function(err){
    assert.ok(!err);

    finish();
  });
}

module.exports.testSubmitFormSignatureWorks = function(finish){
  submitDataAndTest(assert, "signatureField", "test.jpg", testSignaturePath, {}, function(err){
    assert.ok(!err);

    finish();
  });
}

module.exports.testSubmitFormFileNoParams = function(finish){
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : undefined}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileNoFieldId = function(finish){
  var testFileSubmission = {"submissionId" : testSubmissionId, "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileNoSubmissionId = function(finish){
  var testFileSubmission = { "fileId": "filePlaceHolder123456", "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileBadSubmissionId = function(finish){
  var testFileSubmission = {"submissionId" : "IAMNOTASUBMISSIONID", "fileId": "filePlaceHolder123456", "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}


module.exports.testSubmitFormFileNoFileId = function(finish){
  var testFileSubmission = {"submissionId" : testSubmissionId, "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileBadFileId = function(finish){
  var testFileSubmission = {"submissionId" : testSubmissionId, "fileId": "theWrongFileIdSomehow", "fieldId": globalFieldIds["fileField"], "fileStream" : testFilePath};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileFileNoFileStream = function(finish){
  var testFileSubmission = {"submissionId" : testSubmissionId, "fileId": "filePlaceHolder123456", "fieldId": globalFieldIds["fileField"]};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileFileBadFileStream = function(finish){
  var testFileSubmission = {"submissionId" : testSubmissionId, "fileId": "filePlaceHolder123456", "fieldId": globalFieldIds["fileField"], "fileStream" : "NOTASTREAM"};
  forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
    assert.ok(err);
    assert.ok(!result);

    finish();
  });
}

module.exports.testSubmitFormFileFileIdDoesNotExist = function(finish){
  var submission = testSubmitFormBaseInfo;
  var  file1Details = {
    "fileName" : "test",
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

  var filePlaceHolderEntries = [file1Details, file2Details];

  submission.formId = globalFormId;
  submission.formFields = [{"fieldId" : globalFieldIds["fileField"], "fieldValues" : filePlaceHolderEntries}];

  var  fileWrongDetails = {
    "fileName" : "test.pdf",
    "fileSize" : 123456,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder1234wrong4232"
  };

  submitAndTest(assert, "test.pdf", [fileWrongDetails], "fileField", submission, testFilePath, {"errorExpected": true}, function(){

    finish();
  });
}


module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

function createTestData(assert, cb){

  //Need to create a single form with a single field that is repeatable. --> File, photo, signature

  var connection = mongoose.createConnection(options.uri);

  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);

  var requiredForm = new Form({"updatedBy" : "user@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
  var testRequiredPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

  var testData = require("./../Fixtures/formSubmissions.js");

  var fileField = new Field(testData.fileFieldData);
  var photoField = new Field(testData.photoFieldData);
  var signatureField = new Field(testData.signatureFieldData);

  var fields = [];
  fields.push(fileField);
  fields.push(photoField);
  fields.push(signatureField);

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

function submitDataAndTest(assert, submissionType, fileName, filePath, options, cb){
  var submission = testSubmitFormBaseInfo;

  var  file1Details = {
    "fileName" : fileName,
    "fileSize" : 123456,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder123456"
  };

  var  file2Details = {
    "fileName" : fileName,
    "fileSize" : 123456,
    "fileType" : "application/pdf",
    "fileUpdateTime" : new Date().getTime(),
    "hashName" : "filePlaceHolder123456789"
  };



  var filePlaceHolderEntries = [file1Details, file2Details];
  submission.formId = globalFormId;
  submission.formFields = [{"fieldId" : globalFieldIds[submissionType], "fieldValues" : filePlaceHolderEntries}];

  submitAndTest(assert, fileName, filePlaceHolderEntries, submissionType, submission, filePath, options, cb);
}

function submitAndTest(assert, fileName, placeholderTextArray, submissionType, submission, filePath, options, cb){
  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(dataSaveResult.submissionId);

    testSubmissionId = dataSaveResult.submissionId;

    //Submission accepted and now have submissionId -- save the file

    async.eachSeries(placeholderTextArray, function(placeholderText, cb){
      var testFileSubmission = {"submissionId" : dataSaveResult.submissionId, "fileId": placeholderText.hashName, "fieldId": globalFieldIds[submissionType], "fileStream" : filePath, "keepFile" : true};
      forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
        if(options.errorExpected === true){
          assert.ok(err);
          assert.ok(!result);
          return cb();
        } else {
          if(err) console.log(err);
          assert.ok(!err);
          assert.ok(result);
          assert.ok(result.savedFileGroupId);
        }

        //File has been submitted, check the id of the file has been saved to the submission.
        var connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);

        models.init(connection);

        var FormSubmission = models.get(connection, models.MODELNAMES.FORM_SUBMISSION);

        FormSubmission.findOne({"_id" : dataSaveResult.submissionId}, function(err, foundSubmission){
          assert.ok(!err);
          assert.ok(foundSubmission);

          //Find the submission for this field
          var foundSubmittedFields = foundSubmission.formFields.filter(function(formField){
            return formField.fieldId.toString() === globalFieldIds[submissionType].toString();
          });

          assert.equal(foundSubmittedFields.length, 1, "Expected single field with id " + globalFieldIds[submissionType] + " but got " + foundSubmittedFields.length);

          //Field entry found, find the file groupId in the submissions
          var foundFieldSubmission = foundSubmittedFields[0];

          var foundFileEntry = foundFieldSubmission.fieldValues.filter(function(fieldValue){
            if(!fieldValue.groupId){
              return false;
            }
            return fieldValue.groupId.toString() === result.savedFileGroupId.toString();
          });

          assert.equal(foundFileEntry.length, 1, "Expected single field with fileGroupId " + result.fileGroupId + " but got " + foundFileEntry.length);
          //Finished with the connection, can close immediately.
          connection.close(function(err){
            if(err) console.log(err);
          });

          return cb();
        });
      });
    }, function(err){
      return cb();
    });
  });
}