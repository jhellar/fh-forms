var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');
var _ = require('underscore');

var dsCacheAuditLog = require('./dataSourceCache');

//There should only ever be at most one cache entry.
function cacheValidator(cacheArray){
  return cacheArray.length <= 1;
}

var defaults = {
  refreshIntervalMin: 1,
  refreshIntervalMax: 10080
};

module.exports = function(config){
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
    cache: [dsCacheAuditLog.dataSourceCacheEntry()],
    numAuditLogEntries: {type: Number, required: true, min: 10, default: 1000},
    auditLogs: [dsCacheAuditLog.dataSourceAuditLogEntry()]
  }, CONSTANTS.SCHEMA_OPTIONS);


  //Pruning out any unnecessary audit logs before saving the data source.
  //Removing older ones first
  dataSourceSchema.pre('save', function(next){
    var numInvalidAuditLogs = this.auditLogs.length - this.numAuditLogEntries;

    if(numInvalidAuditLogs > 0){
      this.auditLogs.splice(0, numInvalidAuditLogs);
      this.markModified('auditLogs');
    }

    next();
  });


  dataSourceSchema.path('cache').validate(cacheValidator, 'Data Cache Is Invalid');
  return dataSourceSchema;
};