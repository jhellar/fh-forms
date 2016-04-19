var async = require('async');
var _ = require('underscore');
var buildErrorObject = require('../common/misc.js');
var constants = require('../common/constants.js');
var mergeFormFields = require('./submissionExportHelper/mergeFormFields');
var processSingleSubmission = require(
  './submissionExportHelper/processSingleSubmission');
var moment = require('moment');
var logger = require('../common/logger.js').getLogger();
var models = require('../common/models')();
var csvHeaders = require('./submissionExportHelper/csvHeaders');

/**
 * generateQuery - Small utility function to generate a submission query
 *
 * @param  {type} query        exiting query to update
 * @param  {object} searchParams         Submission Paramters To Search By
 * @param  {array} searchParams.formId   Array of form IDs to search for
 * @param  {array} searchParams.subid   Array of submission IDs to search for
 * @param  {array} searchParams.appId   Array of Project IDs to search for
 * @return {object}              generated query
 */
function generateQuery(query, searchParams) {
  //Filter by formId if required.
  if (searchParams.formId) {
    query.formId = {
      "$in": _.isArray(searchParams.formId) ? searchParams.formId : [searchParams.formId]
    };
  }

  //Filter by submission ID if required
  if (searchParams.subid) {
    query._id = {
      "$in": _.isArray(searchParams.subid) ? searchParams.subid : [searchParams.subid]
    };
  }

  //Filter by Project ID if required
  if (searchParams.appId) {
    query.appId = {
      "$in": _.isArray(searchParams.appId) ? searchParams.appId : [searchParams.appId]
    };
  }

  return query;
}



/**
 * buildCompositeForm - Building a merged list of fields based on the
 *
 * @param  {Model} formSubmissionModel The Submission mongoose Model
 * @param  {string} formId              The ID of the form to search for
 * @param  {object} singleFormQuery     A mongo query to find all of the submissions to search for
 * @param  {function} cb
 */
function buildCompositeForm(formSubmissionModel, formId, singleFormQuery, cb) {
  var mergedFields = {};
  mergedFields[formId] = {};

  var mapReduceOptions = {
    map: function() {
      //The only difference will be the "lastUpdated" timestamp.
      emit(this.formSubmittedAgainst.lastUpdated, this.formSubmittedAgainst); // eslint-disable-line no-undef
    },
    reduce: function(lastUpdatedTimestamp, formEntries) {
      //Only want one of each form definition for each different timestamp
      var formEntry = formEntries[0];

      //Only need the pages, _id and name
      if (formEntry && formEntry.pages) {
        return {
          _id: formEntry._id,
          name: formEntry.name,
          pages: formEntry.pages
        };
      } else {
        return null;
      }
    },
    query: singleFormQuery
  };

  formSubmissionModel.mapReduce(mapReduceOptions, function(err, subFormsSubmittedAgainst) {
    if (err) {
      logger.error("Error Using mapReduce ", err);
      return cb(err);
    }

    var formName;

    _.each(subFormsSubmittedAgainst, function(subFormSubmittedAgainst) {
      formName = formName || subFormSubmittedAgainst.value.name;
      mergedFields[formId] = mergeFormFields(mergedFields[formId] || {}, subFormSubmittedAgainst.value);
    });

    return cb(null, mergedFields, formName);
  });
}


/**
 * buildCSVsForSingleMergedForm - Building a CSV representation of a submission based on the merged definiton of all of the versions of the form it was submitted against.
 *
 * @param  {Model}  formSubmissionModel The Submission mongoose Model
 * @param  {type}   params
 * @param  {string} params.formId
 * @param  {string} params.date       Formatted date of export
 * @param  {string} params.formName   Form Name
 * @param  {object} params.mergedFields Set of merged field defintions
 * @param  {string} params.fieldHeader  Field header to use for export
 * @param  {object} params.singleFormQuery Query to search for submissions based in a form ID
 * @param  {string} params.downloadUrl  The downloadUrl template to use when generating submission file URLs.
 * @param  {type} cb
 */
function buildCSVsForSingleMergedForm(formSubmissionModel, params, cb) {
  var formId = params.formId;
  var formName = params.formName;
  var date = params.date;
  var mergedFields = params.mergedFields;
  var fieldHeader = params.fieldHeader;
  var singleFormQuery = params.singleFormQuery;
  var downloadUrl = params.downloadUrl;

  var fullSubmissionCSVString = "";
  //Form Name might not be unique but the ID will always be.
  var fileName = date + "-" + formId + "-" + (formName.split(' ').join('_'));
  //Query the submissions for the formId
  //LEAN
  //Select only the metadata and formFields in the submission.
  // Stream response
  // Build CSV string for each entry.
  // Add to the zip file.
  cb = _.once(cb);

  //First, generate headers.
  fullSubmissionCSVString = csvHeaders.generateCSVHeaders(_.keys(mergedFields[formId]), mergedFields[formId], fieldHeader);

  var submissionQueryStream = formSubmissionModel.find(singleFormQuery).select({
    "formSubmittedAgainst.pages": 0,
    "formSubmittedAgainst.pageRules": 0,
    "formSubmittedAgainst.fieldRules": 0
  }).lean().stream();

  submissionQueryStream.on('data', function addSubmissionToCSV(submissionJSON) {
    //Merge the form fields
    fullSubmissionCSVString += processSingleSubmission({
      mergedFields: mergedFields,
      submission: submissionJSON,
      date: date,
      fieldHeader: fieldHeader,
      downloadUrl: downloadUrl
    });
  }).on('error', function(err) {
    logger.error("Error streaming submissions ", err);
    return cb(err);
  }).on('close', function() {
    return cb(undefined, {
      formId: formId,
      fileName: fileName,
      csvString: fullSubmissionCSVString
    });
  });
}

