var mongoose = require('mongoose');
var clsMongoose = require('fh-cls-mongoose');
var log = require('./lib/common/logger');


module.exports.init = function setFormsLogger(logger) {

  //fh-forms needs a logger.
  if (!logger) {
    var msg = "FH-FORMS: No Logger passed for forms init.";
    console.error(msg);
    throw "FH-FORMS: No Logger passed for forms init.";
  }

  log.setLogger(logger);

  if (logger.getLoggerNamespace) {
    var ns = logger.getLoggerNamespace();
    clsMongoose(ns, mongoose);
  }

  //Want the logger to be set before doing any requires as there are logger.getLogger statements at the top.
  module.exports.core = require('./lib/forms.js');
  module.exports.middleware = require('./lib/middleware.js');
};
module.exports.CONSTANTS = require('./lib/common/constants');
