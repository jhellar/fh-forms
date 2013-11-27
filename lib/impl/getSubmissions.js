var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var FIELD_TYPES_INCLUDED_IN_SUMMARY = ["text", "textarea", "number", "emailAddress", "dropdown", "radio", "dateTime"];
var NUM_FIELDS_INCLUDED_IN_SUMMARY = 3;


// forms.getSubmissions({"uri": mongoUrl}, {"appId" : req.params.appId, "formId": req.params.formId}, function(err, results){
module.exports = function getSubmissionList(connections, options, params, cb) {
  var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  var query = {
    "status": "complete"
  };
  if (params.appId) {
    query.appId = params.appId;
  }
  if (params.formId) {
    query.formId = params.formId;
  }

  formSubmissionModel
  .find(query)
  .sort({submissionStartedTimestamp: -1})
  .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
  .exec(function(err, foundSubmissions){
    if(err) return cb(err);
    var retSubmissions = [];
    async.eachSeries(
      foundSubmissions,
      function(item, cb) {
        var submission = JSON.parse(JSON.stringify(item));
        restrictSubmissionForSummary(submission, function (err, restrictedSubmission) {
          retSubmissions.push(restrictedSubmission);
          return cb();          
        });
      }, function (err) {
        if (err) return cb(err);
        return cb(undefined, {submissions: retSubmissions});
      }
    );
  });
};

function restrictSubmissionForSummary(submission, cb) {
  var formFields = submission.formFields;
  var restrictedFormFields = [];
  delete submission.formFields;
  submission.formFields = restrictedFormFields;
  async.eachSeries(formFields, function (formField, cb) {
    var finishFlag;
    if(FIELD_TYPES_INCLUDED_IN_SUMMARY.indexOf(formField.fieldId.type) >= 0) {
      restrictedFormFields.push(formField);
      if(restrictedFormFields.length === NUM_FIELDS_INCLUDED_IN_SUMMARY) {
        finishFlag = "limit reached";
      }
    }
    return cb(finishFlag);
  }, function (err) {
    var retErr = err;
    
    if (retErr && retErr === "limit reached") {
      retErr = undefined;
    }
    if(retErr) return cb(retErr);

    return cb(undefined, submission);          
  });
};
