var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');

/**
 * Checks that the received file is a wellformed json
 * @param {string} filePath path to the JSon file
 * @param {function} cb callback
 */
function validateJSonStructure(filePath, cb) {
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return cb(err);
    }

    try {
      var jsonObject = JSON.parse(data);
      cb(null, jsonObject);
    } catch (e) {
      cb('Invalid JSON file: ' + path.basename(filePath));
    }
  });
}

/**
 * Validates the metadata.json file
 *
 * @param {string} metadataPath path to themetadata.json file
 * @param {function} cb callback
 */
function validateMetadata(metadataPath, cb) {
  validateJSonStructure(metadataPath, function(err, metadataObject) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, metadataObject.files);
    }
  });
}

/**
 * Validate the received form file.
 *
 * @param {string} form path to the form file to be validated
 * @param {function} cb callback
 */
function validateForm(form, cb) {

  async.series([function(callback) {
    fs.exists(form, function(exists) {
      if (exists) {
        callback(null);
      }
      else {
        callback('File ' + path.basename(form) + ' referenced by metadata.json does not exists');
      }
    });
  },
    function(callback) {
      validateJSonStructure(form, callback);
    }
  ], function(err, data) {
    cb(err, data);
  });
}

/**
 * Validates the content of the extracted ZIP to check that it is a valid archive to be imported.
 *
 * @param {string} archiveDirectory The directory where the ZIP archive has been unzipped
 * @param {boolean} strict if true, strict checks must be performed: no extraneous files will be
 * admitted.
 * @param {function} cb callback
 */
function validate(archiveDirectory, strict, cb) {
  // Root validation checks
  fs.readdir(archiveDirectory, function(err, files) {
    if (err) {
      return cb(err);
    }

    if (files.length < 2 || (files.length !== 2 && strict)) {
      return cb('Root directory must contain exactly one metadata file and one forms directory');
    }

    if (files.indexOf('forms') === -1) {
      return cb('A forms directory should be present in the root of the zip file');
    }

    if (files.indexOf('metadata.json') === -1) {
      return cb('A metadata.json file must be present in the root of the zip file');
    }

    var metadataPath = path.join(archiveDirectory, 'metadata.json');

    async.waterfall([
      function(callback) {
        validateMetadata(metadataPath, function(err, formFiles) {
          callback(err, formFiles);
        });
      },
      function(formFiles, callback) {
        var forms = [];

        _.each(formFiles, function(formFile) {
          forms.push(path.join(archiveDirectory, formFile.path));
        });

        async.each(forms, validateForm, callback);
      }
    ], function(err) {
      cb(err);
    });
  });
}

module.exports = validate;