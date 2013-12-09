var async = require('async');
var util = require('util');
var assert = require('assert');

var formsRulesEngine = require('../../lib/common/forms-rule-engine.js');

var TEST_BASIC_FORM_1_PAGE_1_NAME = "TEST_BASIC_FORM_1_PAGE_1_NAME";
var TEST_BASIC_FORM_1_PAGE_1_ID = "000000000000000000000001";

var TEST_BASIC_FORM_1_PAGE_1_FIELD_1_NAME = "TEST_BASIC_FORM_1_PAGE_1_FIELD_1_NAME";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_1_TYPE = "text";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID = "000000000000000000000002";

var TEST_BASIC_FORM_1_PAGE_1_FIELD_2_NAME = "TEST_BASIC_FORM_1_PAGE_1_FIELD_2_NAME";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_2_TYPE = "textarea";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID = "000000000000000000000003";

var TEST_BASIC_FORM_1_PAGE_1_FIELD_3_NAME = "TEST_BASIC_FORM_1_PAGE_1_FIELD_3_NAME";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_3_TYPE = "number";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID = "000000000000000000000004";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE = 100;

var TEST_BASIC_FORM_1_PAGE_1_FIELD_4_NAME = "TEST_BASIC_FORM_1_PAGE_1_FIELD_4_NAME";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_4_TYPE = "sectionBreak";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID = "000000000000000000000005";

var TEST_BASIC_FORM_1_PAGE_1_FIELD_5_NAME = "TEST_BASIC_FORM_1_PAGE_1_FIELD_5_NAME";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_5_TYPE = "emailAddress";
var TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID = "000000000000000000000006";



var TEST_BASIC_FORM_1_DEFINITION = {
 "updatedBy":"user@example.com",
  "name":"TEST_BASIC_FORM_1_DEFINITION",
  "lastUpdated":"2013-11-08T20:10:33.819Z",
  "lastUpdatedTimestamp": 1384800150848,
  "dateCreated":"2013-11-08T20:10:33.819Z",
  "description":"This form is for testing rules.",
  "_id":"527d4539639f521e0a000004",
  "pageRules":[],
  "fieldRules":[
    {
      "type": "hide",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID,
        "restriction": "contains",
        "sourceValue": "hide 3"
      }],
      "targetField": TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID,
      "_id":"527d4539639f521e0a054321"
    },
    {
      "type": "hide",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID,
        "restriction": "contains",
        "sourceValue": "hide 5"
      }],
      "targetField": TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID,
      "_id":"527d4539639f521e0a001234"
    }
  ],
  "pages":[
    {
      "name":TEST_BASIC_FORM_1_PAGE_1_NAME,
      "description":"This is a test page for the win.",
      "_id":TEST_BASIC_FORM_1_PAGE_1_ID,
      "fields":[
        {
          "name":TEST_BASIC_FORM_1_PAGE_1_FIELD_1_NAME,
          "helpText":"This is a text field",
          "type":TEST_BASIC_FORM_1_PAGE_1_FIELD_1_TYPE,
          "required":true,
          "fieldOptions":{
            "definition":{
              "maxRepeat":5,
              "minRepeat":2
            },
            "validation":{
              "min":20,
              "max":100
            }
          },
          "_id":TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID,
          "repeating":false
        },
        {
          "name":TEST_BASIC_FORM_1_PAGE_1_FIELD_2_NAME,
          "helpText":"This is a text area field",
          "type":TEST_BASIC_FORM_1_PAGE_1_FIELD_2_TYPE,
          "required":false,
          "fieldOptions":{
            "definition":{
              "maxRepeat":5,
              "minRepeat":3
            },
            "validation":{
              "min":50,
              "max":100
            }
          },
          "_id":TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID,
          "repeating":false
        },
        {
          "name":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_NAME,
          "helpText":"This is a number field",
          "type":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_TYPE,
          "required":false,
          "fieldOptions":{
            "definition":{
              "maxRepeat":5,
              "minRepeat":2
            },
            "validation":{
              "min":0,
              "max": TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE
            }
          },
          "_id":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID,
          "repeating":false
        },
        {
          "name":TEST_BASIC_FORM_1_PAGE_1_FIELD_4_NAME,
          "helpText":"This is a sectionBreak field",
          "type":TEST_BASIC_FORM_1_PAGE_1_FIELD_4_TYPE, //"sectionBreak",
          "required":false,
          "_id":TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID,
          "repeating":false
        },
        {
          "name":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_NAME,
          "helpText":"This is a Email field",
          "type":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_TYPE, //"emailAddress",
          "required":true,
          "fieldOptions":{
          },
          "_id":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID,
          "repeating":false
        }
      ]
    }
  ],
  "pageRef":{
    TEST_BASIC_FORM_1_PAGE_1_ID:0
  },
  "fieldRef": {
    TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID: {
      "page":0,
      "field":0
    },
    TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID: {
      "page":0,
      "field":1
    },
    TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID: {
      "page":0,
      "field":2
    },
    TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID: {
      "page":0,
      "field":3
    },
    TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID: {
      "page":0,
      "field":4
    }
  },
  "appsUsing":123,
  "submissionsToday":1234,
  "submissionsTotal":124125  
};

