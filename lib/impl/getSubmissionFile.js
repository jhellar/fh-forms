var MongoFileHandler = require('fh-gridfs').MongoFileHandler;
var logger = require('../common/logger.js').getLogger();

/*
 * getSubmissionFile(connections, options, appId, cb) *
 *   connections: {
 *     mongooseConnection: ...
 *     databaseConnection: ...
 *   }
 *
 *   options: {
 *     uri: db connection string,
 *     fileStorage: optional config to be passed to MongoFileHandler,
 *     logger: optional logger to be passed to MongoFileHandler
 *   }
 *   params: {
 *     _id: file group ID of file to retrieve
 *   }
 *   cb - callback function (err, result)
 *      result: {
 *         stream: stream for the file
 *         type: "application/octet-stream",
 *         length: length of the file in bytes
 *      }
 */
module.exports = function getSubmissionFile(connections, options, params, cb) {
  var fileHandler = new MongoFileHandler(options.fileStorage, logger); // optional params, don't need to be specified
  fileHandler.streamFile(
    connections.databaseConnection,
    {"groupId":params._id, "length": true},
    {}, // fileOptions (e.g. get thumbnail)
    function(err, str, fileDetails) {
      if (err) return cb(err);

      var res = {
        stream: str,
        type: fileDetails.contentType,
        length: fileDetails.length,
        name: fileDetails.filename
      };
      return cb(undefined, res);
    });
};
