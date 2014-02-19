var models = require('../common/models.js')();
var validation = require('../common/validate.js');
var groups = require('./groups.js');
var async = require('async');
var logger = require('../common/logger.js');

module.exports = function () {
  logger.log(logger.DEBUG, "returning appConfig");
  return {
    updateAppConfig: updateAppConfig,
    createAppConfig: createAppConfig,
    getAppConfig: getAppConfig,
    deleteAppConfig: deleteAppConfig,
    setAppConfig: setAppConfig
  };

  /*
   * updateAppConfig(connections, options, appConfig, cb)
   *
   *    connections: {
   *       mongooseConnection: ...
   *    }
   *
   *    options: {
   *       uri:       db connection string,
   *       userEmail: user email address string
   *    }
   *
   *    appConfig: {
   *      appId: id of app
   *      "client": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       },
   *       "cloud": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       }
   *    }
   *
   *    cb  - callback function (err)
   *
   */
  function validateParams(connections, options, appConfig, paramsList, cb) {
    var validate = validation(appConfig);
    async.series([
      function(cb) {
        paramsList.push(cb);
        validate.has.apply(validate, paramsList);
      },
      function(cb) {
        groups.validateAppAllowedForUser(connections, options.restrictToUser, options.appId, cb);
      }
    ], cb);
  }

  function updateAppConfig(connections, options, appConfig, cb) {
    logger.log(logger.DEBUG, 'updateAppConfig()');
    validateParams(connections, options, appConfig, ["appId", "client", "cloud"], function(err) {
      if (err) return cb(err);

      var conn = connections.mongooseConnection;
      var appConfigModel = models.get(conn, models.MODELNAMES.APP_CONFIG);

      logger.log(logger.DEBUG, 'updateAppConfig() - validated about to search for: ', appConfig.appId);
      appConfigModel.findOne({appId:appConfig.appId}).exec(function (err, config) {
        if (err) return cb(err);  
        if (!config) {
          logger.log(logger.WARNING, 'updateAppConfig() - appConfig not found for: ', appConfig.appId);
          return cb(new Error('appConfig not found'));
        } else {
          config.client = appConfig.client;
          config.cloud = appConfig.cloud;
          logger.log(logger.DEBUG, 'updateAppConfig() - appConfig for: ', appConfig.appId, ', being updated to: ', config);
          config.save(function (err, config) {
            if (err) return cb(err);
            logger.log(logger.DEBUG, 'updateAppConfig() - appConfig saved, returning :', config.toJSON());
            return cb(undefined, config.toJSON());
          });
        }
      });
    });
  }

  /*
   * setAppConfig(connections, options, appConfig, cb)
   *
   * create or update an appconfig
   *
   *    connections: {
   *       mongooseConnection: ...
   *    }
   *
   *    options: {
   *       uri:       db connection string,
   *       userEmail: user email address string
   *    }
   *
   *    appConfig: {
   *      appId: id of app
   *      "client": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       },
   *       "cloud": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       }
   *    }
   *
   *    cb  - callback function (err)
   *
   */
  function setAppConfig(connections, options, appConfig, cb) {
    logger.log(logger.DEBUG, 'setAppConfig()');
    validateParams(connections, options, appConfig, ["appId", "client", "cloud"], function(err) {
      if (err) return cb(err);
      var conn = connections.mongooseConnection;
      var appConfigModel = models.get(conn, models.MODELNAMES.APP_CONFIG);

      logger.log(logger.DEBUG, 'setAppConfig() - validated about to search for: ', appConfig.appId);
      appConfigModel.findOne({appId:appConfig.appId}).exec(function (err, config) {
        if (err) return cb(err);  
        if (config) {
          logger.log(logger.DEBUG, 'setAppConfig() - appConfig already exists for: ', appConfig.appId, ', updating to: ', appConfig);
          config.client = appConfig.client;
          config.cloud = appConfig.cloud;
        } else {
          logger.log(logger.DEBUG, 'setAppConfig() - appConfig for: ', appConfig.appId, ', being created to: ', appConfig);
          config = new appConfigModel(appConfig);
        }
        config.save(function (err, config) {
          if (err) return cb(err);
          logger.log(logger.DEBUG, 'setAppConfig() - appConfig saved, returning :', config.toJSON());
          return cb(undefined, config.toJSON());
        });
      });
    });
  }

  /*
   * createAppConfig(connections, options, appConfig, cb)
   *
   *    connections: {
   *       mongooseConnection: ...
   *    }
   *
   *    options: {
   *       uri:       db connection string,
   *       userEmail: user email address string
   *    }
   *
   *    appConfig: {
   *      appId: id of app
   *      "client": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       },
   *       "cloud": {
   *         "logging": {
   *           "enabled": {type: Boolean, default: false}
   *         }
   *       }
   *    }
   *
   *    cb  - callback function (err)
   *
   */
  function createAppConfig(connections, options, appConfig, cb) {
    logger.log(logger.DEBUG, 'createAppConfig()');
    validateParams(connections, options, appConfig, ["appId", "client", "cloud"], function(err) {
      if (err) return cb(err);
      var conn = connections.mongooseConnection;
      var appConfigModel = models.get(conn, models.MODELNAMES.APP_CONFIG);

      logger.log(logger.DEBUG, 'createAppConfig() - validated about to search for: ', appConfig.appId);
      appConfigModel.findOne({appId:appConfig.appId}).exec(function (err, config) {
        if (err) return cb(err);  
        if (config) {
          logger.log(logger.WARNING, 'createAppConfig() - appConfig already exists for: ', appConfig.appId);
          return cb(new Error('appConfig already exists'));
        } else {
          logger.log(logger.DEBUG, 'createAppConfig() - appConfig for: ', appConfig.appId, ', being created to: ', appConfig);
          var newAppConfig = new appConfigModel(appConfig);
          newAppConfig.save(function (err, config) {
            if (err) return cb(err);
            logger.log(logger.DEBUG, 'createAppConfig() - appConfig saved, returning :', config.toJSON());
            return cb(undefined, config.toJSON());
          });
        }
      });
    });
  }

  /*
   * getAppConfig(connections, options, appConfig, cb)
   *
   *    connections: {
   *       mongooseConnection: ...
   *    }
   *
   *    options: {
   *       uri:       db connection string,
   *       userEmail: user email address string
   *    }
   *
   *    appConfig: {
   *      appId: id of the app
   *    }
   *
   *    cb  - callback function (err)
   *
   */
  function getAppConfig(connections, options, appConfig, cb) {
    logger.log(logger.DEBUG, 'getAppConfig()');
    validateParams(connections, options, appConfig, ["appId"], function(err) {
      if (err) return cb(err);
      var conn = connections.mongooseConnection;
      var appConfigModel = models.get(conn, models.MODELNAMES.APP_CONFIG);
      appConfigModel.findOne({appId: appConfig.appId}, function (err, config) {
        if (err) return cb(err);
        var result;
        if (!config) {
          logger.log(logger.WARNING, 'getAppConfig() - appConfig not found for: ', appConfig.appId);
          return cb(new Error('appConfig not found'));
        } else {
          logger.log(logger.DEBUG, 'getAppConfig() - returning :', config.toJSON());
          return cb(undefined, config.toJSON());
        }
      });
    });
  }

  /*
   * deleteAppConfig(connections, options, appConfig, cb)
   *
   *    connections: {
   *       mongooseConnection: ...
   *    }
   *
   *    options: {
   *       uri:       db connection string,
   *       userEmail: user email address string
   *    }
   *
   *    appConfig: {
   *      appId: id of the app
   *    }
   *
   *    cb  - callback function (err)
   *
   */
  function deleteAppConfig(connections, options, appConfig, cb) {
    logger.log(logger.DEBUG, 'deleteAppConfig()');
    validateParams(connections, options, appConfig, ["appId"], function(err) {
      if (err) return cb(err);
      var conn = connections.mongooseConnection;
      var appConfigModel = models.get(conn, models.MODELNAMES.APP_CONFIG);
      logger.log(logger.DEBUG, 'deleteAppConfig() - validated about to search for: ', appConfig.appId);
      appConfigModel.findOne({appId:appConfig.appId}).exec(function (err, config) {
        if (err) return cb(err);  
        if (!config) {
          logger.log(logger.WARNING, 'deleteAppConfig() - appConfig not found for: ', appConfig.appId);
          return cb(new Error('appConfig not found'));
        } else {
          logger.log(logger.DEBUG, 'deleteAppConfig() - deleting: ', appConfig.appId);
          config.remove(cb);
        }
      });
    });
  }
};
