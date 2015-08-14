var async = require('async');
var models = require('../common/models.js')();
var _ = require('underscore');
var logger = require('../common/logger.js').getLogger();

module.exports = function(connections, options, cb){
  logger.debug("Exporting App Config");
  var conn = connections.mongooseConnection;
  var AppConfig = models.get(conn, models.MODELNAMES.APP_CONFIG);

  AppConfig.find({}).lean().exec(cb);
};