var TEST_BASIC_FORM_1_SUBMISSION_1 = {
   "appId":"appId123456",
   "appCloudName":"appCloudName123456",
   "appEnvironment":"devLive",
   "deviceId":"device123456",
   "deviceFormTimestamp":1384800150848,
   "comments":[
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is a comment"
      },
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is another comment"
      }
   ],
   "formFields":[
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID,
         "fieldValues":[
            "value for text field (1)"
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID,
         "fieldValues":[
            //234567890123456789012345678901234567890123456789012345678901
            "value for text field (2)56789012345678901234567890"
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID,
         "fieldValues":[
            TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID,
         "fieldValues":[
            "testing@example.com"
         ]
      }
   ]
};

var TEST_BASIC_FORM_1_SUBMISSION_REQUIRED_FIELD_MISSING = {
   "appId":"appId123456",
   "appCloudName":"appCloudName123456",
   "appEnvironment":"devLive",
   "deviceId":"device123456",
   "deviceFormTimestamp":1384800150848,
   "comments":[
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is a comment"
      },
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is another comment"
      }
   ],
   "formFields":[
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID,
         "fieldValues":[
            //234567890123456789012345678901234567890123456789012345678901
            "value for text field (2)56789012345678901234567890"
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID,
         "fieldValues":[
            TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID,
         "fieldValues":[
            "testing@example.com"
         ]
      }
   ]
};

var TEST_BASIC_FORM_1_SUBMISSION_OPTIONAL_FIELD_MISSING = {
   "appId":"appId123456",
   "appCloudName":"appCloudName123456",
   "appEnvironment":"devLive",
   "deviceId":"device123456",
   "deviceFormTimestamp":1384800150848,
   "comments":[
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is a comment"
      },
      {
         "madeBy":"somePerson@example.com",
         "madeOn":1384800150848,
         "value":"This is another comment"
      }
   ],
   "formFields":[
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID,
         "fieldValues":[
            "value for text field (1)"
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID,
         "fieldValues":[
            TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE
         ]
      },
      {
         "fieldId":TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID,
         "fieldValues":[
            "testing@example.com"
         ]
      }
   ]
};

module.exports.testBasicForm1AllFieldsVisible = function (finish) {
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_1);

  async.each([
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
  ], function (field, cb) {
    engine.isFieldVisible(field.fieldID, true, function(err,visible) {
      assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
      assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
      return cb();
    });
  }, function (err) {
    assert.ok(!err);
    finish();
  });
};


module.exports.testBasicForm1ValidateForOptionalFieldMissing = function (finish) {
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.validateForm(TEST_BASIC_FORM_1_SUBMISSION_OPTIONAL_FIELD_MISSING, function (err, results) {
    assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID], 'should not have entry for missing optional fields: ' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]));
    finish();
  });
};


