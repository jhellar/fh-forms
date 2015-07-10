var async = require('async');
var moment = require('moment');

/**
 * Converting Submissions to a CSV format.
 * @param params: {
 *   fieldHeader - <<name/fieldCode>> (The header to use for fields in csv).
 *   submissions - Array of submissions to be exported
 *  downloadUrl - Base download URL for file downloads
 * }
 *
 * @param cb: callback function when complete or an error occurs.
 *
 * TODO Could Use Some Refactoring
 */
function submissionsToCSV(params, cb) {
  params = params || {};
  var submissions = params.submissions || [];
  var downloadUrl = params.downloadUrl;
  //Checking whether a preferred field name is required. Defaults to name
  var fieldHeader = params.fieldHeader === "fieldCode" ? "fieldCode": "name";

  var csvs = {};
  var mergedFields = {}; //an obj of all the fields a form has ever had over its history.
  var date =  moment().format("YYYY-MM-DD-hh-mm");

  //Checking if the field is a file type.
  //Currently only file, photo and signature are file types.
  function isFileType(type){
    return (type === 'file' || type === 'photo' || type === 'signature');
  }

  //Checking if the field is a barcode type.
  function isBarcodeType(type){
    return (type === 'barcode');
  }

  //merge fields
  async.series([
    function mergeFields(callback){
      //each submission each page each field add to mergedFields Obj
      async.map(submissions, function (sub , cb){
        if(sub && sub.formSubmittedAgainst) {
          var formId = sub.formSubmittedAgainst._id;
          if(! mergedFields[formId]){
            mergedFields[formId] = {};
          }
          sub.formSubmittedAgainst.pages.forEach(function (p) {
            p.fields.forEach(function (f) {
              if (!mergedFields[formId].hasOwnProperty(f._id) && 'matrix' !== f.type && 'sectionBreak' !== f.type) {
                mergedFields[formId][f._id] = f;
              }

              //If the field is repeating and the merged field is not, the mergedField should be switched
              if(f.repeating && !mergedFields[formId][f._id].repeating){
                mergedFields[formId][f._id] = f;
              }

              //If the field max repeat values are larger, then swap it out.
              if(f.repeating && mergedFields[formId][f._id].repeating && f.fieldOptions.definition.maxRepeat > mergedFields[formId][f._id].fieldOptions.definition.maxRepeat){
                mergedFields[formId][f._id] = f;
              }
            });
          });
        }
        cb();
      },callback);
    },
    function mapSubmission (callback){
      async.map(submissions, processSubmission, callback);
    }],function complete(err){
    if(err) return cb(err);
    else{
      return cb(undefined , csvs);
    }
  });

  // process single submission
  function processSubmission(sub, cb) {
    if(! sub.formSubmittedAgainst){
      //ignore very old submissions
      return cb();
    }
    var csv = '';
    var fieldRepeatIndex = 0;
    var formId = sub.formSubmittedAgainst._id;

    var csvKey=date + "-" + sub.formSubmittedAgainst.name;

    var form = mergedFields[formId];
    var fieldKeys = Object.keys(form);

    if (!csvs[csvKey]) {
      //for each form get each of the unique fields and add a header
      fieldKeys.forEach(function (fieldKey){
        // check if its a repeating form (and extra headers required)
        var field = form[fieldKey];

        //Fields may not have a field code, if not just use the field name.
        var headerName = typeof(field[fieldHeader]) === "string" ? field[fieldHeader] : field.name;

        if (field.repeating === true) {
          if (!field.fieldOptions || !field.fieldOptions.definition || !field.fieldOptions.definition.maxRepeat) return cb("Bad Submission: expected 'field.fieldOptions.definition' to de defined for a a repeating field");
          for (fieldRepeatIndex = 0; fieldRepeatIndex < field.fieldOptions.definition.maxRepeat; fieldRepeatIndex++) {
            csv = generateCSVHeader(csv, field, headerName, fieldRepeatIndex);
          }
        } else {
          csv = generateCSVHeader(csv, field, headerName, null);
        }
      });

      csv += '\r\n';
      csvs[csvKey] = csv;
    }

    //Generating CSV Headers
    function generateCSVHeader(csv, field, headerName, fieldRepeatIndex){
      if (csv !== '') csv += ',';

      //If it is a file type field, need to add two fields for the file name and url
      if(typeof(fieldRepeatIndex) === "number"){
        if(isFileType(field.type)){
          csv += csvStr(headerName + '-' + (fieldRepeatIndex + 1) + "-name") + ",";
          csv += csvStr(headerName + '-' + (fieldRepeatIndex + 1) + "-url");
        } else if(isBarcodeType(field.type)){
          csv += csvStr(headerName + '-' + (fieldRepeatIndex + 1) + "-format") + ",";
          csv += csvStr(headerName + '-' + (fieldRepeatIndex + 1) + "-text");
        } else {
          csv += csvStr(headerName + '-' + (fieldRepeatIndex + 1));
        }
      } else {
        //If it is a file type field, need to add two fields for the file name and url
        if(isFileType(field.type)){
          csv += csvStr(headerName + "-name") + ",";
          csv += csvStr(headerName + "-url");
        } else if(isBarcodeType(field.type)){
          csv += csvStr(headerName + "-format") + ",";
          csv += csvStr(headerName + "-text");
        } else {
          csv += csvStr(headerName);
        }
      }


      return csv;
    }

    function generateCSVSingleValue(field, val){
      var line = '';
      var fieldValue = val;
      if(!(typeof(fieldValue) === 'undefined' || fieldValue === null)){
        //Value is something, add the value
        if (field.type === 'checkboxes') {
          fieldValue = val.selections;
        } else if (isFileType(field.type)) {
          //File types have two fields, a name and url to be added
          if (val.fileName){
            fieldValue = val.fileName;
          } else{
            fieldValue = '<not uploaded>';
          }
        } else if(isBarcodeType(field.type)){
          if(val.format){
            fieldValue = val.format;
          } else {
            fieldValue = "<not set>";
          }
        }
        line += csvStr(fieldValue);
        line += ',';

        //If it is a file type, then the url should also be added
        if (isFileType(field.type)){
          if (val.groupId){
            fieldValue = downloadUrl.replace(":id", sub._id).replace(":fileId", val.groupId);
          } else{
            fieldValue = '<not uploaded>';
          }

          line += csvStr(fieldValue);
          line += ',';
        } else if(isBarcodeType(field.type)){
          if(val.text){
            fieldValue = val.text;
          } else {
            fieldValue = "<not set>";
          }
          line += csvStr(fieldValue);
          line += ',';
        }

      } else {
        //No value, spacers have to be added.

        //For file type, the file name and url are included. Therefore blank values have to be spaced twice.
        if (isFileType(field.type)) {
          line += ',,';
        } else if(isBarcodeType(field.type)) {
          line += ',,';
        }else {
          line += ',';
        }

      }

      return line;
    }

    function generateCSVFielValues(baseField, ff){
      var line = '';
      var fieldValues = [];

      if(ff){
        fieldValues = ff.fieldValues;
      }

      if(baseField.repeating){
        for (var j = 0; j < baseField.fieldOptions.definition.maxRepeat; j++) {
          line += generateCSVSingleValue(baseField, fieldValues[j]);
        }
      } else {
        line += generateCSVSingleValue(baseField, fieldValues[0]);
      }

      return line;
    }

    // now the body..
    var line = '';

    form = mergedFields[formId];
    fieldKeys = Object.keys(form);
    fieldKeys.forEach(function (fieldKey) {
      // check if its a repeating form (and extra headers required)
      var field = form[fieldKey];
      var ff = getSubmissionFormField(sub, field);

      line += generateCSVFielValues(field, ff);
    });
    //The generation process will always produce an extra , at the end. Can be cut off.
    line = line.slice(0, -1);
    csvs[csvKey] += line + '\r\n';
    return cb();
  }
}

// helper function to see if a submission contains a form field (which we get from the form itself)
function getSubmissionFormField(sub, formField) {
  for (var i=0; i<sub.formFields.length; i++) {
    var subField = sub.formFields[i];
    if (subField.fieldId._id.toString() === formField._id.toString()) {
      return subField;
    }
  }
  return null;
}

// returns the 'csv' version of the string - see CSV 'specification': http://tools.ietf.org/html/rfc4180
function csvStr(val) {
  if (val === null) return '';
  if (typeof val === 'number') return val;
  if (val instanceof Array) {
    val = val.join(',');
  }else {
    if (val instanceof Object) {
      var ret = '';
      for (var p in val) {
        if (ret !== '') ret = ret + ',';
        ret = ret + val[p];
      }
      val = ret;
    }
  }
  var csv = val;
  var quoteStr = false;
  if (val.indexOf(',') !== -1) quoteStr = true;
  if (val.indexOf('"') !== -1) {
    quoteStr = true;
    csv = csv.replace(/"/g, '""');
  }

  if (quoteStr === true) {
    csv = '"' + csv + '"';
  }

  csv = csv.replace(/\r?\n|\r/g, " ");

  return csv;
}



module.exports = {
  submissionsToCSV: submissionsToCSV
};