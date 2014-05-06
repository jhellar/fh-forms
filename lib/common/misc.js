var async = require('async');
var _ = require('underscore');
var mbaasFileUrlTemplate = "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId";

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
  var FILE_UPLOAD_URL = "/api/v2/forms/submission/file/";    //not sure what to do with this value
  if(! submission){
    return cb("no submission passed");
  }else if(! formJson){
    return cb("no form definition found in submission");
  }
  async.mapSeries(formJson.pages, function(page, mcb0) {

    async.mapSeries(page.fields, function(field, mcb1) {
      var subFieldMatch = _(submission.formFields).find(function(subField) {
        //match the submission field to the existing formField
        var matched = subField.fieldId._id.toString() === field._id.toString(); // need toString() as ids are objects
        if(matched){
          subField.matched = true;
        }
        return matched;
      });
      if(subFieldMatch){
        field.values =  subFieldMatch.fieldValues || [];
      }
      else{
        field.values= [];
      }
      switch(field.type) {
        case 'photo':
        case 'signature':
          async.map(field.values, function(val, mcb2) {
            val.url = FILE_UPLOAD_URL + val.groupId+"?rand=" + Math.random();
            val.mbaasUrl = mbaasFileUrlTemplate;
            mcb2();
          }, mcb1);
          break;
        case 'file':
          field.values.forEach(function(val) {
            if(null !== val){
              val.downloadUrl = FILE_UPLOAD_URL + val.groupId;
              val.mbaasUrl = mbaasFileUrlTemplate;
            }
          });
          return mcb1();
        default:
          return mcb1();
      }
    }, mcb0);
  },function (err, ok){
     submission.formSubmittedAgainst = formJson;
     cb(err, submission);
  });
}


exports.generatePageAndFieldRefs = generatePageAndFieldRefs;
exports.mapSubmissionValsToFormsFields = mapSubmissionValsToFormsFields;