module.exports.testBasicForm1ValidateForRequiredFieldMissing = function (finish) {
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.validateForm(TEST_BASIC_FORM_1_SUBMISSION_REQUIRED_FIELD_MISSING, function (err, results) {
    assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
    assert.ok(!results.validation.valid, "unexpected valid result: " + util.inspect(results.validation));
    assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID], 'should be error for missing required field - ' + util.inspect(results.validation));
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID].valid, 'missing required field should be marked as invalid');
    assert.equal(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID].errorMessages.length, 1, 'should be 1 error message for missing required field - was: ' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID].errorMessages));

    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

    finish();
  });
};


module.exports.testBasicForm1ValidateForm = function (finish) {
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.validateForm(TEST_BASIC_FORM_1_SUBMISSION_1, function (err, results) {
    assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
    assert.ok(results.validation.valid, "unexpected invalid result: " + util.inspect(results.validation));
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
    assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

    finish();
  });
};

module.exports.testBasicForm1ValidateFormInvalid = function (finish) {
  var TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE + 1;   //  This should trigger an invalid form, field 3 value is greater than max
  
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);

  async.series([
    function (cb) {
      engine.validateForm(TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD, function (err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(!results.validation.valid, "Expected invalid result: " + util.inspect(results.validation));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID], 'Should be details for field 3, which is in error');
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].valid, 'Field 3 should be marked invalid');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages, 'Field 3 should have an error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages.length > 0, 'Field 3 should have at least one error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages[0].indexOf("max") > -1, 'Field 3 should complain about max value' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

        return cb();
      });
    },
    function (cb) {
      // change field to value within range, form should no validate
      TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE;
      engine.validateForm(TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD, function (err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(results.validation.valid, "unexpected invalid result: " + util.inspect(results.validation));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

        return cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "Unexpected error: " + util.inspect(err));
    finish();
  });
};



// sample result from validateField
// engine.validateField(fieldId, submissionJSON, function(err,res) {});
// // validate only field values on validation (no rules, no repeat checking)
// res:
// "validation":{
//         "fieldId":{
//             "fieldId":"",
//             "valid":true,
//             "errorMessages":[
//                 "length should be 3 to 5",
//                 "should not contain dammit"
//             ]
//         }
//     }
module.exports.testBasicForm1ValidateFieldInvalid = function testBasicForm1ValidateFieldInvalid(finish) {
  var TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE + 1;   //  This should trigger an invalid field, field 3 has max value specified as 100
  assert.equal(TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldId, TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, 'This test expects FIELD3 to be in index 2 of submission.formFields')

  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);

  async.series([
    function testInvalid(cb) {
      engine.validateField(TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD, function testInvalidCallback(err, results) {
        assert.ok(!err, 'unexpected error from validateField: ' + util.inspect(err));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID], 'Should be details for field 3');
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].valid, 'Field 3 should be marked invalid');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages, 'Field 3 should have an error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages.length > 0, 'Field 3 should have at least one error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages[0].indexOf("max") > -1, 'Field 3 should complain about max value' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

        return cb();
      });
    },
    function testValid(cb) {
      // change field to value within range, field should now validate
      TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE;
      engine.validateField(TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD, function testValidCallback(err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]));

        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID], 'Should be details for field 3');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].valid, 'Field 3 should be marked valid');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages, 'Field 3 should have an error message array');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages.length === 0, 'Field 3 should have no error messages: ' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages));

        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]));

        return cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "Unexpected error: " + util.inspect(err));
    finish();
  });
};

