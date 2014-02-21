var async = require('async');
var assert = require('assert');
var logfns = require('../../lib/common/logger.js');
var logger = logfns.getLogger();

var logs = {
  info: [],
  trace: [],
  debug: [],
  warn: [],
  error: []
};

var test_logger = {
  info: function (msg) {
    logs.info.push(msg);
  },
  trace: function (msg) {
    logs.trace.push(msg);
  },
  debug: function (msg) {
    logs.debug.push(msg);
  },
  warn: function (msg) {
    logs.warn.push(msg);
  },
  error: function (msg) {
    logs.error.push(msg);
  }
};

var logs_emitted = {
  info: [],
  trace: [],
  debug: [],
  warn: [],
  error: [],
  msg: []
};

function infohandler (logParams) {
  logs_emitted.info.push(logParams);
}

function tracehandler (logParams) {
  logs_emitted.trace.push(logParams);
}

function debughandler (logParams) {
  logs_emitted.debug.push(logParams);
}

function warnhandler (logParams) {
  logs_emitted.warn.push(logParams);
}

function errorhandler (logParams) {
  logs_emitted.error.push(logParams);
}

function msghandler (level, logParams) {
  logs_emitted.msg.push({level: level, logParams: logParams});
}

exports.setUp = function (finish) {
  logfns.setLogger(test_logger);
  logger.events.on('info', infohandler);
  logger.events.on('trace', tracehandler);
  logger.events.on('debug', debughandler);
  logger.events.on('warn', warnhandler);
  logger.events.on('error', errorhandler);
  logger.events.on('*', msghandler);
  finish();
};

exports.it_should_log_and_emit_messages = function (finish) {
  var types = ['info', 'trace', 'debug', 'warn', 'error'];

  async.each(types, function (type, cb) {
    logger[type]('test ' + type + ' message');
    return cb();
  }, function (err) {
    async.each(types, function (type, cb) {
      assert.equal(logs[type][0], 'test ' + type + ' message');
      assert.ok(logs_emitted[type][0]);
      assert.equal(logs_emitted[type][0][0], 'test ' + type + ' message');
      return cb();
    }, function (err) {
      assert.equal(logs_emitted.msg.length, types.length);
      return finish();
    });
  });
};

