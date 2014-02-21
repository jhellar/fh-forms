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

function infohandler (eventName, level, logParams) {
  logs_emitted.info.push({eventName:eventName, level: level, logParams: logParams});
}

function tracehandler (eventName, level, logParams) {
  logs_emitted.trace.push({eventName:eventName, level: level, logParams: logParams});
}

function debughandler (eventName, level, logParams) {
  logs_emitted.debug.push({eventName:eventName, level: level, logParams: logParams});
}

function warnhandler (eventName, level, logParams) {
  logs_emitted.warn.push({eventName:eventName, level: level, logParams: logParams});
}

function errorhandler (eventName, level, logParams) {
  logs_emitted.error.push({eventName:eventName, level: level, logParams: logParams});
}

function msghandler (eventName, level, logParams) {
  logs_emitted.msg.push({eventName:eventName, level: level, logParams: logParams});
}

exports.setUp = function (finish) {
  logfns.setLogger(test_logger);
  logger.events.on('log_info', infohandler);
  logger.events.on('log_trace', tracehandler);
  logger.events.on('log_debug', debughandler);
  logger.events.on('log_warn', warnhandler);
  logger.events.on('log_error', errorhandler);
  logger.events.on('log_msg', msghandler);
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
      assert.equal(logs_emitted[type][0].logParams[0], 'test ' + type + ' message');
      assert.equal(logs_emitted[type][0].eventName, 'log_' + type);
      assert.equal(logs_emitted[type][0].level, type);
      return cb();
    }, function (err) {
      assert.equal(logs_emitted.msg.length, types.length);
      return finish();
    });
  });
};

