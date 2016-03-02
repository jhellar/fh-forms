
var _ = require('underscore');
var CONSTANTS = require('../../common/constants');

/**
 * Processes The Data Source JSON Into The Correct Response Format
 * @param dataSourceJSON
 * @param params
 *  - includeAuditLog: Flag to identify if an audit log is to be returned or not.
 * @returns {*}
 */
module.exports = function processDataSourceResponse(dataSourceJSON, params){
  var cacheEntry = dataSourceJSON.cache[0];
  params = params || {};

  //If there is a cache entry, map the keys to the json, remove the entry
  if(cacheEntry){
    //Moving The Cache Entry To The Top Of The Object For API Consistency.
    //Not Interested In The Cache Entry _id
    cacheEntry = _.omit(cacheEntry, CONSTANTS.DATA_SOURCE_ID);

    //Remove The _id parameter from option subdocuments.
    cacheEntry.data = _.map(cacheEntry.data, function(optionEntry){
      return _.omit(optionEntry, CONSTANTS.DATA_SOURCE_ID);
    });

    dataSourceJSON = _.extend(dataSourceJSON, cacheEntry);
  }

  //Don't need the cache entry any more
  dataSourceJSON = _.omit(dataSourceJSON, "cache");

  //Assigning The Audit Log If Required, otherwise don't need it in the response.
  //Useful for limiting the amount of data returned.
  dataSourceJSON = params.includeAuditLog ? dataSourceJSON : _.omit(dataSourceJSON, "auditLogs");

  return dataSourceJSON;
};