/**
 * buildCSVsForSingleForm - Generating the full CSV file for a single form.
 *
 * @param  {object} formSubmissionModel description
 * @param  {object} params
 * @param  {string} params.formId
 * @param  {string} params.date          Formatted date of export
 * @param  {object} params.searchParams         Submission Paramters To Search By
 * @param  {array} params.searchParams.formId   Array of form IDs to search for
 * @param  {array} params.searchParams.subid   Array of submission IDs to search for
 * @param  {array} params.searchParams.appId   Array of Project IDs to search for
 * @param  {string} params.searchParams.fieldHeader   Field header to use (fieldName or fieldCode)
 * @param  {string} params.searchParams.downloadUrl   URL to use for file downloads
 * @param  {type} callback
 * @return {type}
 */
function buildCSVsForSingleForm(formSubmissionModel, params, formId, callback) {
  logger.debug("buildCSVsForSingleForm", params, formId);
  var date = params.date;
  var searchParams = params.searchParams || {};
  var fieldHeader = searchParams.fieldHeader;
  var downloadUrl = searchParams.downloadUrl || "";

  formId = formId.toString();

  var singleFormQuery = generateQuery({
    formId: formId,
    status: "complete"
  }, _.omit(searchParams, 'formId'));

  async.waterfall([
    async.apply(buildCompositeForm, formSubmissionModel, formId, singleFormQuery),
    function buildSubmissionCSVForSingleForm(mergedFields, formName, cb) {
      buildCSVsForSingleMergedForm(formSubmissionModel, {
        date: date,
        fieldHeader: fieldHeader,
        downloadUrl: downloadUrl,
        mergedFields: mergedFields,
        formName: formName,
        formId: formId,
        singleFormQuery: singleFormQuery
      }, cb);
    }
  ], callback);
}

/**
 * module - Exporting A Submission/Submissions As A Zip File Containing CSV Files
 *
 * @param  {object} connections  mongo and mongoose connections
 * @param  {object} options      Mongo connection Options
 * @param  {object} searchParams params to search by
 * @param  {array} searchParams.formId   Array of form IDs to search for
 * @param  {array} searchParams.subid   Array of submission IDs to search for
 * @param  {array} searchParams.appId   Array of Project IDs to search for
 * @param  {string} searchParams.downloadUrl   Download url to use for files
 * @param  {string} searchParams.fieldHeader   Field header to use (fieldName or fieldCode)
 * @param  {object} callback
 * @return {type}
 */
module.exports = function(connections, options, searchParams, callback) {
  logger.debug("exportSubmissions ", {
    searchParams: searchParams
  });
  var formSubmissionModel = models.get(connections.mongooseConnection, models
    .MODELNAMES.FORM_SUBMISSION);
  var date = moment().format("YYYY-MM-DD-hh-mm");

  searchParams = searchParams || {};
  var query = generateQuery({status: "complete"}, searchParams);

  async.waterfall([
    function findDistinctFormIds(cb) {
      //Querying for all of the "unique" form IDs available in submissions.
      formSubmissionModel.find(query).distinct('formId', function(err, formIds) {
        if (err) {
          logger.error(
            "Error finding distinct form IDs for submissions", err);
        }

        return cb(err, formIds || []);
      });
    },
    function buildCSVsForSingleForms(formIds, cb) {
      //Go through each of the submissions (stream) to generate each individual CSV entry
      async.map(formIds, async.apply(buildCSVsForSingleForm, formSubmissionModel, {
        date: date,
        searchParams: searchParams,
        query: query
      }), cb);
    }
  ], function(err, exportedSubmissions) {
    if (err) {
      logger.error("Error Exporting Submissions", {
        error: err
      });
      return callback(buildErrorObject({
        error: err,
        code: constants.ERROR_CODES.FH_FORMS_ERR_CODE_SUBMISSION_EXPORT
      }));
    }

    var res = {};
    _.each(exportedSubmissions, function(exportDetails) {
      res[exportDetails.fileName] = exportDetails.csvString;
    });

    callback(undefined, res);
  });
};
