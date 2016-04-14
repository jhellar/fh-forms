var _ = require('underscore');
var defaults = {
  dsMaxIntervalMs: 10800 * 60000,
  minsPerBackOffIndex: 1
};
var config = {

};

module.exports = {
  get: function(){
    return config;
  },
  set: function(_config){
    return _.extend(config, _config || {});
  },
  defaults: function(){
    return defaults;
  }
};
