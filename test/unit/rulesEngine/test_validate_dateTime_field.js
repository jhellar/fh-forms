var assert = require('assert');
var util = require("util");
var _ = require('underscore');
var formsRulesEngine = require('../../../lib/common/forms-rule-engine.js');

var exampleFields = require('../../Fixtures/formSubmissions.js');
var getBaseSubmission = require('../../Fixtures/baseSubmission');


/**
 * Small utilily function to test a single field in a submission
 *
 * @param fieldDef     Full JSON definition of the field
 * @param submission   A full submission JSON to test
 * @returns {{validate: validate}} A function to access the result.
 */
function fieldValidator(fieldDef, submission) {
  var retVal;
  var engine = formsRulesEngine({"submission" : null, "definition" : null});
  engine.validateFieldInternal(submission, fieldDef, {}, true, function(err, results) {
    retVal = err || _.first(results.fieldErrorMessage) ||  _.first(results.errorMessages);
  });

  return {
    validate: function(cb) {
      return cb(retVal);
    }
  };
}

describe("Rules Engine Validate dateTime Field", function() {

  describe("Time Field", function() {

    it("Validate Valid Time Formats", function(done) {
      var testField = exampleFields.timeFieldData;
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = ["13:57", "00:15:20"];

      var validator = fieldValidator(testField, testSubmission);


      validator.validate(function(err) {
        assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

        done();
      });
    });

    it("Invalid Time Format", function(done) {
      var testField = exampleFields.timeFieldData;
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = ["5:43", "12.3adsdsa0"];

      var validator = fieldValidator(testField, testSubmission);

      validator.validate(function(err) {
        assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

        done();
      });
    });

  });


  describe("Date Field", function() {

    it("Valid Date Formats", function(done) {
      var testField = exampleFields.dateFieldData;
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = ["2016/12/22", "12/22/2016"];

      var validator = fieldValidator(testField, testSubmission);

      validator.validate(function(err) {
        assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

        done();
      });
    });

    it("Invalid Date Formats", function(done) {
      var testField = exampleFields.dateFieldData;
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = [new Date().toDateString(), "12.3asd0"];

      var validator = fieldValidator(testField, testSubmission);

      validator.validate(function(err) {
        assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

        done();
      });
    });

  });


  describe("DateTime Formats", function() {

    var dateTimeFieldDef = _.clone(exampleFields.dateTimeFieldDataNoFormat);

    it("Valid DateTime Format", function(done) {
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues =  ["2016/05/12 10:05:22", "2016/05/12 10:05", "2016-05-12 10:05:55", "2016-05-12 10:05"];

      var validator = fieldValidator(dateTimeFieldDef, testSubmission);


      validator.validate(function(err) {
        assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

        done();
      });
    });

    it("Invalid DateTime Format", function(done) {
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = [new Date().toString(), "12.3ads0"];

      var validator = fieldValidator(dateTimeFieldDef, testSubmission);

      validator.validate(function(err) {
        assert.ok(err, 'Expected error, but was: ' + util.inspect(err));

        done();
      });
    });


    it("Custom Date Format: Valid DateTime Format", function(done) {
      var testField = _.clone(dateTimeFieldDef);

      testField.fieldOptions.definition.dateTimeFormat = "YYYY-DD-MM HH-mm-ss";
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = ["2012-22-11 14-59-59"];

      var validator = fieldValidator(testField, testSubmission);

      validator.validate(function(err) {
        assert.ok(!err, 'Expected no error ' + util.inspect(err));

        done();
      });
    });

    it("Custom Date Format: Invalid DateTime Format", function(done) {
      var testField = _.clone(dateTimeFieldDef);
      var expectedFormat = "YYYY-DD-MM HH-mm-ss";
      var testValue = "2012-22-11 14:59:59";
      testField.fieldOptions.definition.dateTimeFormat = expectedFormat;
      var testSubmission = getBaseSubmission();

      testSubmission.fieldValues = [testValue];

      var validator = fieldValidator(testField, testSubmission);

      validator.validate(function(err) {
        assert.ok(err, 'Expected error, but was: ' + util.inspect(err));
        assert.ok(err.indexOf(expectedFormat) > -1, "Expected the expected format to be in the error message");
        assert.ok(err.indexOf(testValue) > -1, "Expected the submitted value to be in the error message");

        done();
      });
    });

  });

});