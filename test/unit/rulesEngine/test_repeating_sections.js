var assert = require('assert');
var util = require("util");
var _ = require('underscore');
var formsRulesEngine = require('../../../lib/common/forms-rule-engine.js');

var repeatingSectionsForm = require('../../Fixtures/repeatingSectionsForm.json');
var repeatingSectionsRuleForm = require('../../Fixtures/repeatingSectionRulesForm.json');
var getBaseSubmission = require('../../Fixtures/baseSubmission');

var TEXT_AREA_FIELD_1_ID = "textareafield1";
var SECTION_FIELD_ID = "sectionbreakfield1";
var NUMBER_FIELD_ID = "numberfield1";

var submissionFields = {
  number: {
    fieldId: NUMBER_FIELD_ID,
    fieldValues: [12]
  },
  textarea: {
    fieldId: TEXT_AREA_FIELD_1_ID,
    fieldValues: ["AREA VAL 1"]
  },
  text: {
    fieldId: "textfield",
    fieldValues: ["textvalue1"]
  }
};

/**
 *
 * Getting an example field value entry.
 *
 * @param type
 * @param sectionIndex
 * @returns {*}
 */
function getSubmissionField(type, sectionIndex) {
  var sectionValue = _.clone(submissionFields[type]);
  sectionValue.sectionIndex = sectionIndex;
  return sectionValue;
}


