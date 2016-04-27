var _ = require('underscore');
var mongoose = require('mongoose');
var CONSTANTS = require('../../common/constants');


/**
 * buildSingleFilterQueryObject - Building a query object based on the field to be queried
 *
 * @param  {string} paginationFilter     Filter value
 * @return {object}                      Generated Query for the field
 */
function buildSingleFilterQueryObject(paginationFilter) {
  return function(submissionQueryField) {
    var fieldQuery = {
    };

    //formId and _id fields are ObjectIds. They must be valid in order to search for them.
    if (submissionQueryField === 'formId' || submissionQueryField === '_id') {
      if (mongoose.Types.ObjectId.isValid(paginationFilter)) {
        //Cannot use $regex when searching for ObjectIDs
        fieldQuery[submissionQueryField] = new mongoose.Types.ObjectId(paginationFilter);
      } else {
        //not a valid objectId, don't want to search for it.
        return null;
      }
    } else {
      fieldQuery[submissionQueryField] = {$regex: paginationFilter, $options: 'i'};
    }

    return fieldQuery;
  };
}

/**
 * buildQuery - Building submissions query from parameters. Only searching for completed submissions when listing.
 *
 * @param  {object}   params
 * @param  {string}   params.appId          Project ID to filter submissions by
 * @param  {string}   params.paginate       Pagination Params
 * @param  {string}   params.paginate.filter Optional string to filter by
 * @param  {string/Array}   params.formId   Single or Array of form IDs to filter submissions by
 * @param  {string/Array}   params.subid    Single or Array of submission IDs to filter submissions by
 * @return {object}   Generated mongo query
 */
module.exports = function buildQuery(params) {
  params = params || {};
  var paginationFilter = params.paginate && params.paginate.filter ? params.paginate.filter : false;
  var query = {
    "status": CONSTANTS.SUBMISSION_STATUS.COMPLETE
  };

  //Checking if the formId needs to be mapped to its id instead of a full form object.
  if (params.formId) {
    params.formId = _.isArray(params.formId) ? params.formId : [params.formId];
    params.formId = _.map(params.formId, function(form) {
      if (typeof(form) === "object") {
        return form._id;
      } else {
        return form;
      }
    });
    query.formId = {
      "$in": params.formId
    };
  }

  //Filter by submission ID if required
  if (params.subid) {
    query._id = {
      "$in": _.isArray(params.subid) ? params.subid : [params.subid]
    };
  }

  //Filter by Project ID if required
  if (params.appId) {
    query.appId = {
      "$in": _.isArray(params.appId) ? params.appId : [params.appId]
    };
  }

  // Pagination filters allow for searching in submission metadata
  // Don't want to search for empty string
  if (paginationFilter && _.isString(paginationFilter)) {
    query['$or'] = _.compact(_.map(CONSTANTS.SUBMISSIONS_FILTER_FIELDS, buildSingleFilterQueryObject(paginationFilter)));
  }

  return query;
};