module.exports.testBasicForm1ValidateFieldValue = function testBasicForm1ValidateFieldValue(finish) {
  var TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE + 1;   //  This should trigger an invalid field, field 3 has max value specified as 100
  assert.equal(TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldId, TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, 'This test expects FIELD3 to be in index 2 of submission.formFields')

  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);

  async.series([
    function testInvalid(cb) {
      engine.validateFieldValue(TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE + 1, function testInvalidCallback(err, results) {
        assert.ok(!err, 'unexpected error from validateField: ' + util.inspect(err));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]);
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID], 'Should be details for field 3');
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].valid, 'Field 3 should be marked invalid');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages, 'Field 3 should have an error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages.length > 0, 'Field 3 should have at least one error message');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages[0].indexOf("max") > -1, 'Field 3 should complain about max value' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]);
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]);

        return cb();
      });
    },
    function testValid(cb) {
      // change field to value within range, field should now validate
      TEST_BASIC_FORM_1_SUBMISSION_TEST_INVALID_FIELD.formFields[2].fieldValues[0] = TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE;
      engine.validateFieldValue(TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, TEST_BASIC_FORM_1_PAGE_1_FIELD_3_MAX_VALUE, function testValidCallback(err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID]));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID]));

        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID], 'Should be details for field 3');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].valid, 'Field 3 should be marked valid');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages, 'Field 3 should have an error message array');
        assert.ok(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages.length === 0, 'Field 3 should have no error messages: ' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID].errorMessages));

        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID]));
        assert.ok(!results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID], 'Unexpected results for TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID' + util.inspect(results.validation[TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID]));

        return cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "Unexpected error: " + util.inspect(err));
    finish();
  });
};

module.exports.testBasicForm1SpecificFieldsVisibleWithField3Invisible = function (finish) {

  var TEST_BASIC_FORM_1_SUBMISSION_2 = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_2.formFields[0].fieldValues[0] = "hide 3";   //  This should trigger rule that causes field 3 to be hidden
  
  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_2);

  async.each([
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: false},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
  ], function (field, cb) {
    engine.isFieldVisible(field.fieldID, true, function(err,visible) {
      assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
      assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
      return cb();
    });
  }, function (err) {
    assert.ok(!err);
    finish();
  });
};



