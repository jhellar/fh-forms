var async = require('async');
var util = require('util');
var assert = require('assert');

var formsRulesEngine = require('../../lib/common/forms-rule-engine.js');

// from Studio client
  // FIELD_RULES: {
  //   "select":       ["is", "is not", "contains", "does not contain", "begins with", "ends with"],
  //   "text":         ["is", "is not", "contains", "does not contain", "begins with", "ends with"],
  //   "emailAddress": ["is", "is not", "contains", "does not contain", "begins with", "ends with"],
  //   "textarea":     ["is", "is not", "contains", "does not contain", "begins with", "ends with"],
  //   "radio":        ["is", "is not", "contains", "does not contain", "begins with", "ends with"]
  //   "number":       ["is equal to", "is greater than", "is less than"],
  //   "date":         ["is on", "is before", "is after"],
  //   "checkbox":     ["is","is not"],
  // },

// conditions: ["is not","is equal to","is greater than","is less than","is", "contains", "does not contain", "begins with", "ends with"]},
//             dateconditions  "is at","is before","is after",
// field types ["text", "textarea", "number", "emailAddress", "dropdown", "radio", "checkboxes", "location", "locationMap", "dateTime", "matrix"]},
// field types not use for conditions: "photo", "signature", "file", "sectionBreak", 

module.exports.testTextStyleConditions = function (finish) {
  var engine = formsRulesEngine({"submission" : null, "definition" : null});

  var fieldTypes = ["dropdown", "text", "emailAddress", "textarea", "radio"];

  var fieldValue = "hello";
  var testValues = [
    { condition: "is", value: "hello", expected: true },
    { condition: "is", value: " hello", expected: false },
    { condition: "is", value: "", expected: false },
    { condition: "is", value: " ", expected: false },
    { condition: "is not", value: "hello", expected: false },
    { condition: "is not", value: " hello", expected: true },
    { condition: "is not", value: "", expected: true },
    { condition: "is not", value: " ", expected: true },
    { condition: "contains", value: "hello", expected: true },
    { condition: "contains", value: "hel", expected: true },
    { condition: "contains", value: "", expected: true },
    { condition: "contains", value: " ", expected: false },
    { condition: "contains", value: "ll", expected: true },
    { condition: "does not contain", value: "hello", expected: false },
    { condition: "does not contain", value: "hel", expected: false },
    { condition: "does not contain", value: "", expected: false },
    { condition: "does not contain", value: " ", expected: true },
    { condition: "does not contain", value: "X", expected: true },
    { condition: "does not contain", value: "ll", expected: false },

    { condition: "begins with", value: "hello", expected: true },
    { condition: "begins with", value: "helloworld", expected: false },
    { condition: "begins with", value: "hel", expected: true },
    { condition: "begins with", value: "", expected: true },
    { condition: "begins with", value: " ", expected: false },
    { condition: "begins with", value: "worldhello", expected: false },

    { condition: "ends with", value: "hello", expected: true },
    { condition: "ends with", value: "hel", expected: false },
    { condition: "ends with", value: "", expected: true },
    { condition: "ends with", value: " ", expected: false },
    { condition: "ends with", value: "llo", expected: true },
    { condition: "ends with", value: "helloworld", expected: false },
    { condition: "ends with", value: "worldhello", expected: false }
  ];

  async.each(fieldTypes, function (fieldType, cb) {
    var field = {type: fieldType};
    async.each(testValues, function (testValue, cb) {
      var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
      assert.strictEqual(actual, testValue.expected, "testing fieldType: " + fieldType + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
      return cb();
    }, function (err) {
      assert.ok(!err);
      return cb();
    });
  }, function (err) {
      assert.ok(!err);
      return finish();
  });

};

  //   "number":       ["is equal to", "is greater than", "is less than"],
module.exports.testNumberConditions = function (finish) {
  var engine = formsRulesEngine({"submission" : null, "definition" : null});

  var fieldValue = "27";
  var testValues = [
    { condition: "is equal to", value: 27, expected: true },
    { condition: "is equal to", value: 27, expected: true },
    { condition: "is equal to", value: 270, expected: false },
    { condition: "is equal to", value: 0, expected: false },
    { condition: "is equal to", value: 1, expected: false },
    { condition: "is equal to", value: -1, expected: false },
    { condition: "is equal to", value: -27, expected: false },
    { condition: "is greater than", value: 27, expected: false },
    { condition: "is greater than", value: 270, expected: false },
    { condition: "is greater than", value: 26, expected: true },
    { condition: "is greater than", value: 1, expected: true },
    { condition: "is greater than", value: 0, expected: true },
    { condition: "is greater than", value: -1, expected: true },
    { condition: "is greater than", value: -27, expected: true },
    { condition: "is greater than", value: -270, expected: true },
    { condition: "is less than", value: 27, expected: false },
    { condition: "is less than", value: 270, expected: true },
    { condition: "is less than", value: 26, expected: false },
    { condition: "is less than", value: 1, expected: false },
    { condition: "is less than", value: 0, expected: false },
    { condition: "is less than", value: -1, expected: false },
    { condition: "is less than", value: -27, expected: false },
    { condition: "is less than", value: -270, expected: false },
  ];

  var field = {type: "number"};
  async.each(testValues, function (testValue, cb) {
    var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
    assert.strictEqual(actual, testValue.expected, "testing fieldType: " + field.type + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
    return cb();
  }, function (err) {
    assert.ok(!err);
    return finish();
  });

};

  //   "checkbox":     ["is","is not"],
module.exports.testCheckboxConditions = function (finish) {
  var engine = formsRulesEngine({"submission" : null, "definition" : null});

  var fieldValue = {selections:['one','two','three']};
  var testValues = [
    { condition: "is", value: 'one', expected: true },
    { condition: "is", value: 'two', expected: true },
    { condition: "is", value: 'three', expected: true },
    { condition: "is", value: 'four', expected: false },
    { condition: "is", value: 'one, two', expected: false },
    { condition: "is", value: 0, expected: false },
    { condition: "is not", value: 'one', expected: false },
    { condition: "is not", value: 'two', expected: false },
    { condition: "is not", value: 'three', expected: false },
    { condition: "is not", value: 'four', expected: true },
    { condition: "is not", value: 'one, two', expected: true },
    { condition: "is not", value: 0, expected: true },
  ];

  var field = {type: "checkboxes"};
  async.each(testValues, function (testValue, cb) {
    var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
    assert.strictEqual(actual, testValue.expected, "testing fieldType: " + field.type + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
    return cb();
  }, function (err) {
    assert.ok(!err);
    return finish();
  });

};

//   "date":         ["is on", "is before", "is after"],
module.exports.testDatTimeConditions = function (finish) {
  var FIELD_TYPE_DATETIME = "dateTime";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY = "date";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY = "time";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME = "datetime";

  var engine = formsRulesEngine({"submission" : null, "definition" : null});

  var fieldValue = "2013/12/02 13:22:08";
  var beforeValue = "2013/12/02 13:22:09";
  var beforeYearValue = "2014/12/02 13:22:08";
  var afterValue = "2013/12/02 13:22:07";
  var afterYearValue = "2012/12/02 13:22:08";

  var testValues = [
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: fieldValue, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterYearValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeYearValue, expected: false },

    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: fieldValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterYearValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeYearValue, expected: false },

    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: fieldValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeValue, expected: true },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: afterYearValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME, value: beforeYearValue, expected: true }
  ];

  var field = {type: FIELD_TYPE_DATETIME, fieldOptions: {definition: {}}};
  async.each(testValues, function (testValue, cb) {
    field.fieldOptions.definition.datetimeUnit = testValue.datetimeUnit;
    var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
    assert.strictEqual(actual, testValue.expected, "testing fieldType: " + field.type + '/' + field.fieldOptions.definition.datetimeUnit + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
    return cb();
  }, function (err) {
    assert.ok(!err);
    return finish();
  });

};

