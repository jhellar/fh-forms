var async = require('async');
var util = require('util');
var assert = require('assert');

var formsRulesEngine = require('../../lib/common/forms-rule-engine.js');

var exampleFields = require('../Fixtures/formSubmissions.js');

var testSubmitFormBaseInfo = {
  "appId": "appId123456",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
  "userId": "user123456",
  "deviceId": "device123456",
  "deviceIPAddress": "192.168.1.1",
  "deviceFormTimestamp": new Date(Date.now()).toUTCString(),
  "comments": [{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()).toUTCString(),
    "value": "This is a comment"
  },{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()).toUTCString(),
    "value": "This is another comment"
  }]
};

function fieldValidator(fieldDef, submission) {
  var retVal;
  var engine = formsRulesEngine({"submission" : null, "definition" : null});
  engine.validateFieldInternal(submission, fieldDef, function (err, results) {
    if(err) {
      retVal = err;
    } else {
      if (results.fieldErrorMessage && results.fieldErrorMessage.length > 0) {
        retVal = new Error(results.fieldErrorMessage[0]);
      } else {
        for(var i=0; i < results.errorMessages.length; i += 1) {
          if(results.errorMessages[i]) {
            retVal = new Error(results.errorMessages[i]);
            break;
          }
        }
      }
    }
  });

  return {
    validate: function(cb) {
      return cb(retVal);
    }
  };
}

exports.testValidateTooFewSubmissions = function(finish){

  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateTooManySubmissions = function(finish){

  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "test2", "test3", "test4", "test5", "test6"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));
    finish();
  });
}




