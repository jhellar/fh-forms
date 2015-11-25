
var _ = require('underscore');
var CONSTANTS = require('../../common/constants');

/**
 * Processes The Data Source JSON Into The Correct Response Format
 * @param dataSourceJSON
 * @returns {*}
 */
module.exports = function processDataSourceResponse(dataSourceJSON){
  var cacheEntry = dataSourceJSON.cache[0];

  //If there is a cache entry, map the keys to the json, remove the entry
  if(cacheEntry){
    //Moving The Cache Entry To The Top Of The Object For API Consistency.
    delete cacheEntry[CONSTANTS.DATA_SOURCE_ID]; //Not Interested In The Cache Entry _id

    //Remove The _id parameter from option subdocuments.
    cacheEntry.data = _.map(cacheEntry.data, function(optionEntry){
      delete optionEntry[CONSTANTS.DATA_SOURCE_ID];
      return optionEntry;
    });

    dataSourceJSON = _.extend(dataSourceJSON, cacheEntry);
  }

  delete dataSourceJSON.cache;

  return dataSourceJSON;
};