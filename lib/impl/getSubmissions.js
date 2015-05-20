var models = require('../common/models.js')();
var groups = require('./groups.js');
var async = require('async');
var _ = require('lodash');
var logger = require('../common/logger.js').getLogger();

var FIELD_TYPES_INCLUDED_IN_SUMMARY = ["text", "textarea", "number", "emailAddress", "dropdown", "radio", "dateTime"];
var NUM_FIELDS_INCLUDED_IN_SUMMARY = 3;

/*
 * getSubmissions(connections, options, appId, cb) *
 *   connections: {
 *     mongooseConnection: ...
 *   }
 *
 *   options: {
 *     uri: db connection string,
 *   }
 *   params: {
 *     appId: optional appId of submissions to retrieve,
 *     formId: optional formId of submissions to retrieve
 *   }
 *   cb - callback function (err, result)
 *      result: {
 *        submissions: []    // array of submissions
 *      }
 */
module.exports = function getSubmissionList(connections, options, params, cb) {
  logger.debug("getSubmissionList ", {options: options, params: params});
  var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);
  var formModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
  var restrictToUser = options.restrictToUser;

  var query = {
    "status": "complete"
  };

  //Checking if the formId needs to be mapped to its id instead of a full form object.
  if(params.formId){
    params.formId = (params.formId instanceof Array) ? params.formId : [params.formId];
    params.formId = _.map(params.formId, function(form){
      if(typeof(form) === "object"){
        return form._id;
      } else {
        return form;
      }
    });
  }

  logger.debug("getSubmissionList ", {options: options, params: params});

  async.waterfall([
    function (cb) {
      if (params.appId) {  // if appid specified then ensure user is allowed access
        query.appId = params.appId;
        return groups.validateAppAllowedForUser(connections, restrictToUser, params.appId, function(err) {
          return cb(err);
        });
      } else {  // restrict to particular allowed apps
        groups.getAppsForUser(connections, restrictToUser, function (err, allowedApps) {
          if (err) return cb(err);
          if (allowedApps) {
            query.appId = {$in: allowedApps};
          }
          return cb();
        });
      }
    },
    function (cb) {
      if (params.formId) {
        var formIds = (params.formId instanceof Array) ? params.formId : [params.formId];
        query.formId = {$in :formIds};
        groups.validateFormAllowedForUser(connections, restrictToUser, params.formId, cb);
      } else {  // restrict to particular allowed forms
        groups.getFormsForUser(connections, restrictToUser, function (err, allowedForms) {
          if (err) return cb(err);
          if (allowedForms) {
            query.formId = {$in: allowedForms};
          }
          return cb();
        });
      }
    },
    function (cb){
      if(params.subid && params.subid instanceof Array){
        //formId and appId will already be populated if they are needed.
        query._id = {$in:params.subid};
      }
      return cb();
    }
  ], function (err) {
    if (err) {
      logger.error("getSubmissions ", {error: err});
      return cb(err);
    }

    logger.debug("getSubmissionList ", {query: query});

    formSubmissionModel
    .find(query)
    .sort({submissionStartedTimestamp: -1})
    .populate({"path": "formId", "model": formModel, "select": "name"})
    .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
    .exec(function(err, foundSubmissions){
      if(err) {
        logger.error("getSubmissions find", {error: err});
        return cb(err);
      }

        logger.debug("getSubmissionList find", {foundSubmissions: foundSubmissions});

      var retSubmissions = _.map(foundSubmissions, function(submissionDocument){
        var submission = submissionDocument.toJSON();
        submission._id = submission._id.toString();

        submission = reformatFormIdAndName(submission);

        //Do not want to restrict the submission for summary display. Return the full submission
        if (params.wantRestrictions === false) {
          return submission;
        }

        submission = restrictSubmissionForSummary(submission);

        return submission;
      });

        return cb(undefined, {submissions: retSubmissions});
    });
  });

  function reformatFormIdAndName(submission) {
    var formName = "Unknown";
    var formId = "Unknown";
    if(submission && submission.formId && submission.formId.name) {
      formName = submission.formId.name;
    }
    if(submission && submission.formId && submission.formId._id) {
      formId = submission.formId._id.toString();
    }
    submission.formName = formName;
    submission.formId = formId;
    return submission;
  }
};

/**
 * Only Includes Fields In The Summary
 * @param submission
 * @returns {Object}
 */
function restrictSubmissionForSummary(submission) {
  submission.formFields = _.filter(submission.formFields, function (formField) {
    return FIELD_TYPES_INCLUDED_IN_SUMMARY.indexOf(formField.fieldId.type) >= 0;
  });

  submission.formFields = _.first(submission.formFields, NUM_FIELDS_INCLUDED_IN_SUMMARY);

  return submission;
}
