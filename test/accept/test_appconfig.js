require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var fs = require('fs');

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;

var TEST_APP_CONFIG = {
  "client": {
    "sent_save_min": 5,
    "sent_save_max": 1000,
    "targetWidth": 100,
    "targetHeight": 100,
    "quality": 75,
    "debug_mode": false,
    "logger" : false,
    "max_retries" : 0,
    "timeout" : 30,
    "log_line_limit": 300,
    "log_email": "testing@example.com",
    "config_admin_user": true
  },
  "cloud": {
    "logging": {
      "enabled":false
    }
  }
};


module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    finish();
  });
};

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.it_should_CRUD_appconfig = function(finish) {

  async.series([
    function getAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(options, params, function(err, result) {
        assert.ok(err, 'should not have found appConfig: ' + util.inspect(result));
        return cb();
      });
    },

    function craeteAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '12345';
      forms.createAppConfig(options, params, function(err, result) {
        assert.ok(!err, 'should have craeted appConfig: ' + util.inspect(err));
        assert.equal(75, result.client.quality);
        return cb();
      });
    },

    function getAppconfig2(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(options, params, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(75, result.client.quality);
        return cb();
      });
    },

    function updateAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '12345';
      params.client.quality = 80;
      forms.updateAppConfig(options, params, function(err, result) {
        assert.ok(!err, 'should have updated appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function getAppconfig3(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(options, params, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function deleteAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '12345';
      forms.deleteAppConfig(options, params, function(err, result) {
        assert.ok(!err, 'should have deleted appConfig: ' + util.inspect(err));
        return cb();
      });
    },

    function getAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(options, params, function(err, result) {
        assert.ok(err, 'should not have found appConfig: ' + util.inspect(result));
        return cb();
      });
    }

  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

