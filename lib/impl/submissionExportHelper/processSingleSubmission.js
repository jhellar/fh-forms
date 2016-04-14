var csvGeneration = require('./csvValues');
var csvHeaders = require('./csvHeaders');
var _ = require('underscore');

/**
 * getSubmissionFormField - Helper function to see if a submission contains a form field (which we get from the form itself)
 *
 * @param  {object} submission  Submission JSON defintion
 * @param  {type} formField     Field definition to search for.
 * @return {object}             Found Field or undefined
 */
function getSubmissionFormField(submission, formField) {
  return _.find(submission.formFields, function(subField) {
    var fieldId = subField.fieldId.toString();
    return fieldId === formField._id.toString();
  });
}

/**
 * processSingleSubmission - Processing A Single Submission Against The Merged Form
 *
 * @param  {object} params
 * @param  {object} params.submission   A full submission JSON definition
 * @param  {object} params.mergedFields A set of merged fields from different versions of the form.
 * @param  {string} params.downloadUrl  The download URL template to use for genenerating file URLs
 * @return {type}        description
 */
module.exports = function processSingleSubmission(params) {
  //Submission To Export
  var sub = params.submission;

  //CSV Line definition
  var line = '';

  //Keeping the string version
  sub._id = sub._id.toString();
  sub.formName = sub.formSubmittedAgainst.name;
  //Merged field definitions
  var mergedFields = params.mergedFields;

  //Download Url For Files
  var downloadUrl = params.downloadUrl;

  //ID Of The Form Submitted Against
  sub.formId = sub.formId.toString();

  var mergedFieldEntries = mergedFields[sub.formId];

  // Add metaDataHeaders values first
  line = csvHeaders.addMetadataValues(line, sub);

  mergedFieldEntries = mergedFields[sub.formId];

  //For each merged field entry, add the relevant field values from the submission.
  _.each(mergedFieldEntries, function(field) {

    //Getting the submission values
    var fieldValues = getSubmissionFormField(sub, field);

    //Adding the CSV values to the line.
    line += csvGeneration.generateCSVFieldValues(field, fieldValues, downloadUrl, sub);
  });

  //The generation process will always produce an extra , at the end. Can be cut off.
  line = line.slice(0, -1);
  line += '\r\n';
  return line;
};
