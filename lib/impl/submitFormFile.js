var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var fhgridfs = require("fh-gridfs").MongoFileHandler;
var async = require("async");

//options {:fileid, :submissionId, :fieldId, :fileStream, :fileName}

var submitFormFile = function(connections, options, cb) {

  var FormSubmission = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var submissionToUse = undefined;
  var submissionFieldIndex = undefined;
  var filePlaceholderIndex = undefined;
  var savedFileGroupId = undefined;
  var submission = options.submission;
  var fileHandler = new fhgridfs();

  if(!submission){
    return cb(new Error("No data submitted"));
  }

  var validateOptions = validate(submission);
  validateOptions.has("fileId", "submissionId", "fieldId", "fileStream", "fileName", function(failure){
    if(failure) return cb(failure);

    async.series([getSubmission, findPlaceholder, saveFileStream, updateSubmission], function(err){
      if(err) return cb(err);

      var resultJSON = {};
      resultJSON.status = 200;
      resultJSON.savedFileGroupId = savedFileGroupId;

      return cb(undefined, resultJSON);
    });
  });

  function getSubmission(cb){
    FormSubmission.findOne({"_id": submission.submissionId}, function(err, foundSubmission){
      if(err) return cb(err);

      if(foundSubmission === null || foundSubmission === undefined){
        return cb(new Error("No submission found matching submission id " + submission.submissionId));//TODO -- Need to do error codes
      }

      //Submission found, find the fileId
      submissionToUse = foundSubmission;
      return cb();
    });
  }

  function findPlaceholder(cb){

    var indexOfField = -1;//TODO -- Restructure field entries to be object with key fieldId.
    for(var formFieldIndex = 0; formFieldIndex < submissionToUse.formFields.length ; formFieldIndex++){
      if(submissionToUse.formFields[formFieldIndex].fieldId.toString() === submission.fieldId.toString()){
        indexOfField = formFieldIndex;
        break;
      }
    }

    if(indexOfField === -1){
      return cb(new Error("No field with id " + submission.fieldId + " exists in submission " + submissionToUse._id));
    }

    submissionFieldIndex = indexOfField;

    var submissionEntry = submissionToUse.formFields[indexOfField];
    var indexOfFilePlaceholder = submissionEntry.fieldValues.indexOf(submission.fileId);

    if(indexOfFilePlaceholder === -1){
      return cb(new Error("No file with id " + submission.fileId + " exists in field " + submission.fieldId + " for submission " +  submissionToUse._id));
    }

    filePlaceholderIndex = indexOfFilePlaceholder;
    return cb();
  }

  function saveFileStream(cb){
    fileHandler.saveFile(connections.databaseConnection, submission.fileName, submission.fileStream, {}, function(err, saveResult){
      if(err) return cb(err);

      savedFileGroupId = saveResult.groupId.toString();

      cb();
    });
  }

  function updateSubmission(cb){
    //Form file saved, now the submission can be updated to the groupId belonging to the file
    submissionToUse.formFields[submissionFieldIndex].fieldValues[filePlaceholderIndex] = savedFileGroupId;
    submissionToUse.markModified("formFields");

    submissionToUse.save(cb);
  }
};

module.exports = submitFormFile;
