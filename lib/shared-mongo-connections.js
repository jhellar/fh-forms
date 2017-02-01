var mongoUrlParser = require('mongodb-uri');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var MONGODB_DEFAULT_POOL_SIZE = 20;

/**
 * Get the url to connect to the admin mongodb specified in the given `config` object.
 * @param {string} mongoConnectionString a mongodb url that should at least contain the mongodb hosts
 * @param {object} mongoConf the mongodb configuration
 * @param {string} mongoConf.admin_auth.user the admin username
 * @param {string} mongoConf.admin_auth.pass the amdin user password
 * @param {int} mongoConf.poolSize the poolSize of the mongodb connection. Default to 20.
 * @return {string} the mongodb admin connection url
 */
function getAdminDbUrl(mongoConnectionString, mongoConf) {
  var parsedMongoUrl = mongoUrlParser.parse(mongoConnectionString);
  parsedMongoUrl.username = mongoConf.admin_auth.user;
  parsedMongoUrl.password = mongoConf.admin_auth.pass;
  parsedMongoUrl.database = "admin";
  parsedMongoUrl.options = parsedMongoUrl.options || {};
  parsedMongoUrl.options.poolSize = mongoConf.poolSize || MONGODB_DEFAULT_POOL_SIZE;
  var mongourl = mongoUrlParser.format(parsedMongoUrl);
  return mongourl;
}

/**
 * Create a new mongodb admin connection.
 * @param {string} mongoAdminDbUrl the url to connect to the mongodb admin database
 * @param {object} logger
 * @param {function} cb the callback function
 */
function getMongodbConnection(mongoAdminDbUrl, logger, cb) {
  logger.debug("creating mongodb connection for data_source_update job", {mongoAdminDbUrl});
  MongoClient.connect(mongoAdminDbUrl, cb);
}

/**
 * Create a new mongoose admin connection.
 * @param {string} mongoAdminDbUrl the url to connect to the mongodb admin database
 * @param {object} logger
 * @param {function} cb the callback function
 */
function getMongooseConnection(mongoAdminDbUrl, logger, cb) {
  logger.debug("creating mongoose connection for data_source_update job", {mongoAdminDbUrl});
  var mongooseConnection = mongoose.createConnection(mongoAdminDbUrl);
  return cb(undefined, mongooseConnection);
}

/**
 * Setup new mongodb and mongoose connections to the given database.
 * @param {object} logger
 * @param {string} mongoAdminDbUrl  the mongodb connection string
 * @param {object} config the configuration object
 * @param {function} cb the callback function
 */
module.exports = function(logger, mongoConnectionString, config, cb) {
  logger.debug("setup mongodb connections", {mongoConnectionString, config});
  var mongoAdminDbUrl = getAdminDbUrl(mongoConnectionString, config.mongo);
  logger.debug("formated mongo connection url", {mongoAdminDbUrl});
  async.series([
    async.apply(getMongodbConnection, mongoAdminDbUrl, logger),
    async.apply(getMongooseConnection, mongoAdminDbUrl, logger)
  ], function(err, results){
    if (err) {
      logger.error("Failed to setup db connection", {err});
      return cb(err);
    }
    return cb(undefined, {
      mongodbConnection: results[0],
      mongooseConnection: results[1]
    });
  });
};