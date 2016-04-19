var path = require('path');
var _ = require('lodash');
var async = require('async');
var logger = require('../../common/logger').getLogger();
var updateFormsImpl = require('../updateForm');

var METADATA_FILE_NAME = "metadata.json";
var PARALLEL_IMPORT_LIMIT = 5;

/**
 * Returns an array that contains the form file paths
 * @param  {String} metaDataFilePath the path to the unzipped form meta data file
 * @return {Array}  an array that contains the relative paths of the form files
 */
function getFormFiles(metaDataFilePath) {
  var formsZipMetaData = require(metaDataFilePath);
  if (formsZipMetaData && formsZipMetaData.files) {
    var formFiles = formsZipMetaData.files;
    return _.map(formFiles, function(formDetails) {
      return formDetails.path;
    });
  } else {
    return [];
  }
}

/**
 * Import the forms data from the given directory.
 * The directory should at least contain a metadata.json file to describe it's structure.
 * Note this will validate the given directorty. The validation process should be done already before this function is being used.
 * @param  {object}   connections   the mongo db connections
 * @param  {string}   unzipDirPath  the path to the directory that contains the form data
 * @param  {Function} cb            the callback function
 */
module.exports = function(connections, unzipDirPath, cb) {
  var metaDataFilePath = path.join(unzipDirPath, METADATA_FILE_NAME);
  var formFiles = getFormFiles(metaDataFilePath);
  if (formFiles.length > 0) {
    logger.info('Importing form data from ' + unzipDirPath);
    var importOpts = {createIfNotFound: true};
    async.mapLimit(formFiles, PARALLEL_IMPORT_LIMIT, function(formRelativePath, updateCb) {
      var formFullPath = path.join(unzipDirPath, formRelativePath);
      var formData = require(formFullPath);
      if (formData) {
        updateFormsImpl(connections, importOpts, formData, updateCb);
      } else {
        return updateCb('Failed to read form data at ' + formFullPath);
      }
    }, function(err, importedForms) {
      if (err) {
        logger.error('Failed to import form data at ' + unzipDirPath, err);
        return cb(err);
      } else {
        logger.info('Form data imported successfully: ' + unzipDirPath);
        return cb(null, importedForms);
      }
    });
  } else {
    logger.info('No forms data to import at ' + unzipDirPath);
    return cb(null, []);
  }
};