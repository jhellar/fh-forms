var forms = require('../forms.js');
var _ = require('underscore');
var archiver = require('archiver');
var submissionsHandler = require('./resultHandlers.js');
var constants = require('../common/constants.js').MIDDLEWARE;
var fs = require('fs');
var logger = require('../common/logger.js').getLogger();

function _getSubmissionsResultHandler(req, next) {
  return function(err, getSubmissionResponse) {
    getSubmissionResponse = getSubmissionResponse || {};
    req.appformsResultPayload = {
      data: getSubmissionResponse.submissions,
      type: constants.resultTypes.submissions
    };

    next(err);
  };
}


/**
 * Middleware For Populating File Parameters From A Multipart Request
 *
 * Used For Updating Submission Files
 * @param req
 * @param res
 * @returns next
 */
function getRequestFileParameters(req, res, next) {
  //A valid getForms request must have an appId parameter set
  var submitFileParams = {};
  submitFileParams.fileDetails = {};

  //Get the content body for normal parameter
  var filesInRequest = req.files;

  if (_.size(filesInRequest) === 0) {
    logger.error("Middleware: getRequestFileParameters, Expected A File To Have Been Sent ", {params: req.params});
    return next(new Error("Expected A File To Have Been Submitted"));
  }

  var fileDetails = _.map(filesInRequest, function(fileValue) {
    return fileValue;
  });

  fileDetails = _.first(fileDetails);

  logger.debug("Middleware: getRequestFileParameters ", {fileDetails: fileDetails, body: req.body});

  submitFileParams.fileDetails = {
    fileStream: fileDetails.path,
    fileName: fileDetails.originalname || fileDetails.name,
    fileType: fileDetails.mimetype,
    fileSize: fileDetails.size
  };

  req.appformsResultPayload = {
    data: submitFileParams,
    type: constants.resultTypes.submissions
  };

  logger.debug("Middleware: getRequestFileParameters ", {params: req.appformsResultPayload});

  return next();
}


/**
 * List All Submissions
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
  logger.debug("Middleware Submissions List ", {connectionOptions: req.connectionOptions});
  forms.getSubmissions(req.connectionOptions, {}, _getSubmissionsResultHandler(req, next));
}

/**
 * Search Submissions That Belong To The Project.
 * @param req
 * @param res
 * @param next
 */
