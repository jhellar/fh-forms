var updateCSVExportStatus = require('./updateCSVExportStatus');
var CONSTANTS= require('../../common/constants');

module.exports = function resetCSVExportStatus(connections, callback) {
  updateCSVExportStatus(connections, {
    status: CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_RESET,
    message: "Submission CSV export reset. Please try again"
  }, callback);
};