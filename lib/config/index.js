var _ = require('underscore');
var defaults = {
  //Default max interval between a data source update in milliseconds (7 days).
  dsMaxIntervalMs: 10800 * 60000,
  minsPerBackOffIndex: 1,
  //The maximum number of concurrent PDF generation generation tasks allowed per worker.
  //This is to limit the number of PhantomJS instances that are active as they are memory humgry.
  maxConcurrentPhantomPerWorker: 1
};
var config = {

};

module.exports = {
  get: function() {
    return config;
  },
  set: function(_config) {
    return _.extend(config, _config || {});
  },
  defaults: function() {
    return defaults;
  }
};