function listProjectSubmissions(req, res, next) {
  var formId = req.body.formId;
  var subIds = req.body.id;

  var params = {
    wantRestrictions: false,
    appId: req.params.projectid
  };

  //Assigning Form Search If Set
  if (_.isString(formId)) {
    params.formId = formId;
  }

  //Assigning Submission Search Params If Set
  if (_.isArray(subIds)) {
    params.subid = subIds;
  } else if (_.isString(subIds)) {
    params.subid = [subIds];
  }

  logger.debug("Middleware listProjectSubmissions ", {params: params});

  forms.getSubmissions(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Get A Single Submission
 * @param req
 * @param res
 * @param next
 */
function get(req, res, next) {
  var params = {
    _id: req.params.id
  };

  logger.debug("Middleware Submissions Get ", {params: params});

  forms.getSubmission(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Get A Single Submission
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next) {
  var submission = req.body || {};
  submission.submissionId = req.params.id;
  //note this is a work around for submissions which exist in beta before the update to widg guids was done
  if (!submission.appClientId) {
    submission.appClientId = submission.appId;
  }
  var params = {
    submission: submission,
    skipValidation: true
  };

  logger.debug("Middleware Submissions Update ", {params: params});

  forms.updateSubmission(_.extend(req.connectionOptions, params), submissionsHandler(constants.resultTypes.submissions, req, next));
}


/**
 * Remove A Single Submission
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
  var params = {"_id": req.params.id};

  logger.debug("Middleware Submissions Remove ", {params: params});
  forms.deleteSubmission(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}



/**
 * Get A Single Submission File
 * @param req
 * @param res
 * @param next
 */
function getSubmissionFile(req, res, next) {
  var params = {"_id": req.params.fileId};
  logger.debug("Middleware getSubmissionFile ", {params: params});
  forms.getSubmissionFile(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}


/**
 * Update A Single Submission File
 * @param req
 * @param res
 * @param next
 */
function updateSubmissionFile(req, res, next) {
  var fileUpdateOptions = req.appformsResultPayload.data;

  fileUpdateOptions.submission = {
    submissionId: req.params.id,
    fieldId: req.params.fieldId
  };

  //Remove the cached file when finished
  fileUpdateOptions.keepFile = false;

  //Adding A New File If Required
  fileUpdateOptions.addingNewSubmissionFile = req.addingNewSubmissionFile;

  //If not addindg a new file, the fileId param is expected to be the file group id
  if (!fileUpdateOptions.addingNewSubmissionFile) {
    fileUpdateOptions.fileDetails.groupId = req.params.fileId;
  } else {
    fileUpdateOptions.fileDetails.hashName = req.params.fileId;
  }

  logger.debug("Middleware updateSubmissionFile ", {fileUpdateOptions: fileUpdateOptions});

  forms.updateSubmissionFile(_.extend(fileUpdateOptions, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Adding A New File To A Submission
 * @param req
 * @param res
 * @param next
 */
function addSubmissionFile(req, res, next) {
  req.addingNewSubmissionFile = true;

  updateSubmissionFile(req, res, next);
}

/**
 *
 * Middlware For Submitting A File Associated With A Submission
 *
 * @param req
 * @param res
 * @param next
 */
function submitFormFile(req, res, next) {
  var params = {
    submission: {
      fileId: req.params.fileid,
      fieldId: req.params.fieldid,
      fileStream: req.appformsResultPayload.data.fileDetails.fileStream,
      submissionId: req.params.id
    }
  };

  logger.debug("Middleware submitFormFile ", {params: params});

  forms.submitFormFile(_.extend(params, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 *
 * Middlware For Submitting A Base64 Text File.
 *
 * This text file will be decoded to binary as it streams to the database.
 *
 * @param req
 * @param res
 * @param next
 */
function submitFormFileBase64(req, res, next) {
  var params = {
    submission: {
      fileId: req.params.fileid,
      fieldId: req.params.fieldid,
      fileStream: req.appformsResultPayload.data.fileDetails.fileStream,
      submissionId: req.params.id,
      decodeBase64: true
    }
  };

  logger.debug("Middleware submitFormFileBase64 ", {params: params});

  forms.submitFormFile(_.extend(params, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Middleware For Getting The Current Status Of A Submission
 * @param req
 * @param res
 * @param next
 */
function status(req, res, next) {
  var params = {
    submission: {
      submissionId: req.params.id
    }
  };

  logger.debug("Middleware Submission status ", {params: params});

  forms.getSubmissionStatus(_.extend(params, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 *
 * Middleware For Marking A Submission As Complete
 *
 * @param req
 * @param res
 * @param next
 */
function completeSubmission(req, res, next) {
  var params = {
    submission: {
      submissionId: req.params.id
    }
  };

  logger.debug("Middleware completeSubmission ", {params: params});

  forms.completeFormSubmission(_.extend(params, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Search For Submissions. Used For Advanced Search
 * @param req
 * @param res
 * @param next
 */
function search(req, res, next) {
  var queryParams = req.body;

  logger.debug("Middleware Submission Search ", {params: queryParams});

  forms.submissionSearch(req.connectionOptions, queryParams, _getSubmissionsResultHandler(req, next));
}

/**
 * Filtering Submissions
 * @param req
 * @param res
 * @param next
 */
function filterSubmissions(req, res, next) {
  var filterParams = {
    formId: req.body.formId,
    appId: req.body.appId
  };

  logger.debug("Middleware filterSubmissions ", {params: filterParams});

  forms.getSubmissions(req.connectionOptions, filterParams, _getSubmissionsResultHandler(req, next));
}


/**
 * Export Submissions As CSV Files Contained In A Single Zip
 * @param req
 * @param res
 * @param next
 */
function exportSubmissions(req, res, next) {
  var params = {
    "appId" : req.body.projectId,
    "subid": req.body.subid,
    "formId": req.body.formId,
    "fieldHeader": req.body.fieldHeader,
    "downloadUrl": req.body.fileUrl,
    "filter": req.body.filter,
    "query": req.body.query,
    "wantRestrictions": false
  };

  logger.debug("Middleware exportSubmissions ", {req: req, body: req.body, params: params});

  forms.exportSubmissions(req.connectionOptions, params, function(err, submissionCsvValues) {
    if (err) {
      logger.error("Middleware Export Submissions ", {error: err});
      return next(err);
    }

    logger.debug("Middleware exportSubmissions submissionCsvValues", {submissionCsvValues: submissionCsvValues.length});

    _processExportResponse(submissionCsvValues, res, next);
  });
}

/**
 * Middleware For Generating A PDF Representation Of A Submission
 *
 * This is the last step in a request. It will be terminated here unless there is an error.
 * @param req
 * @param res
 * @param next
 */
function generatePDF(req, res, next) {
  req.appformsResultPayload = req.appformsResultPayload || {};

  //If there is already a submission result, render this. This is useful for cases where the submission is fetched from another database and rendered elsewhere.
  var existingSubmission = req.appformsResultPayload.data;

  var params = {
    _id: req.params.id,
    pdfExportDir: req.pdfExportDir,
    downloadUrl: '' + req.protocol + '://' + req.hostname,
    existingSubmission: existingSubmission,
    environment: req.environment,
    mbaasConf: req.mbaasConf,
    domain: req.user.domain,
    filesAreRemote: req.filesAreRemote,
    fileUriPath: req.fileUriPath,
    location: req.coreLocation,
    pdfTemplateLoc: req.pdfTemplateLoc
  };

  logger.debug("Middleware generatePDF ", {params: params});

  forms.generateSubmissionPdf(_.extend(params, req.connectionOptions), function(err, submissionPdfLocation) {
    if (err) {
      logger.error("Middleware generatePDF", {error: err});
      return next(err);
    }

    logger.debug("Middleware generatePDF ", {submissionPdfLocation: submissionPdfLocation});

    //Streaming the file as an attachment
    res.download(submissionPdfLocation, '' + req.params.id + ".pdf", function(fileDownloadError) {

      //Download Complete, remove the cached file
      fs.unlink(submissionPdfLocation, function() {
        if (fileDownloadError) {
          logger.error("Middleware generatePDF ", {error: fileDownloadError});
          //If the headers have not been sent to the client, can use the error handler
          if (!res.headersSent) {
            return next(fileDownloadError);
          }
        }
      });
    });
  });
}

/**
 * Function for processing submissions into a zip file containing csv files.
 *
 */
function _processExportResponse(csvs, res, next) {
  var zip = archiver('zip');

  // convert csv entries to in-memory zip file and stream response
  res.setHeader('Content-type', 'application/zip');
  res.setHeader('Content-disposition', 'attachment; filename=submissions.zip');
  zip.pipe(res);

  for (var form in csvs) { // eslint-disable-line guard-for-in
    var csv = csvs[form];
    zip.append(csv, {name: form + '.csv'});
  }

  var respSent = false;
  zip.on('error', function(err) {
    logger.error("_processExportResponse ", {error: err});
    if (err) {
      if (!respSent) {
        respSent = true;
        return next(err);
      }
    }
  });

  zip.finalize(function(err) {
    if (err) {
      logger.error("_processExportResponse finalize", {error: err});
      if (!respSent) {
        respSent = true;
        return next(err);
      }

      logger.debug("_processExportResponse finalize headers sent");
    }

    logger.debug("_processExportResponse finalize finished");
  });
}

/**
 * Function for handling a file response. Used when loading files from a submission
 *
 * @param req
 * @param res
 * @param next
 */
function processFileResponse(req, res, next) {
  var fileDetails = req.appformsResultPayload.data;
  if (fileDetails.stream) {
    var headers = {};
    headers["Content-Type"] = fileDetails.type;//Setting the file content type. Mime types are set by the file handler.
    headers["Transfer-Encoding"] = "chunked";
    headers["Content-Length"] = fileDetails.length;
    headers["Content-Disposition"] = "attachment; filename=" + fileDetails.name;
    res.writeHead(200, headers);
    fileDetails.stream.pipe(res);
    fileDetails.stream.resume(); //Unpausing the stream as it was paused by the file handler
  } else {
    return next('Error getting submitted file - result: ' + JSON.stringify(fileDetails));
  }
}

module.exports = {
  list: list,
  listProjectSubmissions: listProjectSubmissions,
  get: get,
  update: update,
  remove: remove,
  search: search,
  filterSubmissions: filterSubmissions,
  getSubmissionFile: getSubmissionFile,
  updateSubmissionFile: updateSubmissionFile,
  addSubmissionFile: addSubmissionFile,
  submitFormFile: submitFormFile,
  submitFormFileBase64: submitFormFileBase64,
  status: status,
  completeSubmission: completeSubmission,
  exportCSV: exportSubmissions,
  processExportResponse: _processExportResponse,
  processFileResponse: processFileResponse,
  getRequestFileParameters: getRequestFileParameters,
  generatePDF: generatePDF
};