module.exports.testBasicForm1SpecificFieldsVisibleWithField5Invisible = function (finish) {

  var TEST_BASIC_FORM_1_SUBMISSION_3 = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_3.formFields[0].fieldValues[0] = "hide 5";   //  This should trigger rule that causes field 5 to be hidden

  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_3);

  async.each([
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: false}
  ], function (field, cb) {
    engine.isFieldVisible(field.fieldID, true, function(err,visible) {
      assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
      assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
      return cb();
    });
  }, function (err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testBasicForm1SpecificFieldsVisibleWithFields3and5Invisible = function (finish) {

  var TEST_BASIC_FORM_1_SUBMISSION_4 = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_BASIC_FORM_1_SUBMISSION_4.formFields[0].fieldValues[0] = "hide 3 hide 5";   //  This should trigger rule that causes fields 3 & 5 to be hidden

  var engine = formsRulesEngine(TEST_BASIC_FORM_1_DEFINITION);
  engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_4);

  async.each([
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: false},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: false}
  ], function (field, cb) {
    engine.isFieldVisible(field.fieldID, true, function(err,visible) {
      assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
      assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
      return cb();
    });
  }, function (err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testBasicForm1FieldSetToShowInRule = function (finish) {

  var TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_DEFINITION));
  var NEW_RULE =  {
    "type": "show",
    "ruleConditionalOperator": "and",
    "ruleConditionalStatements": [{
      "sourceField": TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID,
      "restriction": "contains",
      "sourceValue": "show 4"
    }],
    "targetField": TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID,
    "_id":"527d4539639f521e0a001235"
  };
  TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD.fieldRules.push(NEW_RULE);

  var TEST_SUBMISSION_WITH_SHOW_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_SUBMISSION_WITH_SHOW_FIELD.formFields[1].fieldValues[0] = "show 4";   //  This should trigger rule that causes fields 4 to be shown

  var engine = formsRulesEngine(TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD);
  engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_1);

  async.each([
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: false},  // if rule set to show a field, it should start as hidden
    { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
  ], function (field, cb) {
    engine.isFieldVisible(field.fieldID, true, function(err,visible) {
      assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
      assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
      return cb();
    });
  }, function (err) {
    assert.ok(!err);
    engine.initSubmission(TEST_SUBMISSION_WITH_SHOW_FIELD);

    async.each([
      { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_1_ID, expectedVisible: true},
      { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID, expectedVisible: true},
      { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
      { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},  // if rule set to show a field, it should start as hidden
      { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
    ], function (field, cb) {
      engine.isFieldVisible(field.fieldID, true, function(err,visible) {
        assert.ok(!err, 'validation should not have returned error, for fieldID:' + field.fieldID + ' - err: ' + util.inspect(err));
        assert.ok(field.expectedVisible === visible, 'Field:' + field.fieldID + ' should ' + (field.expectedVisible?"":" NOT ") + 'be marked as visible');
        return cb();
      });
    }, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.testBasicFormCheckRulesFieldSetToShowInRule = function (finish) {
  var TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_DEFINITION));
  var NEW_RULE =  {
    "type": "show",
    "ruleConditionalOperator": "and",
    "ruleConditionalStatements": [{
      "sourceField": TEST_BASIC_FORM_1_PAGE_1_FIELD_2_ID,
      "restriction": "contains",
      "sourceValue": "show 4"
    }],
    "targetField": TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID,
    "_id":"527d4539639f521e0a001235"
  };
  TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD.fieldRules.push(NEW_RULE);

  var engine = formsRulesEngine(TEST_FORM_WITH_A_RULE_SET_TO_SHOW_A_FIELD);
  //engine.initSubmission(TEST_BASIC_FORM_1_SUBMISSION_1);

  var TEST_SUBMISSION_WITH_SHOW_FIELD = JSON.parse(JSON.stringify(TEST_BASIC_FORM_1_SUBMISSION_1));
  TEST_SUBMISSION_WITH_SHOW_FIELD.formFields[1].fieldValues[0] = "show 4";   //  This should trigger rule that causes fields 4 to be shown

  var tests = [
    {
      submission: TEST_BASIC_FORM_1_SUBMISSION_1,
      fieldsToCheck: [
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: false},  // if rule set to show a field, it should start as hidden
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
      ]
    },
    {
      submission: TEST_SUBMISSION_WITH_SHOW_FIELD,
      fieldsToCheck: [
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_3_ID, expectedVisible: true},
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_4_ID, expectedVisible: true},  // if rule set to show a field, it should start as hidden
        { fieldID: TEST_BASIC_FORM_1_PAGE_1_FIELD_5_ID, expectedVisible: true}
      ]
    }
  ];

  async.eachSeries(tests,   // these tests are using the same "engine" object, can't run in parallel
    function (oneTest, cb) {
      engine.checkRules(oneTest.submission, function (err, results) {
        assert.ok(!err);
        assert.ok(results);
        assert.ok(results.actions);
        assert.ok(results.actions.fields);
        assert.equal(Object.keys(results.actions.fields).length, 3, 'Should only be 3 fields listed, since only 3 targets specified in rules');
        assert.ok(results.actions.pages);
        assert.equal(Object.keys(results.actions.pages).length, 0, 'Should be 0 pages listed, since no page targets specified in rules');

        async.each(oneTest.fieldsToCheck, function (fieldTest, cb) {
          assert.ok(results.actions.fields[fieldTest.fieldID], 'expected field ' + fieldTest.fieldID + ' not listed in results: ' + util.inspect(results.actions.fields));
          assert.equal(results.actions.fields[fieldTest.fieldID].targetId, fieldTest.fieldID);
          assert.equal(results.actions.fields[fieldTest.fieldID].action, fieldTest.expectedVisible?"show":"hide", 'expected action ' + (fieldTest.expectedVisible?"show":"hide") + ', for field: ' + fieldTest.fieldID);
          return cb();
        }, function (err) {
          assert.ok(!err);
          return cb();
        });
      });
    }, function (err) {
      assert.ok(!err);
      finish();
  });
};

