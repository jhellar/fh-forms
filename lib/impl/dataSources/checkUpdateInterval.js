var _ = require('underscore');
var config = require('../../config');
var MIN_MS = 60000;

/**
 * needsAnUpdate - Comparing the current time to when the data source needs to be updated.
 *
 * The backoff calculation is based on the assumption that
 *
 *  - update fails: wait 1 interval
 *  - update fails again: wait 2 intervals
 *  - update fails again: wait 3 interval
 *  ...
 *  ...
 *  ...
 *  - update fails again: wait a max of a week between refreshes
 *
 * @param  {object} dataSource            A data source to check
 * @param  {date} currentTime             The time to scan for
 * @param  {number}  minsPerBackOffIndex  The number of minutes to back-off per backOff interval
 * @return {boolean}                      true/false
 */
function needsAnUpdate(dataSource, currentTime){
  //The last time the Data Source was refreshed
  var lastRefreshedMs = new Date(dataSource.cache[0].lastRefreshed).valueOf();
  currentTime = new Date(currentTime);
  var conf = config.get();
  var defaults = config.defaults();

  //The number of minutes between backoffs
  var minsPerBackOffIndex = conf.minsPerBackOffIndex || defaults.minsPerBackOffIndex;

  //The number of milliseconds to wait until the Data Source needs to be refreshed.
  var refreshIntervalMs = dataSource.refreshInterval * MIN_MS;

  var backOffIndex = dataSource.cache[0].backOffIndex || 0;

  //The number of milliseconds to wait because of backing off from errors.
  var backOffMs = backOffIndex * (minsPerBackOffIndex * MIN_MS);
  //Will only wait a max of a week between failed updates.
  backOffMs = Math.min(backOffMs, conf.dsMaxIntervalMs || defaults.dsMaxIntervalMs);

  //The next time the Data Source will refresh will either be normal interval or the backOff interval, whichever is the largest.
  var nextRefreshMs = Math.max(refreshIntervalMs, backOffMs);

  //Checking if the total of the three times is <= currentTime. If it is, then the data source should try to update.
  return new Date(lastRefreshedMs + nextRefreshMs) <= currentTime;
}

/**
 * checkUpdateInterval - Function to filter any data sources that require an update.
 *
 * @param  {array} dataSources Array of data sources to check for update.
 * @param  {date} currentTime  The current time of scannning for updates.
 * @return {array}             Filtered list of data source requiring an update
 */
module.exports = function checkUpdateInterval(dataSources, currentTime){
  return _.filter(dataSources, function(dataSource){
    return !dataSource.cache[0] || !dataSource.cache[0].lastRefreshed || needsAnUpdate(dataSource, currentTime);
  });
};
