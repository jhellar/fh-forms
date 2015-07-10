var async = require('async');
var _ = require('underscore');
var getSubmissions = require('./getSubmissions.js');
var buildErrorObject = require('../common/misc.js');
var constants = require('../common/constants.js');
var submissionsToCSV = require('./submissionExportHelper/submissionsToCSV.js').submissionsToCSV;
var logger = require('../common/logger.js').getLogger();

//Exporting A Submission/Submissions As A Zip File Containing CSV Files

module.exports = function(connections, options, searchParams, cb){
  logger.debug("exportSubmissions ", {options: options, searchParams: searchParams});
  async.waterfall([
    function getSubmissionsToExport(cb){
      getSubmissions(connections, options, searchParams, cb);
    },
    function(submissionsToExport, cb){
      //Have submissions needed to export
      logger.debug("exportSubmissions submissionsToExport", {submissionsToExport: submissionsToExport});

      submissionsToCSV({
        fieldHeader: searchParams.fieldHeader,
        submissions: submissionsToExport.submissions,
        downloadUrl: searchParams.downloadUrl
      }, cb);
    }
  ], function(err, exportedSubmissions){
      if(err){
        logger.error("exportSubmissions", {error: err});
        return cb(buildErrorObject({
          error: err,
          code: constants.ERROR_CODES.FH_FORMS_ERR_CODE_SUBMISSION_EXPORT
        }));
      }

      logger.debug("exportSubmissions exportedSubmissions", {exportedSubmissions: exportedSubmissions});

      cb(undefined, exportedSubmissions);
  });
};