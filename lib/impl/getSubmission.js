var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var groups = require('./groups.js');
var _ = require('underscore');
var FILE_UPLOAD_URL = "/api/v2/forms/submission/file/"; //note this is used here as we need to use the jquery fileupload plugin
var async = require('async');

/*
 * getSubmission(connections, options, appId, cb) *
 *   connections: {
 *     mongooseConnection: ...
 *     databaseConnection: ... *   }
 *
 *   options: {
 *     uri: db connection string,
 *   }
 *   params: {
 *     _id: submission ID of submission to retrieve
 *   }
 *   cb - callback function (err, result)
 *      result: { // submission
 *      }
 */
module.exports = function getSubmission(connections, options, params, cb) {
  var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  formSubmissionModel
  .findOne({"_id" : params._id, "status": "complete"})
  .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
  .exec(function(err, foundSubmission){
    if(err) return cb(err);

    if(foundSubmission === null){
      return cb(new Error("Completed submission with id " + params._id + " not found"));
    }

    groups.validateFormAllowedForUser(connections, options.restrictToUser, foundSubmission.formId.toString(), function(err) {
      if(err) return cb(err);
      return cb(undefined, foundSubmission.toJSON());
    });
  });

};
