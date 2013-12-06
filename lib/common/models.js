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
    APP_THEMES: "AppThemes",
    FORM_SUBMISSION: "FormSubmission"
  };


  return{
    "init": function (conn) {
      var schemaOptions = { strict: true,  versionKey: false  };

      var pageSchema = new Schema({
        "name" : String,
        "description": String,
        "fields" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD }]
      }, schemaOptions);

      var fieldSchema = new Schema({
        "name": {type: String, required: true},
        "helpText": String,
        "type": {type: String, required: true, enum: ["text", "textarea", "number", "emailAddress", "dropdown", "radio", "checkboxes", "location", "locationMap", "photo", "signature", "file", "dateTime", "sectionBreak", "matrix"]},
        "repeating": {type: Boolean, default: false}, //All fields can be repeating.
        "fieldOptions": Schema.Types.Mixed,
        "required": {type: Boolean, required: true}
      }, schemaOptions);

      var ruleConditionalStatementsSchema = new Schema({
        "sourceField": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD, required: true},
        "restriction": {type: String, required: true, enum: ["is not","is equal to","is greater than","is less than","is at","is before","is after","is", "contains", "does not contain", "begins with", "ends with"]},
        "sourceValue": {type: String, required: true}
      }, {_id : false,  versionKey: false});

      var fieldRulesSchema = new Schema({ // All fields in a fieldRule are required
        "type": {type: String, required: true, enum: ["show", "hide"]},
        "relationType" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalOperator" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalStatements" : [ruleConditionalStatementsSchema],
        "targetField": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD, required: true }
      }, schemaOptions);

      var pageRulesSchema = new Schema({ // All fields in a page rule are required
        "type": {type: String, required: true, enum: ["skip", "show"]},
        "relationType" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalOperator" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalStatements" : [ruleConditionalStatementsSchema],
        "targetPage": { type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE, required: true }
      }, schemaOptions);

      var formSchema = new Schema({
        "dateCreated": {type : Date, default : Date.now, required: true},
        "lastUpdated": {type : Date, default : Date.now, required: true},
        "updatedBy" : {type: String, required: true},
        "name" : {type: String, required: true},
        "description": String,
        "pages" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE }],
        "fieldRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD_RULE }],
        "pageRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE_RULE }]
      }, schemaOptions);


      var themeSchema = new Schema({ // When definining a theme, all fields are required except logo...
        "lastUpdated": {type : Date, default : Date.now},
        "updatedBy" : {type: String, required: true},
        "name": {type: String, required: true},
        "css" : {type : String, required:true, default: "/*Error Generating Appforms CSS*/"},
        "logo": String,
        "colours": {
          "buttons": {
            "navigation": {type: String, required: true},
            "action": {type: String, required: true},
            "cancel": {type: String, required: true}
          },
          "backgrounds": {
            "headerBar": {type: String, required: true},
            "navigationBar": {type: String, required: true},
            "body": {type: String, required: true},
            "form": {type: String, required: true},
            "fieldArea": {type: String, required: true},
            "fieldInput": {type: String, required: true},
            "fieldInstructions": {type: String, required: true}
          }
        },
        "typography" : {
          "title": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          },
          "description": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          },
          "fieldTitle": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          },
          "fieldInput": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          },
          "instructions": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          },
          "buttons": {
            "fontFamily": {type: String, required: true},
            "fontStyle": {type: String, required: true, enum: ["normal", "bold", "italic"]},
            "fontSize": {type: String, required: true},
            "fontColour": {type: String, required: true}
          }
        },
        "borders": {
          "forms": {
            "thickness": {type: String, required: true, enum: ["none", "hairline", "thin", "medium", "thick"]},
            "style": {type: String, required: true, enum: ["solid", "dotted", "dashed", "double"]},
            "colour": {type: String, required: true}
          },
          "fieldArea": {
            "thickness": {type: String, required: true, enum: ["none", "hairline", "thin", "medium", "thick"]},
            "style": {type: String, required: true, enum: ["solid", "dotted", "dashed", "double"]},
            "colour": {type: String, required: true}
          },
          "fieldInput": {
            "thickness": {type: String, required: true, enum: ["none", "hairline", "thin", "medium", "thick"]},
            "style": {type: String, required: true, enum: ["solid", "dotted", "dashed", "double"]},
            "colour": {type: String, required: true}
          },
          "instructions": {
            "thickness": {type: String, required: true, enum: ["none", "hairline", "thin", "medium", "thick"]},
            "style": {type: String, required: true, enum: ["solid", "dotted", "dashed", "double"]},
            "colour": {type: String, required: true}
          }
        }
      }, schemaOptions);

      var appFormsSchema = new Schema({
        "appId": {type: String, required: true},
        "forms": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FORM, required: true}]
      }, schemaOptions);

      var appThemesSchema = new Schema({
        "appId": {type: String, required: true},
        "theme": { type: Schema.Types.ObjectId, ref: MODELNAMES.THEME, required: true }
      }, schemaOptions);


      var formFieldsSchema = new Schema({
        "fieldId": { type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD},
        "fieldValues": Schema.Types.Mixed
      }, {_id : false});

      var submissionCommentsSchema = new Schema({
        "madeBy": {type: String, required: true},
        "madeOn": {type: Date, required: true},
        "value": {type: String, required: true}
      }, {_id : false,  versionKey: false});

      var formSubmissionSchema = new Schema({
        "submissionCompletedTimestamp": {"type": Date, default: 0, required: true},
        "updatedBy": {type: String},
        "updatedTimestamp": {"type": Date, default: Date.now},
        "appId": {type: String, required: true},
        "appCloudName": {type: String, required: true},
        "appEnvironment": {type: String, required: true},
        "formId": { type: Schema.Types.ObjectId, ref: MODELNAMES.FORM , required: true},
        "userId": {type: String, required: true},
        "deviceId": {type: String, required: true},
        "deviceIPAddress": {type: String, required: true},
        "submissionStartedTimestamp": {type : Date, default : Date.now, required: true},
        "status": {type: String, enum: ["pending", "complete", "error"],  required:true, default: "pending"},
        "deviceFormTimestamp": {type: Date, required: true},
        "masterFormTimestamp": {type: Date, required: true},
        "comments": [submissionCommentsSchema],
        "formFields": [formFieldsSchema]
      }, schemaOptions);

      formSubmissionSchema.pre('save', function (next) {
        var newTimestamp = Date.now();
        if (process.env.FH_FORMS_DEBUG) console.log('formSubmissionSchema pre save this.updatedTimestamp:', this.updatedTimestamp.getTime(), ' newTimestamp:', newTimestamp);
        this.updatedTimestamp = newTimestamp;
        next();
      });

      conn.model(MODELNAMES.FORM, formSchema);
      conn.model(MODELNAMES.PAGE, pageSchema);
      conn.model(MODELNAMES.FIELD, fieldSchema);
      conn.model(MODELNAMES.FIELD_RULE, fieldRulesSchema);
      conn.model(MODELNAMES.PAGE_RULE, pageRulesSchema);
      conn.model(MODELNAMES.THEME, themeSchema);
      conn.model(MODELNAMES.APP_FORMS, appFormsSchema);
      conn.model(MODELNAMES.APP_THEMES, appThemesSchema);
      conn.model(MODELNAMES.FORM_SUBMISSION, formSubmissionSchema);
    },
    "get": function(conn, modelName){
      return conn.model(modelName)
    },
    "MODELNAMES": MODELNAMES
  }
}