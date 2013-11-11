var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var fieldValidator = require('../common/fieldValidator.js');

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

  async.series([validateSubmission, saveSubmission], function(err){
    //console.log("Ready to finish");
    if(err) return cb(err);

    if(submissionFlags.updateForm === true){//Need to send a form definition back.
      //Should send back an updated version of the form in the response.
      resultJSON.updatedFormDefinition = formSubmittedAgainst.toJSON();
    }
    resultJSON.submissionId = formSubmission._id;
    resultJSON.submissionStartedTimestamp = formSubmission.submissionStartedTimestamp;


    cb(undefined, resultJSON);
  });

  function saveSubmission(cb){
    //Valid form submission definition.
    //console.log("In SaveSubmission");
    //delete submissionData.formId;//Not needed, should be set properly using the form ref

    formSubmission = new FormSubmission(submissionData);
    formSubmission.formId = formSubmittedAgainst;
    formSubmission.masterFormTimestamp = submissionFlags.masterFormTimestamp;
    formSubmission.deviceFormTimestamp = submissionFlags.deviceFormTimestamp;

    formSubmission.save(cb);
  }

  function validateSubmission(cb){
    async.series([validateSubmissionParams, validateSubmissionData], cb);
  }

  function validateSubmissionParams(cb){
    var validateOptions = validate(options);

    validateOptions.has("submission", function(failure){
      if(failure) return cb(new Error("Invalid data for submission." + JSON.stringify(options)));

      var validateFormFields = validate(submissionData);
      validateFormFields.has("formId", "appId", "appCloudName", "appEnvironment", "userId", "deviceId", "deviceIPAddress", "comments", "formFields", "deviceFormTimestamp", function(failure){
        if(failure) return cb(new Error("Invalid paramaters for form submission, aborting. Params " + JSON.stringify(failure)));

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
    //Submission has data

    //Populating the current form definition  -- get everything
    Form.findOne({"_id": submissionData.formId}).populate("pages").exec(function(err, formResult){
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
          async.apply(validateDataAgainstCurrentForm, currentFormJSON)
        ], cb);
      });
    });
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

  function validateDataAgainstCurrentForm(currentFormJSON, cb){
    //Populate Required Fields.
    for(var pageIndex = 0; pageIndex < currentFormJSON.pages.length; pageIndex++){
      var testPage = currentFormJSON.pages[pageIndex];
      for(var fieldIndex = 0; fieldIndex < testPage.fields.length; fieldIndex++){
        var testField = testPage.fields[fieldIndex];
        if(testField.required === true){
          requiredFields[testField._id] = {"name" : testField.name, "validated": false};//Flagging required field as not validated.
        }
        formFieldsToValidate.push(testField);
      }
    }

    //console.log("REQUIRED FIELDS ", requiredFields);

    async.eachSeries(submissionData.formFields, function(submissionFieldEntry, cb){
      async.waterfall([
        async.apply(findFormField, currentFormJSON, submissionFieldEntry),
        validateFormField
      ], cb);
    }, function(err){
      if(err) return cb(err);


      //All validation of fields complete. Check that all required fields are validated against
      for(var key in requiredFields){
        if(requiredFields[key].validated === false){
          return cb(new Error("Required Field " + requiredFields[key].name + " not submitted"));
        }
      }

      return cb();
    });
  }

  function findFormField(currentFormJSON, submissionFieldEntry, cb){
    //Getting the field definition base

    var formFieldToValidate = formFieldsToValidate.filter(function(fieldEntry){
      return fieldEntry._id === submissionFieldEntry.fieldId;
    });

    if(formFieldToValidate.length === 0){
      //This field does not exist in the current form. Find it in the list of fields
      Field.findOne({"_id": submissionFieldEntry.fieldId}, function(err, result){
        if(err) return cb(err);

        if(result === null){
          return cb(new Error("No field exists with fieldId " + submissionFieldEntry.fieldId ));
        }

        //Field exists
        return cb(undefined, result.toJSON(), submissionFieldEntry);
      });
    } else if (formFieldToValidate.length > 1){
      return cb(new Error("Invalid number of fields match field id " + submissionFieldEntry.fieldId + ". Number found " + formFieldToValidate.length));
    } else {
      return cb(undefined, formFieldToValidate, submissionFieldEntry);
    }
  }

  function validateFormField(formFieldToValidate, submissionFieldEntry, cb){
    //console.log("In validateFormField");
    validateSingleFieldSubmission(formFieldToValidate, submissionFieldEntry, function(err){
      if(err) return cb(err);

      //Check if the field is required. -- mark it as validated.
      if(requiredFields[formFieldToValidate._id] !== undefined){
        requiredFields[formFieldToValidate._id].validated = true;
      }

      return cb();
    });
  }

  function validateSingleFieldSubmission(formFieldDefinition, submittedField, cb){
    //console.log("In validateSingleFieldSubmission");
    var singleFieldValidator = fieldValidator(formFieldDefinition, submittedField);

    singleFieldValidator.validate(cb);
  }
};

module.exports = submitFormData;