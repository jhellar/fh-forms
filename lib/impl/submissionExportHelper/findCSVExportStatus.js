

var logger = require('../../common/logger.js').getLogger();
var getCSVExportStatusCollection = require('./getCSVExportStatusCollection');
var async = require('async');

module.exports = function findCSVExportStatus(connections, callback) {
  async.waterfall([
    async.apply(getCSVExportStatusCollection, connections),
    function findStatus(collection, cb) {

      //There is only one csvExport status per environment. This document serves as a lock to ensure more than one
      //CSV export does not run at the same time.
      collection.find().limit(1).next(function(err, csvExportStatus) {
        if (err) {
          logger.error({error: err}, "Error finding csvExportStatus document");
        }

        return cb(err, csvExportStatus);
      });
    }
  ], callback);
};