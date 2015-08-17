var async = require('async');
var models = require('../common/models.js')();
var _ = require('underscore');
var logger = require('../common/logger.js').getLogger();
var setAppConfig = require('./appConfig.js')().setAppConfig;

module.exports = function(connections, options, appConfigToUpdate, cb){
  logger.debug("Importing App Config", {appConfigToUpdate: appConfigToUpdate});

  var AppConfig = models.get(connections.mongooseConnection, models.MODELNAMES.APP_CONFIG);

  async.each(appConfigToUpdate, function(appConfig, cb){
    AppConfig.findOneAndUpdate({_id : appConfig._id}, _.omit(appConfig, "_id"), {upsert: true}, cb);
  }, cb);
};