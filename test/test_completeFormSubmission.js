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
var testFilePath = "./test/Fixtures/test.pdf";
var testPhotoPath = "./test/Fixtures/test.jpg";
var testSignaturePath = "./test/Fixtures/test.jpg";
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

module.exports.testCompleteSubmissionWorks = function(test, assert){
  submitDataAndTest(assert, "fileField", "test.pdf", testFilePath, {}, function(submissionId){
    //Form data submitted with all files, now complete the
    forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission": {"submissionId" : submissionId}}, function(err, result){
      if(err) console.log(err);
      assert.ok(!err);
      assert.ok(result);

      checkSubmissionComplete(assert, submissionId, function(){
        test.finish();
      });
    });
  });
}

module.exports.testCompleteSubmissionNoSubmissionId = function(test, assert){
  submitDataAndTest(assert, "fileField", "test.pdf", testFilePath, {}, function(submissionId){
    //Form data submitted with all files, now complete the
    forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission": {"submissionId" : undefined}}, function(err, result){
      assert.ok(err);
      assert.ok(!result);

      test.finish();
    });
  });
}

module.exports.testCompleteSubmissionWrongSubmissionId = function(test, assert){
  submitDataAndTest(assert, "fileField", "test.pdf", testFilePath, {}, function(submissionId){
    //Form data submitted with all files, now complete the
    forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission": {"submissionId" : "SOMEWRONGID"}}, function(err, result){
      assert.ok(err);
      assert.ok(!result);

      test.finish();
    });
  });
}

module.exports.testCompleteSubmissionFileNotUploaded = function(test, assert){
  submitDataAndTest(assert, "fileField", "test.pdf", testFilePath, {"skipOne": true}, function(submissionId){
    //Form data submitted with all files, now complete the
    forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission": {"submissionId" : "SOMEWRONGID"}}, function(err, result){
      assert.ok(err);
      assert.ok(!result);

      test.finish();
    });
  });
}


module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

function checkSubmissionComplete(assert, submissionId, cb){
  //Already checked the file -- Now check the
  var connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);

  models.init(connection);

  var FormSubmission = models.get(connection, models.MODELNAMES.FORM_SUBMISSION);

  FormSubmission.findOne({"_id" : submissionId}, function(err, foundForm){
    assert.ok(!err);
    assert.ok(foundForm);

    assert.eql(foundForm.status, "complete", "Expected submission to have status completed, but is " + foundForm.status);
    assert.isDefined(foundForm.submissionCompletedTimestamp);

    connection.close(function(err){
      if(err) console.log(err);
      return cb();
    });
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

function submitDataAndTest(assert, submissionType, fileName, filePath, options, cb){
  var submission = testSubmitFormBaseInfo;
  var filePlaceHolderEntries = ["filePlaceHolder123456", "filePlaceHolder123456789"];
  submission.formId = globalFormId;
  submission.formFields = [{"fieldId" : globalFieldIds[submissionType], "fieldValues" : filePlaceHolderEntries}];

  submitAndTest(assert, fileName, filePlaceHolderEntries, submissionType, submission, filePath, options, cb);
}

function submitAndTest(assert, fileName, placeholderTextArray, submissionType, submission, filePath, options, cb){
  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
    if(err) console.log(err);
    assert.ok(!err);
    assert.isDefined(dataSaveResult.submissionId);


    //Submission accepted and now have submissionId -- save the file
    if(options.skipOne === true){
      placeholderTextArray = placeholderTextArray.slice(0);//Removing one of the files so it is skipped
    }
    async.eachSeries(placeholderTextArray, function(placeholderText, cb){
      var testFileStream = fs.createReadStream(filePath);
      testFileStream.pause();
      var testFileSubmission = {"submissionId" : dataSaveResult.submissionId, "fileName": fileName, "fileId": placeholderText, "fieldId": globalFieldIds[submissionType], "fileStream" : testFileStream};
      forms.submitFormFile({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : testFileSubmission}, function(err, result){
        if(options.errorExpected === true){
          assert.ok(err);
          assert.ok(!result);
          return cb();
        } else {
          if(err) console.log(err);
          assert.ok(!err);
          assert.isDefined(result);
          assert.isDefined(result.savedFileGroupId);
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

          assert.eql(foundSubmittedFields.length, 1, "Expected single field with id " + globalFieldIds[submissionType] + " but got " + foundSubmittedFields.length);

          //Field entry found, find the file groupId in the submissions
          var foundFieldSubmission = foundSubmittedFields[0];

          var foundFileEntry = foundFieldSubmission.fieldValues.filter(function(fieldValue){
            return fieldValue.toString() === result.savedFileGroupId.toString();
          });

          assert.eql(foundFileEntry.length, 1, "Expected single field with fileGroupId " + result.fileGroupId + " but got " + foundFileEntry.length);
          //Finished with the connection, can close immediately.
          connection.close(function(err){
            if(err) console.log(err);
          });

          return cb();
        });
      });
    }, function(err){
      return cb(dataSaveResult.submissionId);
    });
  });
}