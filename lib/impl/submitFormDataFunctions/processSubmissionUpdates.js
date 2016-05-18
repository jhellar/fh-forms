var _ = require('underscore');

module.exports = function processSubmissionUpdates(formSubmission, submissionData) {
  formSubmission.formSubmittedAgainst = formSubmission.formSubmittedAgainst || {};
  var allFields = _.map(formSubmission.formSubmittedAgainst.pages, function(page) {
    return page.fields || [];
  });

  allFields = _.compact(_.flatten(allFields));

  // update
  _.each(allFields, function(fieldDef) {
    var updatedFieldData = _.find(submissionData.formFields, function(updatedField) {
      return updatedField.fieldId.toString() === fieldDef._id.toString();
    });

    var existingFieldData = _.find(formSubmission.formFields, function(existingField) {
      return existingField.fieldId.toString() === fieldDef._id.toString();
    });


    //If there is no data to apply to this field, then don't do it.
    if (!updatedFieldData && !existingFieldData) {
      return;
    }

    existingFieldData = existingFieldData || updatedFieldData;
    existingFieldData.fieldValues = updatedFieldData ? updatedFieldData.fieldValues : existingFieldData.fieldValues;

    //If it is a mongoose document, make sure any field values are updated when the submission is saved.
    if (_.isFunction(existingFieldData.markModified)) {
      existingFieldData.markModified('fieldValues');
    } else {
      //If it's not a mongoose documents, just need to add the new values.
      formSubmission.formFields.push(existingFieldData);
    }
  });

  return formSubmission;
};