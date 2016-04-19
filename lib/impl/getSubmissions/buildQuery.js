var _ = require('underscore');

/**
 * buildQuery - Building submissions query from parameters. Only searching for completed submissions when listing.
 *
 * @param  {object}   params
 * @param  {string}   params.appId          Project ID to filter submissions by
 * @param  {string/Array}   params.formId   Single or Array of form IDs to filter submissions by
 * @param  {string/Array}   params.subid    Single or Array of submission IDs to filter submissions by
 * @return {object}   Generated mongo query
 */
module.exports = function buildQuery(params) {
  params = params || {};
  var query = {
    "status": "complete"
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

  return query;
};