exports.testValidateTextField = function(finish){
  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "test2", "test3"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateTextFieldNotText = function(finish){
  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", 2, {"something" : "else"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateTextFieldTooShort = function(finish){
  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "sd", "as"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateTextFieldTooLong = function(finish){
  var testField = exampleFields.textFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "ttttttoooooonnnnnggggg", "test1"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}






exports.testValidateTextArea = function(finish){
  var testField = exampleFields.textAreaFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "test2", "test3"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateTextAreaNotText = function(finish){
  var testField = exampleFields.textAreaFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", 2, {}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateTextAreaTooShort = function(finish){
  var testField = exampleFields.textAreaFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "sd", "as"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateTextAreaTooLong = function(finish){
  var testField = exampleFields.textAreaFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test1", "ttttttoooooonnnnnggggg", "test1"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}






exports.testValidateNumber = function(finish){
  var testField = exampleFields.numberFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [11, 22, 56];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateNumberNotNumber = function(finish){
  var testField = exampleFields.numberFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [11, "NotANumber", 56];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateNumberTooBig = function(finish){
  var testField = exampleFields.numberFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [1112, 22, 56];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateNumberTooSmall = function(finish){
  var testField = exampleFields.numberFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [11, 22, 4];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}





exports.testValidateEmailAddress = function(finish){
  var testField = exampleFields.emailAddressFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test@example.com", "test2@example.com", "test3@feedhenry.com"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateEmailAddressNotString = function(finish){
  var testField = exampleFields.emailAddressFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test@example.com", {"email" : "test2@example.com"}, "test3@feedhenry.com"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateEmailAddressInvalidEmail = function(finish){
  var testField = exampleFields.emailAddressFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["test@example.com", "test2example.com", "test3@feedhenry.com"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidateDropdown = function(finish){
  var testField = exampleFields.dropdownFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["dropdownVal1", "dropdownVal2", "dropdownVal3"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateDropdownNotAString = function(finish){
  var testField = exampleFields.dropdownFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["dropdownVal1", {"dropVal" : "dropdownVal2"}, "dropdownVal3"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateDropdownDoesNotExist = function(finish){
  var testField = exampleFields.dropdownFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["dropdownVal1", "dropdownVal22", "dropdownVal3"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateRadio = function(finish){
  var testField = exampleFields.radioFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["radio1", "radio2"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateRadioDoesNotExist = function(finish){
  var testField = exampleFields.radioFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["radio1", "radio22"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}





exports.testValidateCheckbox = function(finish){
  var testField = exampleFields.checkboxFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"selections" : ["red", "blue", "green"]}, {"selections" : ["red", "blue", "purple"]}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

// exports.testValidateCheckboxDoesNotExist = function(finish){
//   var testField = exampleFields.checkboxFieldData;
//   var testSubmission = testSubmitFormBaseInfo;
//   var testSubmissionData = [{"selections" : ["red", "wrongOption", "green"]}, {"selections" : ["red", "blue", "purple"]}];

//   testSubmission.fieldValues = testSubmissionData;

//   var validator = fieldValidator(testField, testSubmission);

//   validator.validate(function(err){
//     assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

//     finish();
//   });
// }

exports.testValidateCheckboxDoesTooMany = function(finish){
  var testField = exampleFields.checkboxFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"selections" : ["red", "blue", "green", "purple"]}, {"selections" : ["red", "blue", "purple"]}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateCheckboxDoesTooFew = function(finish){
  var testField = exampleFields.checkboxFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"selections" : ["red", "blue"]}, {"selections" : ["red"]}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidateLocationLatLong = function(finish){
  var testField = exampleFields.locationLatLongFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"lat" : "5.555848", "long" : "-52.031250"}, {"lat" : "1.552348", "long" : "-13.031430"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateLocationLatLongWrongIndices = function(finish){
  var testField = exampleFields.locationLatLongFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"key" : "5.555848", "val" : "-52.031250"}, {"key" : "1.552348", "val" : "-13.031430"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateLocationLatLongWrongValues = function(finish){
  var testField = exampleFields.locationLatLongFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"lat" : "5.555848", "long" : "-52.031250"}, {"lat" : "fas48", "long" : "-13.031430"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidateLocationNorthEast = function(finish){
  var testField = exampleFields.locationNorthEastFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"zone" : "11U", "eastings" : "594934", "northings" : "5636174"}, {"zone" : "12U", "eastings" : "594934", "northings" : "5636174"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateLocationNorthEastWrongValues = function(finish){
  var testField = exampleFields.locationNorthEastFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"zone" : "11U", "eastings" : "3455", "northings" : "5636174"}, {"zone" : "12U", "eastings" : "594934", "northings" : "5636174"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateLocationNorthEastWrongKeys = function(finish){
  var testField = exampleFields.locationNorthEastFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [{"zones" : "11U", "eastings" : "594934", "northings" : "5636174"}, {"zones" : "12U", "eastings" : "594934", "northings" : "5636174"}];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidatePhoto = function(finish){
  var testField = exampleFields.photoFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlaceHolder1234567", "filePlaceHolder12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}


exports.testValidatePhotoWrongPlaceholder = function(finish){
  var testField = exampleFields.photoFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlHolder1234567", "filePlaceHolder12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}



exports.testValidateFile = function(finish){
  var testField = exampleFields.fileFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlaceHolder1234567", "filePlaceHolder12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateFileWrongPlaceholder = function(finish){
  var testField = exampleFields.fileFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlaceHolder1234567", "filePlacasfder12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidateSignature = function(finish){
  var testField = exampleFields.signatureFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlaceHolder1234567", "filePlaceHolder12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateSignatureWrongPlaceholder = function(finish){
  var testField = exampleFields.signatureFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["filePlaceHolder1234567", "filePlaceHasffsar12345678"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}





exports.testValidateDateTimeTime = function(finish){
  var testField = exampleFields.timeFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["13:57", "00:15:20"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    if(err) console.log(err);
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateDateTimeTimeInvalidTime = function(finish){
  var testField = exampleFields.timeFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["5:43", "12.3adsdsa0"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}




exports.testValidateDateTimeDate = function(finish){
  var testField = exampleFields.dateFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [new Date().toDateString(), new Date().toDateString()];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateDateTimeDateInvalidDate = function(finish){
  var testField = exampleFields.dateFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [new Date().toDateString(), "12.3asd0"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}





exports.testValidateDateTimeDateTime = function(finish){
  var testField = exampleFields.dateTimeFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [new Date().toString(), new Date().toString()];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);



  validator.validate(function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    finish();
  });
}

exports.testValidateDateTimeDateTimeInvalidDate = function(finish){
  var testField = exampleFields.dateTimeFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = [new Date().toString(), "12.3ads0"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}


exports.testValidateSectionBreak = function(finish){
  var testField = exampleFields.sectionBreakFieldData;
  var testSubmission = testSubmitFormBaseInfo;
  var testSubmissionData = ["sectionBreakSubmission", "sectionBreakSubmission2"];

  testSubmission.fieldValues = testSubmissionData;

  var validator = fieldValidator(testField, testSubmission);

  validator.validate(function(err){
    assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

    finish();
  });
}