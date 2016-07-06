var mongoose = require('mongoose');
var clsMongoose = require('cls-mongoose');
var log = require('./lib/common/logger');
var forms = require('./lib/forms.js');
var formsMiddleware = require('./lib/middleware.js');

module.exports.core = forms;
module.exports.middleware = formsMiddleware;

module.exports.setLogger = function setFormsLogger(logger) {

  //fh-forms needs a logger.
  if (!logger) {
    console.log("FH-FORMS: No Logger passed for setLogger.");
    return;
  }

  log.setLogger(logger);

  if (logger.getLoggerNamespace) {
    var ns = logger.getLoggerNamespace();
    clsMongoose(ns, mongoose);
  }
};
module.exports.CONSTANTS = require('./lib/common/constants');