describe("Repeating Sections", function() {

  var repeatingSectionsFormValidator = formsRulesEngine(repeatingSectionsForm);

  it('should validate that multiple repeating section values are passed', function(done) {
    var submission = getBaseSubmission();

    submission.formFields = [
      //values for section 1 repeat 1
      getSubmissionField('number', 0),
      getSubmissionField('textarea', 0),

      //values for section 1 repeat 2
      getSubmissionField('number', 1),
      getSubmissionField('textarea', 1)];

    repeatingSectionsFormValidator.validateForm(submission, function(err, results) {
      assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
      assert.ok(results.validation.valid, "expected valid result: " + util.inspect(results.validation));
      done();
    });
  });

  it('should default to section index 0 if not supplied', function(done) {
    var submission = getBaseSubmission();

    submission.formFields = [
      //values for section 1 repeat 1
      getSubmissionField('number', undefined),
      getSubmissionField('textarea', undefined),

      //values for section 1 repeat 2
      getSubmissionField('number', 1),
      getSubmissionField('textarea', 1)];

    repeatingSectionsFormValidator.validateForm(submission, function(err, results) {
      assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
      assert.ok(results.validation.valid, "expected valid result: " + util.inspect(results.validation));
      done();
    });
  });

  it('should return an error if a repeating section value is missing', function(done) {
    var submission = getBaseSubmission();

    submission.formFields = [
      //values for section 1 repeat 1
      getSubmissionField('number', 0),
      getSubmissionField('textarea', 0),

      //values for section 1 repeat 2 - missing field
      getSubmissionField('number', 1)];

    repeatingSectionsFormValidator.validateForm(submission, function(err, results) {

      assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
      assert.ok(!results.validation.valid, "unexpected valid result: " + util.inspect(results.validation));

      assert.ok(results.validation[TEXT_AREA_FIELD_1_ID], 'should be error for missing required field - ' + util.inspect(results.validation));

      var sectionErrors = results.validation[TEXT_AREA_FIELD_1_ID].sections;

      assert.ok(!sectionErrors[1].valid, 'missing required field in section 2 should be marked as invalid');
      assert.equal(1, sectionErrors[1].sectionIndex);
      assert.equal(sectionErrors[1].fieldErrorMessage.length, 1, 'should be 1 error message for missing required field - was: ' + util.inspect(sectionErrors[1].fieldErrorMessage));

      done();
    });
  });

  it('should check for too many sections passed', function(done) {
    var submission = getBaseSubmission();

    submission.formFields = [
      //values for section 1 repeat 1
      getSubmissionField('number', 0),
      getSubmissionField('textarea', 0),

      //values for section 1 repeat 2
      getSubmissionField('number', 1),
      getSubmissionField('textarea', 1),

      //values for section 1 repeat 3
      getSubmissionField('number', 2),
      getSubmissionField('textarea', 2),

      //values for section 1 repeat 4 - Too Many
      getSubmissionField('number', 3),
      getSubmissionField('textarea', 3)];

    repeatingSectionsFormValidator.validateForm(submission, function(err, results) {
      assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
      assert.ok(!results.validation.valid, "unexpected valid result: " + util.inspect(results.validation));

      var sectionResults = results.validation[SECTION_FIELD_ID].sections;

      assert.ok(results.validation[SECTION_FIELD_ID], 'should be error for missing required field - ' + util.inspect(results.validation));
      assert.ok(!sectionResults[3].valid, 'missing required field in section 2 should be marked as invalid');
      assert.equal(3, sectionResults[3].sectionIndex);
      assert.equal(sectionResults[3].fieldErrorMessage[0], "Expected a maximum of 3 sections but got 4.");

      done();
    });

  });


  describe("Rules Within A Repeating Section", function() {

    var repeatingSectionsFormRuleValidator = formsRulesEngine(repeatingSectionsRuleForm);

    it('should only hide the field in a single section', function(done) {
      var submission = getBaseSubmission();

      var textAreaFieldEntry = getSubmissionField('textarea', 0);
      textAreaFieldEntry.fieldValues = ['hide'];

      submission.formFields = [
        //values for section 1 repeat 1 - The `show` value in the textarea field should make the number field required
        //in this section
        getSubmissionField('number', 0),
        textAreaFieldEntry,

        //values for section 1 repeat 2 - The default value in the textarea field should make the number field required for this section
        getSubmissionField('textarea', 1)
      ];

      repeatingSectionsFormRuleValidator.validateForm(submission, function(err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(!results.validation.valid, "unexpected valid result: " + util.inspect(results.validation));

        assert.ok(results.validation[NUMBER_FIELD_ID], 'should be error for missing required field - ' + util.inspect(results.validation));
        assert.ok(!results.validation[NUMBER_FIELD_ID].valid, 'missing required field in section 2 should be marked as invalid');
        assert.equal(1, results.validation[NUMBER_FIELD_ID].sections[1].sectionIndex);
        assert.equal(results.validation[NUMBER_FIELD_ID].sections[1].fieldErrorMessage[0], "Required Field Not Submitted");

        assert.equal(undefined, results.validation[NUMBER_FIELD_ID].sections[0], "Expected no validation error for the first section. The rule should have hidden the number field");
        done();
      });
    });

    it('should validate a single field in multiple sections', function(done) {
      var submission = getBaseSubmission();


      submission.formFields = [
        //values for section 1 repeat 1 - Missing the number field
        getSubmissionField('textarea', 0),

        //values for section 1 repeat 2 - Missing the number field
        getSubmissionField('textarea', 1)
      ];

      repeatingSectionsFormRuleValidator.validateForm(submission, function(err, results) {
        console.log("** RESULT", results.validation[NUMBER_FIELD_ID].sections);
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));
        assert.ok(!results.validation.valid, "unexpected valid result: " + util.inspect(results.validation));

        assert.ok(results.validation[NUMBER_FIELD_ID], 'should be error for missing required field - ' + util.inspect(results.validation));
        assert.ok(!results.validation[NUMBER_FIELD_ID].valid, 'missing required field in section 2 should be marked as invalid');

        //Expecting the first entry to be the invalid number field in section repeat 0
        assert.equal(0, results.validation[NUMBER_FIELD_ID].sections[0].sectionIndex);
        assert.equal("Required Field Not Submitted", results.validation[NUMBER_FIELD_ID].sections[0].fieldErrorMessage[0]);

        //Expecting the first entry to be the invalid number field in section repeat 1
        assert.equal(1, results.validation[NUMBER_FIELD_ID].sections[1].sectionIndex);
        assert.equal("Required Field Not Submitted", results.validation[NUMBER_FIELD_ID].sections[1].fieldErrorMessage[0]);

        done();
      });
    });

    it('should hide a field in a repeating section when targeting from outside the repeating section', function(done) {
      var submission = getBaseSubmission();

      submission.formFields = [
        //Setting the 2 value to trigger the field rule that triggers hiding the number fields
        {
          fieldId: 'numberfieldoutsidesection',
          fieldValues: [2]
        },
        //values for section 1 repeat 1 - Missing the number field
        getSubmissionField('textarea', 0),

        //values for section 1 repeat 2 - Missing the number field
        getSubmissionField('textarea', 1)
      ];

      repeatingSectionsFormRuleValidator.validateForm(submission, function(err, results) {
        assert.ok(!err, 'unexpected error from validateForm: ' + util.inspect(err));

        //If the number fields are being hidden, then they shouldn't be required.
        assert.ok(results.validation.valid, "Expected valid result: " + util.inspect(results.validation));

        done();
      });
    });
  });
});