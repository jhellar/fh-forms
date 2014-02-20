var util = require('util');
var _ = require('underscore');

var logger;

var logit = {
  info: function () {
    logger.info.apply(logger, arguments);
  },
  trace: function () {
    logger.trace.apply(logger, arguments);
  },
  debug: function () {
    logger.debug.apply(logger, arguments);
  },
  warning: function () {
    logger.warning.apply(logger, arguments);
  },
  error: function () {
    logger.error.apply(logger, arguments);
  }
};

function setLogger(newLogger) {
  var oldLogger = logger;
  logger = newLogger;
  return oldLogger;
};

function getLogger() {
  if(!logger) {
    logger = basicConsoleLogger;
  };

  return logit;
}

var basicConsoleLogger = {
  ERROR: 0,
  WARNING: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
  level: 3,

  log: function (){
    var self = this;
    var thisLevel = _.first(arguments) || self.ERROR;
    if(thisLevel <= self.level) {
      var args = _.rest(arguments);
      var strs = _.map(args, function(item) {
        return util.inspect(item, {depth:8});
      });
      console.log("" + thisLevel + ": ", strs.join(', '));
    }
  },

  info: function () {
    var args = [this.INFO];
    this.log.apply(this, args.concat(arguments));
  },

  debug: function () {
    var args = [this.DEBUG];
    this.log.apply(this, args.concat(arguments));
  },

  warning: function () {
    var args = [this.WARNING];
    this.log.apply(this, args.concat(arguments));
  },

  error: function () {
    var args = [this.ERROR];
    this.log.apply(this, args.concat(arguments));
  },

  trace: function () {
    var args = [this.TRACE];
    this.log.apply(this, args.concat(arguments));
  }
}

module.exports = {
  setLogger: setLogger,
  getLogger: getLogger
};