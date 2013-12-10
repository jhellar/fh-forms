var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

/*
 * deleteSubmission(connections, options, appId, cb) *
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
 *   cb - callback function (err)
  */
module.exports = function deleteSubmission(connections, options, params, cb) {
  var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  formSubmissionModel
  .findOne({"_id" : params._id, "status": "complete"})   // TODO - Q for code review - should this be complete?
  .remove()
  .exec(cb);
};
