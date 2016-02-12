require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var _ = require('underscore');

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;

var TEST_APP_CONFIG = {
  "client": {
    "sent_save_min": 5,
    "sent_save_max": 1000,
    "targetWidth": 100,
    "targetHeight": 100,
    "quality": 80,
    "debug_mode": false,
    "logger" : false,
    "max_retries" : 0,
    "timeout" : 30,
    "log_line_limit": 300,
    "log_email": "testing@example.com"
  },
  "cloud": {
    "logging": {
      "enabled":false
    }
  }
};

var createdGroup;

var TEST_GROUP_NAME = 'test group name for config tests';
var TEST_GROUP_APP1 = '12345';
var TEST_GROUP_USER1 = 'testuser67890';
var TEST_GROUP_USER_NOACCESS = 'testuser9999';

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);

    forms.createGroup(options, {name: TEST_GROUP_NAME, apps: [TEST_GROUP_APP1], forms: [], users: [TEST_GROUP_USER1], themes: []}, function(err, group){
      assert.ok(!err, 'Error in setUp.createGroup(): ' + util.inspect(err));
      assert.equal(group.name, TEST_GROUP_NAME);
      assert.ok(group._id);
      createdGroup = group;
      finish();
    });
  });
};

module.exports.tearDown = function(finish){
  forms.deleteGroup(options, {_id: createdGroup._id}, function(err){
    assert.ok(!err, 'Error in tearDon.deleteGroup(): ' + util.inspect(err));
    createdGroup = null;
    connection.close(function(err) {
      assert.ok(!err);
      forms.tearDownConnection(options, function (err) {
        assert.ok(!err);
        finish();
      });
    });
  });
};

module.exports.it_should_CRUD_appconfig = function(finish) {

  async.series([
    function getAppconfig2(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have found default appConfig: ' + util.inspect(err));
        assert.equal(75, result.client.quality);
        return cb();
      });
    },

    function getAppconfigNoGroupAccess(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail, restrictToUser: TEST_GROUP_USER_NOACCESS};
      var params = {appId: TEST_GROUP_APP1};
      forms.getAppConfig(opts, params, function(err) {
        assert.ok(err, 'should have been denied access to app: ' + util.inspect(err));
        return cb();
      });
    },

    function getAppconfigWithGroupAccess(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail, restrictToUser: TEST_GROUP_USER1};
      var params = {appId: TEST_GROUP_APP1};
      forms.getAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have found default appConfig: ' + util.inspect(err));
        assert.equal(75, result.client.quality);
        return cb();
      });
    },


    function craeteAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '123456';
      forms.createAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have craeted appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function getAppconfig2(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '123456'};
      forms.getAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function getAppClientConfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      opts.appId = '12345';
      opts.deviceId = 'abcdef';
      forms.getAppClientConfig(opts, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(false, result.config_admin_user);
        return cb();
      });
    },

    function getAppClientConfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      opts.appId = '12345';
      opts.deviceId = 'fedcba';
      forms.getAppClientConfig(opts, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(false, result.config_admin_user);
        return cb();
      });
    },

    function updateAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '12345';
      params.client.quality = 80;
      params.client.config_admin_user = ['abcdef', '12345'];
      forms.updateAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have updated appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function getAppClientConfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      opts.appId = '12345';
      opts.deviceId = 'abcdef';
      forms.getAppClientConfig(opts, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(true, result.config_admin_user);
        return cb();
      });
    },

    function getAppClientConfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      opts.appId = '12345';
      opts.deviceId = 'fedcba';
      forms.getAppClientConfig(opts, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(false, result.config_admin_user);
        return cb();
      });
    },

    function getAppconfig3(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have found appConfig: ' + util.inspect(err));
        assert.equal(80, result.client.quality);
        return cb();
      });
    },

    function deleteAppconfig(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
      params.appId = '12345';
      forms.deleteAppConfig(opts, params, function(err) {
        assert.ok(!err, 'should have deleted appConfig: ' + util.inspect(err));
        return cb();
      });
    },

    function getAppconfig4(cb) {
      var opts = {uri: options.uri, userEmail: options.userEmail};
      var params = {appId: '12345'};
      forms.getAppConfig(opts, params, function(err, result) {
        assert.ok(!err, 'should have found default appConfig: ' + util.inspect(err));
        assert.equal(75, result.client.quality);
        return cb();
      });
    }

  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.test_import_app_config = function(finish){

  var testConfig = _.clone(TEST_APP_CONFIG);

  var importAppConfig = {
    _id: new mongoose.Types.ObjectId(),
    appId: 'testappid',
    client: testConfig.client,
    cloud: testConfig.cloud
  };

  forms.importAppConfig(options, [importAppConfig], function(err, updatedAppConfig){
    assert.ok(!err, "Expected No Error");

    assert.equal(importAppConfig.appId, updatedAppConfig[0].appId);

    importAppConfig.client.sent_save_min = 12;

    //Should be able to do it again
    forms.importAppConfig(options, [importAppConfig], function(err, updatedAppConfig){
      assert.ok(!err, "Expected No Error");

      assert.equal(importAppConfig.appId, updatedAppConfig[0].appId);
      assert.equal(12, updatedAppConfig[0].client.sent_save_min);
      finish();
    });
  });
};
