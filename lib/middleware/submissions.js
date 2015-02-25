var forms = require('../forms.js');
var _ = require('underscore');
var archiver = require('archiver');
var submissionsHandler = require('./resultHandlers.js');
var constants = require('../common/constants.js').MIDDLEWARE;
var fs = require('fs');


function _getSubmissionsResultHandler(req, next){
  return function(err, getSubmissionResponse){
    getSubmissionResponse = getSubmissionResponse || {};
    req.appformsResultPayload = {
      data: getSubmissionResponse.submissions,
      type: constants.resultTypes.submissions
    };

    next(err);
  }
}


/**
 * Middleware For Populating File Parameters From A Multipart Request
 *
 * Used For Updating Submission Files
 * @param req
 * @param res
 * @returns next
 */
function getRequestFileParameters(req, res, next){
  //A valid getForms request must have an appId parameter set
  var submitFileParams = {};
  submitFileParams.submission = {};
  submitFileParams.fileDetails = {};

  //Get the content body for normal parameter
  var filesInRequest = req.files;

  if(_.size(filesInRequest) === 0){
    return next(new Error("Expected A File To Have Been Submitted"));
  }

  var fileDetails = _.map(filesInRequest, function(fileValue){
    return fileValue;
  });

  fileDetails = _.first(fileDetails);

  //Only one file at a time.
  submitFileParams.submission.fileStream = fileDetails.path;
  submitFileParams.submission.fileName = fileDetails.name;
  submitFileParams.submission.fileType = fileDetails.mimetype;

  req.appformsResultPayload = {
    data: submitFileParams,
    type: constants.resultTypes.submissions
  };
  return next();
}


/**
 * List All Submissions
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next){
  forms.getSubmissions(req.connectionOptions, {}, _getSubmissionsResultHandler(req, next));
}

/**
 * Get A Single Submission
 * @param req
 * @param res
 * @param next
 */
function get(req, res, next){
  var params = {
    _id: req.params.id
  };

  forms.getSubmission(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Get A Single Submission
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next){
  var submission = req.body || {};
  submission.submissionId = req.params.id;
  //note this is a work around for submissions which exist in beta before the update to widg guids was done
  if(!submission.appClientId){
    submission.appClientId = submission.appId;
  }
  var params = {
    submission: submission,
    skipValidation: true
  };

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

  forms.getSubmissionFile(req.connectionOptions, params, submissionsHandler(constants.resultTypes.submissions, req, next));
}


/**
 * Update A Single Submission File
 * @param req
 * @param res
 * @param next
 */
function updateSubmissionFile(req, res, next){
  var fileDetails = req.submitFileParams;

  if(!fileDetails){
    return next(new Error("Invalid File Details For Submission."));
  }

  fileDetails.submission.submissionId = req.params.id;
  fileDetails.submission.fileGroupId = req.params.fileId;
  fileDetails.submission.fieldId = req.params.fieldId;
  fileDetails.submission.keepFile = false;
  fileDetails.fileDetails.hashName = req.body.hashName;
  fileDetails.submission.fileDetails = fileDetails.fileDetails;


  forms.updateSubmissionFile(_.extend(fileDetails, req.connectionOptions), submissionsHandler(constants.resultTypes.submissions, req, next));
}

/**
 * Search For Submissions
 * @param req
 * @param res
 * @param next
 */
function search(req, res, next){
  var queryParams = req.body;

  forms.submissionSearch(req.connectionOptions, queryParams, _getSubmissionsResultHandler(req, next));
}

/**
 * Filtering Submissions
 * @param req
 * @param res
 * @param next
 */
function filterSubmissions(req, res, next){
  var filterParams = {
    formId: req.body.formId,
    appId: req.body.appId
  };

  forms.getSubmissions(req.connectionOptions, filterParams, _getSubmissionsResultHandler(req, next));
}


/**
 * Export Submissions As CSV Files Contained In A Single Zip
 * @param req
 * @param res
 * @param next
 */
function exportSubmissions(req, res, next){
  var params = {
    "appId" : req.body.projectId,
    "subid": req.body.subid,
    "formId": req.body.formId,
    "fieldHeader": req.body.fieldHeader,
    "downloadUrl": req.downloadUrl,
    "wantRestrictions": false
  };
  forms.exportSubmissions(req.connectionOptions, params, function(err, submissionCsvValues){
    if(err){
      return next(err);
    }

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
function generatePDF(req, res, next){
  req.appformsResultPayload = req.appformsResultPayload || {};

  //If there is already a submission result, render this. This is useful for cases where the submission is fetched from another database and rendered elsewhere.
  var existingSubmission = req.appformsResultPayload.data;

  var params = {
    _id: req.params.id,
    pdfExportDir: req.pdfExportDir,
    downloadUrlHost: req.hostname,
    existingSubmission: existingSubmission,
    environment: req.environment,
    mbaasConf: req.mbaasConf,
    domain: req.user.domain,
    filesAreRemote: req.filesAreRemote,
    location: req.coreLocation,
    pdfTemplateLoc: req.pdfTemplateLoc
  };

  forms.generateSubmissionPdf(_.extend(params, req.connectionOptions), function(err, submissionPdfLocation) {
    if (err) {
      return next(err);
    }

    //Streaming the file as an attachment
    res.download(submissionPdfLocation, '' + req.params.id + ".pdf", function(fileDownloadError){

      //Download Complete, remove the cached file
      fs.unlink(submissionPdfLocation, function(){
        if(fileDownloadError){

          //If the headers have not been sent to the client, can use the error handler
          if(!res.headersSent){
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
function _processExportResponse(csvs, res, next){
  var zip = archiver('zip');

  // convert csv entries to in-memory zip file and stream response
  res.setHeader('Content-type', 'application/zip');
  res.setHeader('Content-disposition', 'attachment; filename=submissions.zip');
  zip.pipe(res);

  for (var form in csvs) {
    var csv = csvs[form];
    zip.append(csv, {name: form + '.csv'});
  }

  var respSent = false;
  zip.on('error', function(err) {
    if (err) {
      if (!respSent) {
        respSent = true;
        return next(err);
      }
    }
  });

  zip.finalize(function (err) {
    if (err) {

      if (!respSent) {
        respSent = true;
        return next(err);
      }
    }
  });
}

/**
 * Function for handling a file response. Used when loading files from a submission
 *
 * @param req
 * @param res
 * @param next
 */
function processFileResponse(req, res, next){
  var fileDetails = req.appformsResultPayload.data;
  if(fileDetails.stream){
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
  get: get,
  update: update,
  remove: remove,
  search: search,
  filterSubmissions: filterSubmissions,
  getSubmissionFile: getSubmissionFile,
  updateSubmissionFile: updateSubmissionFile,
  export: exportSubmissions,
  processExportResponse: _processExportResponse,
  processFileResponse: processFileResponse,
  getRequestFileParameters: getRequestFileParameters,
  generatePDF: generatePDF
};