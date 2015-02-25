var async = require('async');
var _ = require('underscore');
var getSubmissions = require('./getSubmissions.js');
var buildErrorObject = require('../common/misc.js');
var constants = require('../common/constants.js');
var submissionsToCSV = require('./submissionExportHelper/submissionsToCSV.js');

//Exporting A Submission/Submissions As A Zip File Containing CSV Files

module.exports = function(connections, options, searchParams, cb){
  async.waterfall([
    function getSubmissionsToExport(cb){
      getSubmissions(connections, options, searchParams, cb);
    },
    function(submissionsToExport, cb){
      //Have submissions needed to export

      submissionsToCSV({
        fieldHeader: searchParams.fieldHeader,
        submissions: submissionsToExport,
        downloadUrl: options.downloadUrl
      }, cb);
    }
  ], function(err, exportedSubmissions){
      if(err){
        return cb(buildErrorObject({
          error: err,
          code: constants.ERROR_CODES.FH_FORMS_ERR_CODE_SUBMISSION_EXPORT
        }));
      }

      cb(undefined, exportedSubmissions);
  });
};