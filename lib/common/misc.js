var async = require('async');
var _ = require('underscore');
var mbaasFileUrlTemplate = "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId";
var crypto = require('crypto');
var models = require('./models.js')();

function generatePageAndFieldRefs(formDefinition){
  var pageRef = {};
  var fieldRef = {};

  for(var pageIndex = 0; pageIndex < formDefinition.pages.length; pageIndex++){
    pageRef[formDefinition.pages[pageIndex]._id] = pageIndex;

    for(var fieldIndex = 0; fieldIndex < formDefinition.pages[pageIndex].fields.length; fieldIndex++){
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id] = {};
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id].page = pageIndex;
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id].field = fieldIndex;
    }
  }

  return {"pageRef" : pageRef, "fieldRef": fieldRef};
}

function mapSubmissionValsToFormsFields(submission, formJson, cb){
  if(! submission){
    return cb("no submission passed");
  }else if(! formJson){
    return cb("no form definition found in submission");
  }

  /**
   * The field definition can either be in the submission that has a populated fieldId,
   * Or the field definition is an admin field that is in the formSubmitted agains.
   * As this field is not included in a client submission, a scan of the formSubmitted against must be made.
   * @param field
   * @param formJSON
   */
  function addAdminFieldToSubmission(field){
    //Full field object is used in the return as existing fields are populated already.
    var subObject = {
      fieldId : field,
      fieldValues: []
    };

    submission.formFields.push(subObject);
  }

  formJson.pages = _.map(formJson.pages, function(page) {
    page.fields = _.map(page.fields, function(field) {
      var subFieldMatch = _.find(submission.formFields, function(subField) {
        //match the submission field to the existing formField
        return subField.fieldId._id.toString() === field._id.toString(); // need toString() as ids are objects
      });
      if(subFieldMatch){
        field.values =  subFieldMatch.fieldValues || [];
      } else {
        field.values= [];
        addAdminFieldToSubmission(field);
      }

      return field;
    });

    return page;
  });

  submission.formSubmittedAgainst = formJson;
  cb(undefined, submission);
}

//Handy Function To convert All ObjectIds to strings.
function convertAllObjectIdsToString(form){
  form._id = form._id ? form._id.toString() : form._id;
  form.pages = _.map(form.pages, function(page){
    page._id = page._id ? page._id.toString() : page._id;

    page.fields = _.map(page.fields, function(field){
      field._id = field._id ? field._id.toString() : field._id;
      return field;
    });

    return page;
  });
  return form;
}

//Function to compare to timestamps and return the most recent.
function getMostRecentRefresh(formLastUpdated, dataLastUpdated){
  var formTimestamp = new Date(formLastUpdated).getTime();
  var dataTimestamp = new Date(dataLastUpdated).getTime();

  if(!dataLastUpdated){
    return formLastUpdated;
  }

  if(dataTimestamp > formTimestamp){
    return dataLastUpdated;
  } else {
    return formLastUpdated;
  }
}

function pruneAdminFields(options, fullyPopulatedForm){
  /**
   * If admin fields are to be shown, then don't prune admin fields.
   */
  if(options.showAdminFields){
    return convertAllObjectIdsToString(fullyPopulatedForm);
  }

  fullyPopulatedForm.pages = _.map(fullyPopulatedForm.pages, function(page){
    var fields = page.fields || [];
    page.fields = _.filter(fields, function(field){
      return !field.adminOnly;
    });
    return page;
  });

  return convertAllObjectIdsToString(fullyPopulatedForm);
}

//Generating A Consistent Hash For An Unsorted Object. Useful for testing if a data set has been updated for a Data Source.
function generateHash(plainText) {
  var hash;
  if( plainText ) {
    if ('string' !== typeof plainText) {
      plainText = sortedStringify(plainText);
    }
    var shasum = crypto.createHash('sha1');
    shasum.update(plainText);
    hash = shasum.digest('hex');
  }
  return hash;
}

