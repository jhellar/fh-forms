var _ = require('lodash');
var logger = require('../../common/logger.js').getLogger();
var CONSTANTS = require('../../common/constants');

/**
 * reformatFormIdAndName - Reformatting the form ID associated with the submission.
 *
 * @param  {object} submission Submission to process.
 * @return {object}            Updated submission
 */
function reformatFormIdAndName(submission) {
  var formName = "Unknown";
  if (submission && submission.formId && submission.formId.name) {
    formName = submission.formId.name;
  }

  if (submission && submission.formSubmittedAgainst) {
    formName = submission.formSubmittedAgainst.name;
  }

  submission.formName = formName;
  submission.formId = submission.formId.toString();
  return submission;
}

/**
 * Only Includes Fields In The Summary
 * @param submission
 * @returns {Object}
 */
function restrictSubmissionForSummary(submission) {
  submission.formFields = _.filter(submission.formFields, function(formField) {
    return CONSTANTS.FIELD_TYPES_INCLUDED_IN_SUMMARY.indexOf(formField.fieldId.type) >= 0;
  });

  submission.formFields = _.first(submission.formFields, CONSTANTS.NUM_FIELDS_INCLUDED_IN_SUMMARY);

  return submission;
}

/**
 * handleListResult - Post-processing of a submissions list
 *
 * @param  {object}  err                     An error response if an error occurred
 * @param  {object}  params
 * @param  {boolean} params.wantRestrictions Flag wheter to restrict the submission response or not.
 * @param  {Array} foundSubmissions Array of found submissions
 * @param  {function} callback
 */
module.exports = function handleListResult(err, params, foundSubmissions, callback) {
  if (err) {
    logger.error("getSubmissions find", {error: err});
    return callback(err);
  }

  foundSubmissions = foundSubmissions || [];

  logger.debug("getSubmissionList find", {numSubmissionsFound: foundSubmissions.length});

  var retSubmissions = _.map(foundSubmissions, function(submission) {
    submission._id = submission._id.toString();
    submission = reformatFormIdAndName(submission);

    //Do not want to restrict the submission for summary display. Return the full submission
    if (params.wantRestrictions === false) {
      return submission;
    }

    submission = restrictSubmissionForSummary(submission);

    return submission;
  });

  return callback(undefined, {
    submissions: retSubmissions,
    pages: params.pages,
    total: params.total
  });
};
