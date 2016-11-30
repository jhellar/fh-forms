var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function() {
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
  }, CONSTANTS.SCHEMA_OPTIONS);

  dataTargetSchema.pre('save', function(next) {
    var endpoints = this.endpoints || {};
    //If The Data Target Is postProcessing, the postProcessing Endpoint Must Be Set
    var error;
    if (this.type === CONSTANTS.DATA_TARGET_TYPE_POST_PROCESSING && !endpoints.postProcessing) {
      error = new Error("Post Processing Data Target Requires A Post Processing Endpoint");
    }

    //Real Time Data Targets Required Two Endpoints:
    // Data Endpoint For JSON Submission
    // File Endpoint For Submission Files
    if (this.type === CONSTANTS.DATA_TARGET_TYPE_REAL_TIME && (!endpoints.realTimeData || !endpoints.realTimeFile)) {
      error = new Error("Real Time Data Target Requires A Real Time Data And Real Time File Endpoints");
    }

    return next(error);
  });

  return dataTargetSchema;
};