function sortObject(object) {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  var result = [];

  Object.keys(object).sort().forEach(function(key) {
    result.push({
      key: key,
      value: sortObject(object[key])
    });
  });

  return result;
}

//Checking Mongo ID Param
function checkId(id){
  id = id || "";
  id = id.toString();
  return _.isString(id) && id.length === 24;
}


function sortedStringify(obj) {

  var str = '';

  try {
    var soretdObject = sortObject(obj);
    if(obj) {
      str = JSON.stringify(soretdObject);
    }
  } catch (e) {
    throw e;
  }

  return str;
}

//Common Error Response builder.
/**
 * Thee should be a common error response from all feedhenry components.
 *
 * @param params - object containing error structures.
 */
function buildErrorResponse(params){
  params = params || {};
  params.error = params.error || {};
  var ERROR_CODES = models.CONSTANTS.ERROR_CODES;

  if(params.error.userDetail){
    return params.error;
  }

  if(params.error){
    var message = params.error.message || "";
    //If the message is about validation, the return a validation http response
    if(message.indexOf("validation") > -1){
      params.code = params.code || ERROR_CODES.FH_FORMS_INVALID_PARAMETERS;
    }
  }

  //Mongoose Validation Failed
  if(params.error && params.error.errors){
    var fieldKey = _.keys(params.error.errors)[0];
    params.userDetail = params.userDetail || params.error.errors[fieldKey].message;
    params.code = params.code || ERROR_CODES.FH_FORMS_INVALID_PARAMETERS;
  }

  var userDetail = params.userDetail || params.error.userDetail || params.error.message || "An Unexpected Error Occurred";
  var systemDetail = params.systemDetail || params.error.systemDetail || params.error.stack || "";
  var code = params.code || ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR;

  return {
    userDetail: userDetail,
    systemDetail: systemDetail,
    code: code
  };
}

//Removing All underscore ids
function pruneIds(form){
  var testForm = _.clone(form);
  testForm.pages = _.map(testForm.pages, function(page){
    page.fields = _.map(page.fields, function(field){
      return _.omit(field, '_id');
    });

    return _.omit(page, '_id');
  });

  return _.omit(testForm, '_id');
}

/**
 * Utility Function To Add All Files Storage Sizes For Submission
 * @param submissions
 */
function buildFormFileSizes(submissions){
  //Grouping By Form Id
  var fileSizesByForm = _.groupBy(submissions, 'formId');

  //Getting all files associated with the submissions
  fileSizesByForm = _.mapObject(fileSizesByForm, function (formSubs, formId) {

    //Getting File Sizes For All Entries In All Submissions Related To formId
    var allSubmissionSizes = _.map(formSubs, function (submission) {

      //For a single submission, get all file sizes
      var submissionFileSizes = _.map(submission.formFields, function (formField) {
        return _.map(_.compact(formField.fieldValues), function (fieldValue) {
          return fieldValue.fileSize;
        });
      });

      var totalSize = _.compact(_.flatten(submissionFileSizes));

      //Adding all the file sizes for a single submission.
      return _.reduce(totalSize, function (memo, fileSize) {
        return memo + fileSize;
      }, 0);
    });

    //Adding all file sizes for all submissions
    return _.reduce(_.flatten(allSubmissionSizes), function (memo, fileSize) {
      return memo + fileSize;
    }, 0);
  });

  return fileSizesByForm;
}

module.exports.generateHash = generateHash;
module.exports.generatePageAndFieldRefs = generatePageAndFieldRefs;
module.exports.mapSubmissionValsToFormsFields = mapSubmissionValsToFormsFields;
module.exports.pruneAdminFields = pruneAdminFields;
module.exports.buildErrorResponse = buildErrorResponse;
module.exports.checkId = checkId;
module.exports.getMostRecentRefresh = getMostRecentRefresh;
module.exports.pruneIds = pruneIds;
module.exports.buildFormFileSizes = buildFormFileSizes;