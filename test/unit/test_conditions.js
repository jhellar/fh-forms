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

  var fieldTypes = ["select", "text", "emailAddress", "textarea", "radio"];

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

  var fieldValue = 27;
  var testValues = [
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

// TODO =====>>>>   //   "date":         ["is on", "is before", "is after"],




