var moment = require('moment');
var _ = require('underscore');
var mergeFormFields = require('./mergeFormFields');
var processSingleSubmission = require('./processSingleSubmission');
var csvHeaders = require('./csvHeaders');

/**
 * Converting Submissions to a CSV format.
 * @param params: {
 *   fieldHeader - <<name/fieldCode>> (The header to use for fields in csv).
 *   submissions - Array of submissions to be exported
 *  downloadUrl - Base download URL for file downloads
 * }
 *
 * @param cb: callback function when complete or an error occurs.
 */
function submissionsToCSV(params, cb) {
  params = params || {};
  var submissions = params.submissions || [];
  var downloadUrl = params.downloadUrl;
  //Checking whether a preferred field name is required. Defaults to name
  var fieldHeader = params.fieldHeader === "fieldCode" ? "fieldCode": "name";

  var csvs = {};
  var mergedFields = {}; //an obj of all the fields a form has ever had over its history.
  var date =  moment().format("YYYY-MM-DD-hh-mm");

  _.each(submissions, function(submission){
    var formId = submission.formId.toString();
    mergedFields[formId] = mergeFormFields(mergedFields[formId] || {}, submission.formSubmittedAgainst);
  });

  _.each(submissions, function(submission){
    var csvKey = date + "-" + submission.formId;
    //First, generate headers.
    csvs[csvKey] = csvs[csvKey] || csvHeaders.generateCSVHeaders(_.keys(mergedFields[submission.formId]), mergedFields[submission.formId], fieldHeader);
    csvs[csvKey] += processSingleSubmission({
      submission: submission,
      mergedFields: mergedFields,
      date: date,
      fieldHeader: fieldHeader,
      downloadUrl: downloadUrl
    });
  });

  //merge fields
  return cb(undefined , csvs);
}

module.exports = {
  submissionsToCSV: submissionsToCSV
};
