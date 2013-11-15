var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var completeFormSubmission = function(connections, options, cb) {
  var FormSubmission = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var Field = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  var submission = options.submission;
  var submissionToCheck = undefined;
  var fieldsToCheck = [];

  if(!submission){
    return cb(new Error("No submission entered"));
  }

  var submissionValidation = validate(submission);

  submissionValidation.has("submissionId", function(failure){
    if(failure) return cb(new Error(failure));

    //submissionId defined,
    async.series([findSubmission, checkSubmissionComplete, updateSubmission], function(err){
      if(err) return cb(err);

      return cb(undefined, {"result": "ok"});
    });
  });

  function findSubmission(cb){
    FormSubmission.findOne({"_id" : submission.submissionId},function(err, foundSubmission){
      if(err) return cb(err);

      if(foundSubmission === null){
        return cb(new Error("Submission with id " + submission.submissionId + " not found"));
      }

      FormSubmission.populate(foundSubmission, {"path": "formFields.fieldId", "model": Field, "select": "-__v"}, function(err, updatedSubmission){
        if(err) return cb(err);


        submissionToCheck = updatedSubmission;

        return cb();
      });
    });
  }

  function checkSubmissionComplete(cb){
    //For the submission to be complete, any files it contains must have been saved.

    //First, find any fields that are files, photos or signatures.
    async.eachSeries(submissionToCheck.formFields, function(formField, cb){
      if(formField.fieldId.type === "file" || formField.fieldId.type === "photo" || formField.fieldId.type === "signature"){
        fieldsToCheck.push(formField);
      }

      return cb();
    }, function(err){
      if(err) return cb(err);

      //All required file fields are now populated
      async.eachSeries(fieldsToCheck, function(formField, cb){
        var filesWaitingToBeUploaded = formField.fieldValues.filter(function(fieldValue){
          return fieldValue.indexOf("filePlaceHolder") > -1;//TODO, put this into config
        });

        if(filesWaitingToBeUploaded.length > 0){
          return cb(new Error("Files uploads are not complete"));
        } else {
          cb();
        }
      }, cb);
    });
  }

  function updateSubmission(cb){
    //Submission totally complete, ready to finalise
    submissionToCheck.submissionCompletedTimestamp = Date.now();
    submissionToCheck.status = "complete"; //TODO put this into config
    submissionToCheck.markModified("submissionCompletedTimestamp");

    submissionToCheck.save(function(err){
      console.log(err);
      cb(err);
    });
  }
};

module.exports = completeFormSubmission;