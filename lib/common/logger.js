var events = require('events');
var _ = require('underscore');
var fhLogger = require('fh-logger');

var logger;

var logit = {
  setLevel : function(level) {
    logger.level = level;
  },
  info: function() {
    logger.info.apply(logger, arguments);
    this.emitEvents('info', _.toArray(arguments));
  },
  trace: function() {
    logger.trace.apply(logger, arguments);
    this.emitEvents('trace', _.toArray(arguments));
  },
  debug: function() {
    logger.debug.apply(logger, arguments);
    this.emitEvents('debug', _.toArray(arguments));
  },
  warn: function() {
    logger.warn.apply(logger, arguments);
    this.emitEvents('warn', _.toArray(arguments));
  },
  error: function() {
    logger.error.apply(logger, arguments);
    this.emitEvents('error', _.toArray(arguments));
  },
  emitEvents: function(event, args) {
    this.events.emit(event, args);
    this.events.emit('*', event, args);
  },
  events: new events.EventEmitter()
};

function setLogger(newLogger) {
  var oldLogger = logger;
  logger = newLogger;
  return oldLogger;
}

function dummyErrorListener() {
  // when an event called "error" is emitted in node.js without something listening, node exits.
  // Since we want to use an event called error, we add this dummy listener to the event, which avoids
  // the default behavior for this case
}

function getLogger() {

  if (!logger) {
    setLogger(fhLogger.createLogger({
      name: 'basic-logger',
      level: 'debug',
      src: true
    }));
  }

  logit.events.removeListener('error', dummyErrorListener);
  logit.events.addListener('error', dummyErrorListener);

  return logit;
}

module.exports = {
  setLogger: setLogger,
  getLogger: getLogger
};
