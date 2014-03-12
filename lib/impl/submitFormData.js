var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var misc = require('../common/misc.js');
var formsRulesEngine = require('../common/forms-rule-engine.js');
var async = require('async');

var submitFormData = function(connections, options, cb) {

  //validate form data
  //save form data
  //return submissionId

  var resultJSON = {};
  var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
  var Field = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);
  var FormSubmission = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);


  var submissionFlags = {};
  var submissionData = options.submission;
  // {fieldId : validated}
  var requiredFields = {};
  var formSubmittedAgainst = undefined;
  var formSubmission = undefined;
  var formFieldsToValidate = [];
  var skipValidation = options.skipvalidation;

  async.series([lookupSubmission, validateSubmission, saveSubmission], function(err){
    //console.log("Ready to finish:", err);
    if(err) {
      resultJSON.error = err.message ? err.message : err;
    }

    if(submissionFlags.updateForm === true){//Need to send a form definition back.
      //Should send back an updated version of the form in the response.

      var fullyPopulatedForm = formSubmittedAgainst.toJSON();
      fullyPopulatedForm.lastUpdatedTimestamp = formSubmittedAgainst.lastUpdated.getTime();
      var pageAndFieldRefs = misc.generatePageAndFieldRefs(formSubmittedAgainst);
      fullyPopulatedForm.pageRef = pageAndFieldRefs.pageRef;
      fullyPopulatedForm.fieldRef = pageAndFieldRefs.fieldRef;

      resultJSON.updatedFormDefinition = fullyPopulatedForm;
    }
    if(formSubmission){
      resultJSON.submissionId = formSubmission._id;
      resultJSON.submissionStartedTimestamp = formSubmission.submissionStartedTimestamp;
      resultJSON.formSubmission = formSubmission;
    }

    cb(undefined, resultJSON);
  });

  function lookupSubmission(cb){
    //console.log('lookupSubmission:', submissionData._id);
    if (submissionData._id) {
      FormSubmission.findById(submissionData._id).exec(function(err, doc) {
        formSubmission = doc;
        if (!formSubmission) {
          return cb("Submission not found for id '" + submissionData._id + "'");
        }
        return cb();
      });
    } else {
      return cb();
    }
  }

  function saveSubmission(cb){
    //Valid form submission definition.
    //delete submissionData.formId;//Not needed, should be set properly using the form ref
    if(submissionData._id === null || submissionData._id === undefined){
      delete submissionData._id;
    }

    if (formSubmission) {
      // update
      formSubmission.set(submissionData);
    } else {
      // create
      formSubmission = new FormSubmission(submissionData);
    }

    if(! skipValidation){
      formSubmission.formId = formSubmittedAgainst;
      formSubmission.masterFormTimestamp = submissionFlags.masterFormTimestamp;
      formSubmission.deviceFormTimestamp = submissionFlags.deviceFormTimestamp;
    }

    // always set to pending when creating or updating, and last updated time to now
    formSubmission.status = 'pending';
    formSubmission.save(function(err, updatedForm){
      formSubmission = updatedForm;
      return cb(err);
    });

    // TODO: remove any files in gridfs if they're no longer referenced after an update
  }

  function validateSubmission(cb){
    if(skipValidation){
      validateSubmissionParams(cb);
    }
    else{
      async.series([validateSubmissionParams, validateSubmissionData], cb);
    }
  }

  function validateSubmissionParams(cb){
    //console.log('validateSubmissionParams');
    var validateOptions = validate(options);

    validateOptions.has("submission", function(failure){
      if(failure) return cb(new Error("Invalid data for submission."));

      var validateFormFields = validate(submissionData);
      validateFormFields.has("formId", "appId", "appCloudName", "appEnvironment", "deviceId", "deviceIPAddress", "comments", "formFields", "deviceFormTimestamp", function(failure){
        if(failure) return cb(new Error("Invalid paramaters for form submission, aborting. " ));

        //Have formId -- check if it exists.
        Form.findOne({"_id": submissionData.formId}, function(err, result){
          if(err) return cb(new Error("Error finding form with id " + submissionData.formId));

          if(result === null){
            return cb(new Error("No form exists with id" + submissionData.formId));
          } else {
            return cb();
          }
        });
      });
    });
  }

  function validateSubmissionData(cb){

    //console.log('validateSubmissionData');
    //Submission has data

    //Populating the current form definition  -- get everything
    Form.findOne({"_id": submissionData.formId}).populate("pages pageRules fieldRules").exec(function(err, formResult){
      if(err) return cb(new Error("Error finding form with id " + submissionData.formId));

      if(formResult === null){
        return cb(new Error("No form exists with id " + submissionData.formId));
      }

      //Now populate the fields in each page
      Form.populate(formResult, {"path": "pages.fields", "model": Field, "select": "-__v -fieldOptions._id"}, function(err, updatedForm){
        if(err) return cb(new Error("Error getting pages for form id "  + submissionData.formId));

        //Form fields now fully populated.. time for some validation

        formSubmittedAgainst = updatedForm;
        var currentFormJSON = updatedForm.toJSON();

        async.series([
          async.apply(checkFormForUpgrade, currentFormJSON),
          async.apply(validateDataAgainstCurrentForm, currentFormJSON),
          async.apply(updateFieldPageRefs,formSubmittedAgainst)
        ], cb);
      });
    });
  }

  function updateFieldPageRefs(form,cb){

    async.each(form.pages,function (page,cb){
      async.each(page.fields,function (field,cb){
        if(field && field.pageData){
          if(field.pageData._id === page._id && field.pageData.name === page.name){
            return cb();
          }
        }
        field.pageData = {
          "_id":page._id,
          "name": page.name
        };
        field.save(cb);
      },cb);
    },cb);
  }

  function checkFormForUpgrade(currentFormJSON, cb){

    var submitFormTimestamp = new Date(submissionData.deviceFormTimestamp);
    var masterFormTimestamp = new Date(currentFormJSON.lastUpdated);


    if(submitFormTimestamp == "Invalid Date" || masterFormTimestamp == "Invalid Date"){
      return cb(new Error("Invalid submission timestamp. " + submissionData.deviceFormTimestamp));
    }

    //Compare form timestamps, flag update if needed
    if(submitFormTimestamp < masterFormTimestamp){
      submissionFlags.updateForm = true;
    }

    submissionFlags.deviceFormTimestamp = submitFormTimestamp;
    submissionFlags.masterFormTimestamp = masterFormTimestamp;

    cb();
  }

  function getValidationError(validationObj) {
    var ret = "No Validation Error";
    if(validationObj && !validationObj.valid) {
      var fields = Object.keys(validationObj);
      if(fields.length > 0) {
        var i;
        for(i=0; i< fields.length; i+=1) {
          if(fields[i] != "valid") {
            var firstField = validationObj[fields[i]];
            if(!firstField.valid && firstField.fieldErrorMessage && firstField.fieldErrorMessage.length > 0) {
              ret = firstField.fieldErrorMessage[0];
              break;
            } else if(!firstField.valid && firstField.errorMessages && firstField.errorMessages.length > 0) {
              for(var f=0; f < firstField.errorMessages.length; f += 1) {
                if(firstField.errorMessages[f] != null) {
                  ret = firstField.errorMessages[f];
                  break;
                }
              }
            }
          }
        }
      }
    }
    return ret;
  }

  function validateDataAgainstCurrentForm(currentFormJSON, cb){

    if(skipValidation){
      return cb();
    }
    var engine = formsRulesEngine(currentFormJSON);
    engine.validateForm(submissionData, formSubmission, function (err, results) {
      if(err) return cb(err);

      if(!results.validation.valid) {
        var validationError = getValidationError(results.validation);
        return cb(new Error(validationError));
      }

      return cb();
    });
  }

};

module.exports = submitFormData;