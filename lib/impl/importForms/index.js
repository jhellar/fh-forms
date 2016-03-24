var async = require('async');
var fs = require('fs');
var mongoose = require('mongoose');
var fileInspector = require('mmmagic'),
    Magic = fileInspector.Magic;
var mimeInspector = new Magic(fileInspector.MAGIC_MIME_TYPE);
var mkdirp = require('mkdirp');
var unzipFile = require('./unzipFile');
var logger = require('../../common/logger').getLogger();
var validate = require('../../common/validate.js');
var ZIP_FILE_PATH = 'zipFilePath';
var WORKING_DIR = 'workingDir';


/**
 * checkWorkingDir - Checking that the working directory exists and is a directory.
 *
 * @param  {string} workingDir Path to the working directory
 * @param  {function} cb
 */
function checkWorkingDir(workingDir, cb){
  fs.stat(workingDir, function(err, stats){
    var errMessage;
    if(err){
      errMessage = "The directory " + workingDir + " does not exist.";
      logger.error(errMessage);
      return cb(errMessage);
    }

    //Checking that it is a directory
    if(!stats.isDirectory()){
      errMessage = "Expected " + workingDir + " to be a directory";
      logger.error(errMessage);
      return cb(errMessage);
    }

    return cb();
  });
}


/**
 * checkZipFile - Checking that the file exists and is a zip file.
 *
 * @param  {string} zipFilePath Path to the zip file.
 * @param  {function} cb      description
 */
function checkZipFile(zipFilePath, cb){
  //Checking that it is a ZIP file
  mimeInspector(zipFilePath, function(err, fileMimetype){
    var errMessage;
    if(err){
      logger.error("Error detecting ZIP file", err);
      return cb(err);
    }

    if(fileMimetype !== 'application/zip'){
      errMessage = "Expected the file MIME type to be application/zip but was " + fileMimetype;
      logger.error(errMessage)
    }

    return cb(errMessage);
  });
}

/**
 * importForms - Importing Form Definitions From A ZIP File.
 *
 * The ZIP file will be unzipped to a working directory where the forms will be imported from.
 *
 * @param  {object} connections
 * @param  {object} connections.mongooseConnection The Mongoose Connection
 * @param  {object} params
 * @param  {string} params.zipFilePath  A Path to a ZIP file on the file system.
 * @param  {string} params.workingDir A Path to a directory where the zip file can be unzipped to.
 * @param  {function} callback
 * @return {type}
 */
function importForms(connections, params, callback){
  params = params || {};

  logger.debug("Importing Forms ", params);

  //Validating
  var paramsValidator = validate(params);
  var failed = paramsValidator.has(ZIP_FILE_PATH, ZIP_FILE_PATH);

  if(failed){
    return callback("Validation Failed " + failed[ZIP_FILE_PATH] || failed[WORKING_DIR]);
  }

  //Random directory name.
  var newDirectoryName = (new mongoose.Types.ObjectId()).toString();
  var unzipDirectoryPath = params.workingDir + "/" + newDirectoryName;

  async.waterfall([
    function checkFiles(cb){
      async.parallel([
        async.apply(checkWorkingDir, params.workingDir),
        async.apply(checkZipFile, params.zipFilePath)
      ], function(err){
        //Not interested in passing any of the results from the aync.parallel to the waterfall callback
        cb(err);
      });
    },
    function createUniqueDirToUnzipTo(cb){
      //Need to create a new directory
      mkdirp(unzipDirectoryPath, function(err){
        return cb(err);
      });
    },
    async.apply(unzipFile, {
      zipFilePath: params.zipFilePath,
      workingDir: params.workingDir,
      queueConcurrency: 5
    })
  ], function(err){
    if(err){
      logger.error("Error Importing Forms ", err);
    }

    //TODO: Cleaning up all files created.
    return callback(err);
  });
}

module.exports = {
  importForms: importForms
};