module.exports.testDateOnlyConditions = function (finish) {
  var FIELD_TYPE_DATETIME = "dateTime";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY = "date";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY = "time";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME = "datetime";

  var engine = formsRulesEngine({"submission" : null, "definition" : null});


  var fieldValue = "2013/12/02 00:00:00";
  var beforeValue = "2013/12/03 13:22:09";
  var beforeYearValue = "2014/12/02 00:00:00";
  var afterValue = "2013/12/01 00:00:00";
  var afterYearValue = "2012/12/02 00:00:00";

  var testValues = [
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: fieldValue, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterYearValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeYearValue, expected: false },

    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: fieldValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterYearValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeYearValue, expected: false },

    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: fieldValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeValue, expected: true },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: afterYearValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY, value: beforeYearValue, expected: true }
  ];

  var field = {type: FIELD_TYPE_DATETIME, fieldOptions: {definition: {}}};
  async.each(testValues, function (testValue, cb) {
    field.fieldOptions.definition.datetimeUnit = testValue.datetimeUnit;
    var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
    assert.strictEqual(actual, testValue.expected, "testing fieldType: " + field.type + '/' + field.fieldOptions.definition.datetimeUnit + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
    return cb();
  }, function (err) {
    assert.ok(!err);
    return finish();
  });

};



module.exports.testTimeOnlyConditions = function (finish) {
  var FIELD_TYPE_DATETIME = "dateTime";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATEONLY = "date";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY = "time";
  var FIELD_TYPE_DATETIME_DATETIMEUNIT_DATETIME = "datetime";

  var engine = formsRulesEngine({"submission" : null, "definition" : null});


  var fieldValue = "12:00:00";
  var otherRepresentationOfFieldValue2 =  "12:00";
  var otherRepresentationOfFieldValue4 =  "12:00:0";
  var otherRepresentationOfFieldValue5 =  "12:0:0";
  var otherRepresentationOfFieldValue6 =  "12:0";
  var beforeValue = "12:00:01";
  var beforeYearValue = "23:59:59";
  var afterValue = "11:59:59";
  var afterYearValue = "00:00:01";

  var testValues = [
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: fieldValue, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue2, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue4, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue5, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue6, expected: true },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterYearValue, expected: false },
    { condition: "is at", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeYearValue, expected: false },

    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: fieldValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue2, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue4, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue5, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue6, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeValue, expected: false },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterYearValue, expected: true },
    { condition: "is after", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeYearValue, expected: false },

    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: fieldValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue2, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue4, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue5, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: otherRepresentationOfFieldValue6, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeValue, expected: true },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: afterYearValue, expected: false },
    { condition: "is before", datetimeUnit: FIELD_TYPE_DATETIME_DATETIMEUNIT_TIMEONLY, value: beforeYearValue, expected: true }
  ];

  var field = {type: FIELD_TYPE_DATETIME, fieldOptions: {definition: {}}};
  async.each(testValues, function (testValue, cb) {
    field.fieldOptions.definition.datetimeUnit = testValue.datetimeUnit;
    var actual = engine.isConditionActive(field, fieldValue, testValue.value, testValue.condition);
    assert.strictEqual(actual, testValue.expected, "testing fieldType: " + field.type + '/' + field.fieldOptions.definition.datetimeUnit + ', condition: ' + testValue.condition + ", fieldValue: " + fieldValue + ", value: " + testValue.value + ", actual: " + actual + ', expected: ' + testValue.expected);
    return cb();
  }, function (err) {
    assert.ok(!err);
    return finish();
  });

};

