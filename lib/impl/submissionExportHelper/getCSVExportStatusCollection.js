var logger = require('../../common/logger.js').getLogger();
var CONSTANTS= require('../../common/constants');

module.exports = function getExportCollection(connections, cb) {
  connections.databaseConnection.collection(CONSTANTS.SUBMISSION_CSV_EXPORT.COLLECTION_NAME, function(err, collection) {
    if (err) {
      logger.error({error: err}, "Error getting " + CONSTANTS.SUBMISSION_CSV_EXPORT.COLLECTION_NAME + " collection");
    }

    return cb(err, collection);
  });
};