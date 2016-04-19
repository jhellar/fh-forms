var models = require('../../common/models.js')();
var _ = require('lodash');
var logger = require('../../common/logger.js').getLogger();
var handleListResult = require('./processListResult');
var buildQuery = require('./buildQuery');


/**
 * paginateList - Returning a paginated list of submissions.
 *
 * @param  {object} formSubmissionModel Submission Mongoose Model
 * @param  {object} params
 * @param  {object} params.query          Query to filter by.
 * @param  {object} params.paginate       Pagination parameters
 * @param  {number} params.paginate.page  Pagination page
 * @param  {number} params.paginate.limit Page to return
 * @param  {function} callback
 */
function paginateList(formSubmissionModel, params, callback) {
  var query = params.query || {};
  var paginate = params.paginate || {};
  var fieldModel = params.fieldModel;

  //Sorting can be defined by the user
  var sortBy = params.sortBy || {
    submissionCompletedTimestamp: -1
  };

  formSubmissionModel.paginate(query, {
    page: paginate.page,
    limit: paginate.limit,
    populate: {"path": "formFields.fieldId", "model": fieldModel, "select": "_id type name"},
    sortBy: sortBy,
    lean: true
  }, function(err, foundSubmissions) {
    handleListResult(err, params, foundSubmissions, callback);
  });
}

/**
 * nonPaginateList - Listing submissions without pagination
 *
 * @param  {object} formSubmissionModel Submission Mongoose Model
 * @param  {object} params
 * @param  {object} params.query          Query to filter by.
 * @param  {function} callback
 */
function nonPaginateList(formSubmissionModel, params, callback) {
  var submissionQuery = formSubmissionModel.find(params.query || {});
  var fieldModel = params.fieldModel;

  //Sorting can be defined by the user
  var sortBy = params.sortBy || {
    submissionCompletedTimestamp: -1
  };

  //If the full submission is not required, then limit the response payload size.
  if (!params.includeFullSubmission) {
    submissionQuery.select({"formSubmittedAgainst.name": 1, "_id": 1, "formId": 1, "appId": 1, "appEnvironment": 1, "formFields": 1});
  }

  submissionQuery.sort(sortBy)
  .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "_id type name"})
  //Assigning a lean query to not parse the response as a mongoose document. This is to improve query performance.
  .lean()
  .exec(function(err, foundSubmissions) {
    handleListResult(err, params, foundSubmissions, callback);
  });
}


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
 *     formId: optional formId of submissions to retrieve,
 *     paginate: {
 *       limit: 10,
 *       page: 2
       },
       sortBy: {
         param1: 1
       }
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

  var query = buildQuery(params);

  logger.debug("getSubmissionList ", {query: query, params: params});

  //Checking if the results need to be paginated
  if (params.paginate) {
    paginateList(formSubmissionModel, _.extend({
      query: query,
      fieldModel: fieldModel,
      includeFullSubmission: options.includeFullSubmission
    }, params), cb);
  } else {
    nonPaginateList(formSubmissionModel, _.extend({
      query: query,
      fieldModel: fieldModel,
      includeFullSubmission: options.includeFullSubmission
    }, params), cb);
  }
};
