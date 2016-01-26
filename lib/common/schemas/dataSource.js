var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

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
    auditLogs: [dsCacheAuditLog.dataSourceAuditLogEntry()]
  }, CONSTANTS.SCHEMA_OPTIONS);


  dataSourceSchema.path('cache').validate(cacheValidator, 'Data Cache Is Invalid');
  return dataSourceSchema;
};