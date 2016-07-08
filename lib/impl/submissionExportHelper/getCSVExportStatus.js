var logger = require('../../common/logger.js').getLogger();
var findCSVExportStatus = require('./findCSVExportStatus');

module.exports = function getCSVExportStatus(connections, callback) {
  //There is only one csvExport status per environment. This document serves as a lock to ensure more than one
  //CSV export does not run at the same time.
  findCSVExportStatus(connections, function(err, csvExportStatus) {
    if (err) {
      logger.error({error: err}, "Error finding csvExportStatus document");
      return callback(err);
    }

    //There should be an export status available.
    if (!csvExportStatus) {
      var msg = "No Submission CSV Export Status Exists";
      logger.warn(msg);
      return callback(msg);
    }

    return callback(undefined, csvExportStatus);
  });
};