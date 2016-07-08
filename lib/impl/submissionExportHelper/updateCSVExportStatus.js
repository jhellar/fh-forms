var logger = require('../../common/logger.js').getLogger();
var CONSTANTS= require('../../common/constants');
var getCSVExportStatusCollection = require('./getCSVExportStatusCollection');
var _ = require('underscore');
var async = require('async');


/**
 * Utility function to update the status of a Submission CSV Export.
 * @param connections
 * @param statusToUpdate
 * @param callback
 */
module.exports = function updateCSVExportStatus(connections, statusToUpdate, callback) {

  callback = callback || _.noop;
  logger.debug(statusToUpdate, "updateCSVExportStatus");

  statusToUpdate = statusToUpdate || {};

  statusToUpdate = _.defaults(statusToUpdate, {
    status: CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_INPROGRESS,
    message: "Preparing submission CSV export",
    error: undefined
  });

  async.waterfall([
    async.apply(getCSVExportStatusCollection, connections),
    function updateSubmissionStatus(collection, cb) {
      collection.findOneAndUpdate({status: {"$ne" : CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_RESET}}, { $set: statusToUpdate}, {
        returnOriginal: false
      }, function(err, updatedCSVStatus) {
        if (err) {
          logger.error({error: err}, "Error updating csvExportStatus document");
        }

        updatedCSVStatus = updatedCSVStatus || {};

        return cb(err, updatedCSVStatus.value);
      });
    }
  ], callback);
};