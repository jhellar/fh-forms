var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('./constants.js');
var logger = require('./logger').getLogger();

var _ = require('underscore');

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
    FORM_SUBMISSION: "FormSubmission",
    GROUPS: "Groups",
    APP_CONFIG: "AppConfig",
    DATA_SOURCE: "DataSource",
    DATA_SOURCE_CACHE: "DataSourceCache",
    DATA_TARGET: "DataTarget"
  };

  var allowedFontStyles = ["normal", "bold", "italic"];
  var allowedBorderThicknesses = ["none", "thin", "medium", "thick"];
  var allowedBorderStyles = ["solid", "dotted", "dashed", "double"];

  var default_config = {
    "client": {
      "sent_save_min": 5,
      "sent_save_max": 100,
      "sent_items_to_keep_list": [5, 10, 20, 30, 40, 50, 100],
      "targetWidth": 480,
      "targetHeight": 640,
      "quality": 75,
      "debug_mode": false,
      "logger" : false,
      "max_retries" : 0,
      "timeout" : 30,
      "log_line_limit": 300,
      "log_email": ""
    },
    "cloud": {
      "logging": {
        "enabled":false
      }
    }
  };
  var FORM_CONSTANTS = {
    DATA_SOURCE_TYPE_STATIC: "static",
    DATA_SOURCE_TYPE_DATA_SOURCE: "dataSource",
    FIELD_TYPE_CHECKBOXES: "checkboxes",
    FIELD_TYPE_RADIO: "radio",
    FIELD_TYPE_DROPDOWN: "dropdown",
    FIELD_TYPE_TEXT: "text",
    FIELD_TYPE_TEXT_AREA: "textarea",
    FIELD_TYPE_URL: "url",
    FIELD_TYPE_NUMBER: "number",
    FIELD_TYPE_EMAIL: "emailAddress",
    FIELD_TYPE_LOCATION: "location",
    FIELD_TYPE_MAP: "locationMap",
    FIELD_TYPE_PHOTO: "photo",
    FIELD_TYPE_SIGNATURE: "signature",
    FIELD_TYPE_FILE: "file",
    FIELD_TYPE_DATE_TIME: "dateTime",
    FIELD_TYPE_SECTION_BREAK: "sectionBreak",
    FIELD_TYPE_MATRIX: "matrix",
    FIELD_TYPE_BARCODE: "barcode",
    FIELD_TYPE_SLIDER_NUMBER: "sliderNumber"
  };

  var defaults = {
    refreshIntervalMin: 1,
    refreshIntervalMax: 10080
  };

  function isValidDataSourceFieldType(type){
    return type === FORM_CONSTANTS.FIELD_TYPE_CHECKBOXES || type === FORM_CONSTANTS.FIELD_TYPE_RADIO || type === FORM_CONSTANTS.FIELD_TYPE_DROPDOWN;
  }

  return {
    "init": function (conn, config) {
      config = config || {};
      var schemaOptions = { strict: true,  versionKey: false  };
      var schemaOptionsNoId = _.extend({_id: false}, schemaOptions);

      var pageSchema = new Schema({
        "name" : String,
        "description": String,
        "fields" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD }]
      }, schemaOptions);

      var fieldSchema = new Schema({
        "name": {type: String, required: true},
        "helpText": String,
        "dataSource": { type: Schema.Types.ObjectId, ref: MODELNAMES.DATA_SOURCE, required: false },
        "dataSourceType": {type: String, enum: [FORM_CONSTANTS.DATA_SOURCE_TYPE_STATIC, FORM_CONSTANTS.DATA_SOURCE_TYPE_DATA_SOURCE], default: FORM_CONSTANTS.DATA_SOURCE_TYPE_STATIC},
        "fieldCode": {type: String, required: false},//Unique field code defined by the user.
        "type": {type: String, required: true, enum: [FORM_CONSTANTS.FIELD_TYPE_TEXT, FORM_CONSTANTS.FIELD_TYPE_TEXT_AREA, FORM_CONSTANTS.FIELD_TYPE_URL, FORM_CONSTANTS.FIELD_TYPE_NUMBER, FORM_CONSTANTS.FIELD_TYPE_EMAIL, FORM_CONSTANTS.FIELD_TYPE_CHECKBOXES, FORM_CONSTANTS.FIELD_TYPE_RADIO, FORM_CONSTANTS.FIELD_TYPE_DROPDOWN, FORM_CONSTANTS.FIELD_TYPE_LOCATION, FORM_CONSTANTS.FIELD_TYPE_MAP, FORM_CONSTANTS.FIELD_TYPE_PHOTO, FORM_CONSTANTS.FIELD_TYPE_SIGNATURE, FORM_CONSTANTS.FIELD_TYPE_FILE, FORM_CONSTANTS.FIELD_TYPE_DATE_TIME, FORM_CONSTANTS.FIELD_TYPE_SECTION_BREAK, FORM_CONSTANTS.FIELD_TYPE_MATRIX, FORM_CONSTANTS.FIELD_TYPE_BARCODE, FORM_CONSTANTS.FIELD_TYPE_SLIDER_NUMBER]},
        "repeating": {type: Boolean, default: false}, //All fields can be repeating.
        "fieldOptions": {type: Schema.Types.Mixed, default: {}, required: true},
        "required": {type: Boolean, required: true},
        "adminOnly": {type: Boolean, default: false}
      }, schemaOptions);

      fieldSchema.path('dataSourceType').validate(function(dataSourceType){
        //If the field type is set to be a dataSource, then a data source id should have been provided.
        if(dataSourceType === FORM_CONSTANTS.DATA_SOURCE_TYPE_DATA_SOURCE){
          return this.dataSource !== undefined;
        }

        return true;
      }, "Invalid Data Source Option");

      //Validating That Data Sources Are Not Applied To Incorrect Fields
      fieldSchema.path('dataSourceType').validate(function(dataSourceType){
        if(dataSourceType === FORM_CONSTANTS.DATA_SOURCE_TYPE_DATA_SOURCE){
          return isValidDataSourceFieldType(this.type);
        }

        return true;
      }, "Data Sources Can Only Be Applied To Radio, Checkbox And Dropdown Fields");

      fieldSchema.path('fieldOptions').validate(function(fieldOptions){
        //If the data source type is static, then there should be field options specified

        if(this.dataSourceType === FORM_CONSTANTS.DATA_SOURCE_TYPE_STATIC && isValidDataSourceFieldType(this.type)){
          var definition = fieldOptions.definition || {};
          var options = definition.options || [];
          return options.length > 0;
        }

        //If it is data source, then no options are required.
        return true;
      }, "A Static Radio, Checkboxes or Dropdown Field Type Must Contain Field Options");

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
        "targetField": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD, required: true }]
      }, schemaOptions);

      var pageRulesSchema = new Schema({ // All fields in a page rule are required
        "type": {type: String, required: true, enum: ["skip", "show"]},
        "relationType" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalOperator" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
        "ruleConditionalStatements" : [ruleConditionalStatementsSchema],
        "targetPage": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE, required: true }]
      }, schemaOptions);

      var formSchema = new Schema({
        "dateCreated": {type : Date, default : Date.now, required: true},
        "lastUpdated": {type : Date, default : Date.now, required: true},
        "updatedBy" : {type: String, required: true},
        "createdBy": {type:String, required: true},
        "name" : {type: String, required: true},
        "description": String,
        "pages" : [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE }],
        "fieldRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FIELD_RULE }],
        "pageRules": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.PAGE_RULE }],
        "subscribers" : [{type: String}],
        "dataSources": {
          "formDataSources": [{type: Schema.Types.ObjectId, ref: MODELNAMES.DATA_SOURCE}],
          "lastRefresh": {type: Date, required: false}
        },
        "dataTargets": [{type: Schema.Types.ObjectId, ref: MODELNAMES.DATA_TARGET}]
      }, schemaOptions);

      formSchema.pre('validate', function (next){
        // all new forms will have a createdby this allows for old forms which do not have a createdBy
        if(! this.createdBy){
          this.createdBy = this.updatedBy;
        }
        next();
      });

      var styleSubSectionSchema = new Schema({
        "label": {type: String, requried: true},
        "id": {type: String, required: true},
        "typography": {
          "fontFamily": {type: String, required: false},
          "fontStyle": {type: String, required: false, enum: allowedFontStyles},
          "fontSize": {type: String, required: false},
          "fontColour": {type: String, required: false}
        },
        "border": {
          "thickness": {type: String, required: false, enum: allowedBorderThicknesses},
          "style": {type: String, required: false, enum: allowedBorderStyles},
          "colour": {type: String, required: false}
        },
        "background": {
          "background_color": {type: String, required: false}
        },
        "margin":{
          "top": {type: String, required: false},
          "right": {type: String, required: false},
          "bottom": {type: String, required: false},
          "left": {type: String, required: false}
        },
        "padding":{
          "top": {type: String, required: false},
          "right": {type: String, required: false},
          "bottom": {type: String, required: false},
          "left": {type: String, required: false}
        }
      }, {_id : false});

      var styleSectionSchema = new Schema({
        "label": {type: String, required: true},
        "id": {type: String, required: true},
        "sub_sections": [styleSubSectionSchema]
      }, {_id : false});

      var staticCSSSchema = new Schema({
        "key": {type: String, required:true},
        "value": {type: String, required:true}
      }, {_id: false});

      var themeStructureSubSections = new Schema({
        "label": {type: String, requried: true},
        "id": {type: String, required: true},
        "style": {
          "typography": {type: Boolean, required: true},
          "border": {type: Boolean, required: true},
          "background": {type: Boolean, required: true},
          "margin": {
            "top": {type: Boolean, required: false},
            "right": {type: Boolean, required: false},
            "bottom": {type: Boolean, required: false},
            "left": {type: Boolean, required: false}
          },
          "padding": {
            "top": {type: Boolean, required: false},
            "right": {type: Boolean, required: false},
            "bottom": {type: Boolean, required: false},
            "left": {type: Boolean, required: false}
          }
        },
        "staticCSS": [staticCSSSchema],
        "classAdditions": [{
          "classNameAddition": {type: String, required:true},
          "cssAdditions": [staticCSSSchema]
        }]
      }, {_id : false});

      var themeStructureSchema = new Schema({
        "label": {type: String, required: true},
        "id": {type: String, required: true},
        "sub_sections": [themeStructureSubSections]
      }, {_id : false});

      var themeSchema = new Schema({ // When definining a theme, all fields are required except logo...
        "lastUpdated": {type : Date, default : Date.now},
        "updatedBy" : {type: String, required: true},
        "createdBy" : {type: String, required: true},
        "name": {type: String, required: true},
        "css" : {type : String, required:true, default: "/*Error Generating Appforms CSS*/"},
        "logo": {
          "base64String": {type: String, required: true},
          "height": {type: Number, required: true},
          "width": {type: Number, required: true}
        },
        "sections": [styleSectionSchema],
        "structure": {
          "sections": [themeStructureSchema],
          "logo": {
            "staticCSS": [staticCSSSchema]
          }
        }
      }, schemaOptions);

      themeSchema.pre('validate', function (next){
        if(! this.createdBy){
          this.createdBy = this.updatedBy;
        }
        next();
      });

      var appFormsSchema = new Schema({
        "appId": {type: String, required: true},
        "lastUpdated": {type : Date, default : Date.now, required: true},
        "forms": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FORM, required: true}]
      }, schemaOptions);

      var appConfigSchema = new Schema({
        "appId": {type: String, required: true, unique: true},
        "client": {
          "sent_save_min": {type : Number, required: false, default: default_config.client.sent_save_min},
          "sent_save_max": {type : Number, required: false, default: default_config.client.sent_save_max},
          "sent_items_to_keep_list": [{type : Number, required: false, default: default_config.client.sent_items_to_keep_list}],
          "targetWidth": {type : Number, required: false, default: default_config.client.targetWidth},
          "targetHeight": {type : Number, required: false, default: default_config.client.targetHeight},
          "quality": {type : Number, required: false, default: default_config.client.quality},
          "debug_mode": {type: Boolean, required: false, default: default_config.client.debug_mode},
          "logger" : {type: Boolean, required: false, default: default_config.client.logger},
          "max_retries" : {type : Number, required: false, default: default_config.client.max_retries},
          "timeout" : {type : Number, required: false, default: default_config.client.timeout},
          "log_line_limit": {type : Number, required: false, default: default_config.client.log_line_limit},
          "log_email": {type: String, default: default_config.client.log_email},
          "config_admin_user": [{type: String}],
          "log_level": {type:String,required:true, default:1},
          "log_levels": {type:Array, required: false, default:["error", "warning", "log", "debug"]}
        },
        "cloud": {
          "logging": {
            "enabled": {type: Boolean, required: false, default: default_config.cloud.logging.enabled}
          }
        }
      }, schemaOptions);

      var appThemesSchema = new Schema({
        "appId": {type: String, required: true},
        "theme": { type: Schema.Types.ObjectId, ref: MODELNAMES.THEME, required: true }
      }, schemaOptions);

      var groupsSchema = new Schema({
        "name": {type: String, required: true},
        "users" : [{ type: String, required: true}],
        "forms": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FORM, required: true}],
        "apps" : [{ type: String, required: true}],
        "themes": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.THEME, required: true}]
      }, schemaOptions);

      groupsSchema.pre('save', function (next){
        if(null === this.users) this.users = [];
        if(null === this.forms) this.forms = [];
        if(null === this.apps) this.apps = [];
        if(null === this.themes) this.themes = [];
        next();
      });

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
        "metaData": {type: Schema.Types.Mixed},
        "timezoneOffset" : {"type" : Number, required: true},
        "appId": {type: String, required: true},
        "appClientId": {type: String, required: true},
        "appCloudName": {type: String, required: true},
        "appEnvironment": {type: String, required: true},
        "formSubmittedAgainst":{type: Object, required: false},
        "formId": { type: Schema.Types.ObjectId, ref: MODELNAMES.FORM , required: true},
        "userId": {type: String, required: false},
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

      var dataSourceCacheOption = new Schema({
        key: {type: String, required: true},
        value: {type: String, required: true},
        selected: {type: Boolean, required: true}
      }, schemaOptionsNoId);

      //Validator To Ensure Data Is Updated Correctly
      function emptyValidator(value){
        if(this.currentStatus && this.currentStatus.status === "ok"){
          return !!value;
        }

        return true;
      }

      var dataSourceCacheSchema = new Schema({
        lastRefreshed: {type: Date, validate: emptyValidator},
        currentStatus: {
          status: {type: String, enum: ["ok", "error"], required: true, default: "ok"},
          error: {
            code: {type: String, required: false},
            userDetail: {type: String, required: false},
            systemDetail: {type: String, required: false}
          }
        },
        dataHash: {type: String, validate: emptyValidator},
        data: {
          type: [dataSourceCacheOption],
          validate: function(value){
            if(this.currentStatus && this.currentStatus.status === "ok"){
              return value.length > 0
            }

            return true;
          }
        }
      }, schemaOptionsNoId);


      var dataSourceSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        lastUpdated: {type : Date, default : Date.now, required: true},
        dateCreated: {type : Date, default : Date.now, required: true},
        updatedBy : {type: String, required: true},
        createdBy: {type:String, required: true},
        endpoint: {type: String, required: true},
        refreshInterval: {type: Number, required: true, min: config.refreshIntervalMin || defaults.refreshIntervalMin, max: config.refreshIntervalMax || defaults.refreshIntervalMax},
        serviceGuid: {type: String, required: true},
        cache: [dataSourceCacheSchema]
      }, schemaOptions);


      //There should only ever be at most one cache entry.
      function cacheValidator(cacheArray){
        return cacheArray.length <= 1;
      }

      dataSourceSchema.path('cache').validate(cacheValidator, 'Data Cache Is Invalid');

      var dataTargetSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        lastUpdated: {type : Date, default : Date.now, required: true},
        dateCreated: {type : Date, default : Date.now, required: true},
        updatedBy : {type: String, required: true},
        createdBy: {type:String, required: true},
        endpoints: {
          postProcessing: {type: String, required: false},
          realTimeData: {type: String, required: false},
          realTimeFile: {type: String, required: false}
        },
        serviceGuid: {type: String, required: true},
        type: {type: String, required: true, enum: [CONSTANTS.DATA_TARGET_TYPE_POST_PROCESSING, CONSTANTS.DATA_TARGET_TYPE_REAL_TIME]}
      }, schemaOptions);

      dataTargetSchema.pre('save', function(next){
        var endpoints = this.endpoints || {};
        //If The Data Target Is postProcessing, the postProcessing Endpoint Must Be Set
        var error;
        if(this.type === CONSTANTS.DATA_TARGET_TYPE_POST_PROCESSING){
          if(!endpoints.postProcessing){
            error = new Error("Post Processing Data Target Requires A Post Processing Endpoint");
          }
        }

        //Real Time Data Targets Required Two Endpoints:
        // Data Endpoint For JSON Submission
        // File Endpoint For Submission Files
        if(this.type === CONSTANTS.DATA_TARGET_TYPE_REAL_TIME){
          if(!endpoints.realTimeData || !endpoints.realTimeFile){
            error = new Error("Real Time Data Target Requires A Real Time Data And Real Time File Endpoints");
          }
        }

        return next(error);
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
      conn.model(MODELNAMES.GROUPS, groupsSchema);
      conn.model(MODELNAMES.APP_CONFIG, appConfigSchema);
      conn.model(MODELNAMES.DATA_SOURCE, dataSourceSchema);
      conn.model(MODELNAMES.DATA_TARGET, dataTargetSchema);
    },
    "get": function(conn, modelName){
      return conn.model(modelName);
    },
    "MODELNAMES": MODELNAMES,
    "FORM_CONSTANTS": FORM_CONSTANTS,
    "CONSTANTS": CONSTANTS
  };
};
