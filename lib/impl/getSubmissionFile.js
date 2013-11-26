var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var MongoFileHandler = require('fh-gridfs').MongoFileHandler;

var defaultLogger = {
  error:   function() { console.log("ERROR", arguments); }, 
  warning: function() { console.log("WARNING", arguments); },
  info:    function() { console.log("INFO", arguments); },
  trace:   function() { console.log("TRACE", arguments); },
  debug:   function() { console.log("DEBUG", arguments); }
}

// forms.getSubmissionFile(commections, {"uri": mongoUrl, fileStorage:{}, logger:{}}, {"_id" : req.params.fileGroupId}, function(err, result){
module.exports = function getSubmissionFile(connections, options, params, cb) {
  var fileStorageConfig = options.fileStorage;
  var logger = options.logger || defaultLogger;

  logger.trace({options: options, params: params, func: 'getSubmissionFile'}, 'In getSubmissionFile()');
  var fileHandler = new MongoFileHandler(fileStorageConfig, logger);
  fileHandler.streamFile(
    connections.databaseConnection,
    {"groupId":params._id, "length": true},
    {}, // fileOptions (e.g. get thumbnail)
    function (err, str, length) { //Note, all file streams are paused when created in the file handler
      logger.trace({err: err, length: length, func: 'getSubmissionFile'}, 'In streamFileCallback');

      if (err) return cb(err);
      res = {
        stream: str,
        type: "application/octet-stream",
        length: length
      };
      return cb(undefined, res);
    });
};
