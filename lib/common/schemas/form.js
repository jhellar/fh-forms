var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function(){
  var formSchema = new Schema({
    "dateCreated": {type : Date, default : Date.now, required: true},
    "lastUpdated": {type : Date, default : Date.now, required: true},
    "updatedBy" : {type: String, required: true},
    "createdBy": {type:String, required: true},
    "name" : {type: String, required: true},
    "description": String,
    "pages" : [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.PAGE }],
    "fieldRules": [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.FIELD_RULE }],
    "pageRules": [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.PAGE_RULE }],
    "subscribers" : [{type: String}],
    "dataSources": {
      "formDataSources": [{type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.DATA_SOURCE}],
      "lastRefresh": {type: Date, required: false}
    },
    "dataTargets": [{type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.DATA_TARGET}]
  }, CONSTANTS.SCHEMA_OPTIONS);

  formSchema.pre('validate', function (next){
    // all new forms will have a createdby this allows for old forms which do not have a createdBy
    if(! this.createdBy){
      this.createdBy = this.updatedBy;
    }
    next();
  });

  return formSchema;
};