var async = require('async');
var _ = require('underscore');
var validate = require('../common/validate.js');
var constants = require('../common/constants.js');
var fs = require('fs');
var path = require('path');
var buildErrorResponse = require('../common/misc.js').buildErrorResponse;
var logger = require('../common/logger.js').getLogger();
var fileCacheing = require('./pdfGeneration/cacheFiles.js');
var pdfGeneration = require('./pdfGeneration/renderPDF.js');

var getSubmission = require('./getSubmission.js');


/**
 *
 * Function for generating a PDF of a submission.
 *
 * @param connections
 * @param options
 *  - _id - The Submission Id
 *  - pdfExportDir - A folder To Cache files and PDF
 *  - downloadUrlHost - The host portion to download files. Only used for the "file" field type.
 * @param cb
 */
module.exports = function(connections, options, cb) {
  var invalid = validate(options).has("_id", "pdfExportDir");

  logger.debug("generatePDF: Submission Validation ", invalid);

  //No submission Id, no point in continuing
  if (invalid) {
    return cb(buildErrorResponse({
      error: new Error(invalid.message),
      code: constants.ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
    }));
  }

  async.waterfall(
    [
      function getSubmissionJSON(cb) {

        logger.debug("generatePDF: getSubmissionJSON ", options);

        //If there is already an existing submisison object, render this submission.
        if (_.isObject(options.existingSubmission)) {
          return cb(undefined, {
            submission: options.existingSubmission
          });
        }

        getSubmission(connections, options, {
          _id: options._id
        }, function(err, submissionJSON) {
          cb(err, {
            submission: submissionJSON
          });
        });
      },
      function getSubmissionFiles(results, cb) {
        logger.debug("generatePDF: getSubmissionFiles ", results);
        //Caches any files needed and creates local file uris to add to the submission for rendering.
        fileCacheing.mergeSubmissionFiles({
          submission: results.submission,
          connections: connections,
          options: options
        }, cb);
      },
      function renderPDF(mergedSubmission, cb) {
        logger.debug("generatePDF: renderPDF ", mergedSubmission);
        pdfGeneration.submissionToPDF({
          submission: mergedSubmission,
          connections: connections,
          options: options
        }, cb);
      }
    ],
    function(err, submissionPDFURI) {
      if (err) {
        logger.error("generatePDF: renderPDF ", {error: err});
        return cb(buildErrorResponse({
          error: err
        }));
      }

      logger.debug("generatePDF: renderPDF Finished", submissionPDFURI);

      //Now have a file location for the pdf response.

      cb(undefined, submissionPDFURI);
    }
  );


};

