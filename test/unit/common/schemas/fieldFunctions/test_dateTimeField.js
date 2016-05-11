var dateTimeFieldValidators = require('../../../../../lib/common/schemas/fieldFunctions/dateTimeField');
var CONSTANTS = require('../../../../../lib/common/constants');
var assert = require('assert');
var _ = require('underscore');
var mockFields = require('../../../../Fixtures/formSubmissions');

describe('Date Time Field Validation', function() {

  beforeEach(function() {
    this.mockDateTimeField = JSON.parse(JSON.stringify(mockFields.dateTimeFieldDataNoFormat));
    //Validators are bound on their field models.
    this.ensureDateTimeFormat = _.bind(dateTimeFieldValidators.ensureDateTimeFormat, this.mockDateTimeField);
  });

  it('datetime format not datetime unit', function(done) {
    var self = this;

    this.mockDateTimeField.fieldOptions.definition.datetimeUnit = "date";
    this.ensureDateTimeFormat(function() {
      assert.strictEqual(undefined, self.mockDateTimeField.fieldOptions.definition.dateTimeFormat, "Expected the dateTimeFormat value not to be set.");

      done();
    });
  });

  it('datetime format not present', function(done) {
    var self = this;
    this.ensureDateTimeFormat(function() {
      assert.strictEqual(CONSTANTS.FORM_CONSTANTS.DATE_TIME_FIELD_DEFAULT_FORMAT, self.mockDateTimeField.fieldOptions.definition.dateTimeFormat, "Expected the default dateTimeFormat value to be set.");

      done();
    });
  });

  it('datetime format is present', function(done) {
    var self = this;
    var newDateTimeFormat = "HH:mm:ss DD/MM/YYYY";
    self.mockDateTimeField.fieldOptions.definition.dateTimeFormat = newDateTimeFormat;
    this.ensureDateTimeFormat(function() {
      assert.strictEqual(newDateTimeFormat, self.mockDateTimeField.fieldOptions.definition.dateTimeFormat, "Expected the new dateTimeFormat value to be set.");

      done();
    });
  });


  it('not a dateTime field', function(done) {
    var self = this;
    var mockTextAreaField = mockFields.textAreaFieldData;
    var ensureDateTimeFormat = _.bind(dateTimeFieldValidators.ensureDateTimeFormat, mockTextAreaField);

    ensureDateTimeFormat(function() {
      assert.strictEqual(undefined, mockTextAreaField.fieldOptions.definition.dateTimeFormat, "Expected the dateTimeFormat value not to be set.");

      done();
    });
  });

});