var CONSTANTS = require('../../constants');
var FORM_CONSTANTS = CONSTANTS.FORM_CONSTANTS;
var _ = require('underscore');

/**
 * Ensuring that the dateTime field with a datetime unit has a format set.
 *
 * @param  {function}  next
 */
module.exports.ensureDateTimeFormat = function ensureDateTimeFormat(next) {
  //If its not a dateTime field, then no need to check the format.
  if (this.type !== FORM_CONSTANTS.FIELD_TYPE_DATE_TIME) {
    return next();
  }

  this.fieldOptions = _.defaults(this.fieldOptions || {}, {definition: {}});

  if (this.fieldOptions.definition.datetimeUnit === 'datetime') {
    this.fieldOptions.definition.dateTimeFormat = this.fieldOptions.definition.dateTimeFormat || FORM_CONSTANTS.DATE_TIME_FIELD_DEFAULT_FORMAT;
  }

  return next();
};