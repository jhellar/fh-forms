var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var crypto = require('crypto');

module.exports = function (){
  var MODELNAMES = {
    FORM: "Form",
    PAGE: "Page",
    FIELD: "Field",
    THEME: "Theme",
    FIELD_RULE : "FieldRule",
    PAGE_RULE: "PageRule",
    APP_FORMS: "AppForms",
    APP_THEMES: "AppThemes"
  };


  return{
    "init": function (conn) {
      var schemaOptions = { strict: "throw" };

      var pageSchema = new Schema({
        "name" : String,
        "description": String,
        "fields" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD }]
      }, schemaOptions);

      var fieldSchema = new Schema({
        "label": String,
        "helpText": String,
        "type": String,  //TODO Type can be: singleText, multiText, number, emailAddress, dropDownList, radioButtons, checkbox, locationLatLong, locationNorthEast, locationMap, photo, signature, file, date, time, dateAndTime, sectionBreak,
        "repeating": {type: Boolean, default: false}, //All fields can be repeating.
        "fieldOptions": [{
          "key": String,
          "val": String
        }],
        "required": Boolean
      }, schemaOptions);

      var fieldRulesSchema = new Schema({
        "type": String,
        "sourceField": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD },
        "restriction": String,
        "sourceValue": String,
        "targetField": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD }
      }, schemaOptions);

      var pageRulesSchema = new Schema({
        "type": String,
        "sourceField": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD },
        "restriction": String,
        "sourceValue": String,
        "targetPage": { type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE }
      }, schemaOptions);

      var formSchema = new Schema({
        "lastUpdated": {type : Date, default : Date.now},
        "updatedBy" : String,
        "formName" : String,
        "formDescription": String,
        "pages" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE }],
        "fieldRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD_RULE }],
        "pageRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE_RULE }]
      }, schemaOptions);

      var fontSchema = new Schema({
        "fontFamily": String,
        "fontStyle": String,
        "fontSize": String,
        "fontColour": String
      });

      var themeSchema = new Schema({
        "lastUpdated": {type : Date, default : Date.now},
        "updatedBy" : String,
        "name": String,
        "logo": String,
        "colours": {
          "buttons": {
            "navigation": String,
            "action": String,
            "cancel": String
          },
          "backgrounds": {
            "headerBar": String,
            "navigationBar": String,
            "body": String,
            "form": String,
            "fieldArea": String,
            "fieldInput": String,
            "fieldInstructions": String
          }
        },
        "typeography" : {
          "title": [fontSchema],
          "description": [fontSchema],
          "fieldTitle": [fontSchema],
          "fieldText": [fontSchema],
          "instructions": [fontSchema],
          "buttons": [fontSchema]
        },
        "borders": {
          "forms": {
            "thickness": String,
            "style": String,
            "colour": String
          },
          "instructions": {
            "thickness": String,
            "style": String,
            "colour": String
          }
        }
      }, schemaOptions);

      var appFormsSchema = new Schema({
        "appId": String,
        "forms": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FORM }]
      }, schemaOptions);

      var appThemesSchema = new Schema({
        "appId": String,
        "theme": { type: Schema.Types.ObjectId, ref: MODELNAMES.THEME }
      }, schemaOptions);

      var formSubmissionSchema = new Schema({
        "submissionNumber": {"type": Number, default: 0},
        "appId": String,
        "appCloudName": String,
        "appEnvironment": String,
        "formId": { type: Schema.Types.ObjectId, ref: MODELNAMES.FORM },
        "formVersion": Number,
        "userId": String,
        "deviceId": String,
        "deviceIpAddress": String,
        "timestamp": {type : Date, default : Date.now},
        "comments": [{
          "madeBy": String,
          "madeOn": String,
          "value": String
        }],
        "formFields": [{
          "fieldId": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD },
          "fieldValue": [{
            "val": String //FieldValues can be repeating, therefore an array of values is required.
          }]
        }]
      }, schemaOptions);

      conn.model(MODELNAMES.FORM, formSchema);
      conn.model(MODELNAMES.PAGE, pageSchema);
      conn.model(MODELNAMES.FIELD, fieldSchema);
      conn.model(MODELNAMES.FIELD_RULE, fieldRulesSchema);
      conn.model(MODELNAMES.PAGE_RULE, pageRulesSchema);
      conn.model(MODELNAMES.THEME, themeSchema);
      conn.model(MODELNAMES.APP_FORMS, appFormsSchema);
      conn.model(MODELNAMES.APP_THEMES, appThemesSchema);
    },
    "get": function(conn, modelName){
      return conn.model(modelName)
    },
    "MODELNAMES": MODELNAMES
  }
}