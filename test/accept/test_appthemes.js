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
var formModel;
var fieldModel;
var pageModel;


module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    pageModel = models.get(connection, models.MODELNAMES.PAGE);
    finish();
  });
};

module.exports.test.after = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.test.it_should_set_app_theme = function(finish) {

  async.waterfall([
    function(cb) {
      var Theme = models.get(connection, models.MODELNAMES.THEME);

      var testThemeData = JSON.parse(fs.readFileSync('./test/Fixtures/theme.json'));
      var testTheme = new Theme(testThemeData);

      testTheme.save(function(err, theme){
        if(err){
          console.log(err);
        }
        assert.ok(!err);
        cb(null, theme);
      });
    },
    function setAppTheme(theme, cb) {
      var opts = {appId: '12345', theme: theme._id, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(!err, 'Error in setAppTheme: ' + util.inspect(err));

        forms.getAppTheme({appId: '12345', uri: options.uri, userEmail: options.userEmail}, function(err, t) {
          assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
          assert.ok(t, 'Expected theme to be defined');
          return cb();
        });
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};


// setup 2 groups
// group 1 give user1 access to app
// group 2 give user2 access to theme
// group 3 give user3 access to app and theme
function setupTestGroups(userAppAccess, userThemeAccess, userAppAndThemeAccess, appid, themeid, cb) {
  var group1Setup = {
    name: 'testGroup',
    users: [userAppAccess],
    forms: [],
    apps: [appid],
    themes: []
  };
  var group2Setup = {
    name: 'testGroup2',
    users: [userThemeAccess],
    forms: [],
    apps: [],
    themes: [themeid]
  };
  var group3Setup = {
    name: 'testGroup3',
    users: [userAppAndThemeAccess],
    forms: [],
    apps: [appid],
    themes: [themeid]
  };

  async.each([
    group1Setup,
    group2Setup,
    group3Setup
  ], function (groupSetup, cb) {
    return forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, groupSetup, cb);
  }, function (err) {
    if(err) return cb(err);
    return cb();
  });
}

function setupTestData(cb) {
  var themeid;
  var appid = "987654321";
  var userAppAccess = 'user1@example.com';
  var userThemeAccess = 'user2@example.com';
  var userAppAndThemeAccess = 'user3@example.com';
  var userNoAccess = 'user4@example.com';

  async.series([
    function(cb) {
      var Theme = models.get(connection, models.MODELNAMES.THEME);

      var testThemeData = JSON.parse(fs.readFileSync('./test/Fixtures/theme.json'));
      var testTheme = new Theme(testThemeData);

      testTheme.save(function(err, theme){
        assert.ok(!err);
        themeid = theme._id.toString();
        cb(null, theme);
      });
    }
  ], function (err) {
    assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
    setupTestGroups(userAppAccess, userThemeAccess, userAppAndThemeAccess, appid, themeid, function (err) {
      assert.ok(!err, 'Error in setupTestGroups: ' + util.inspect(err));

      return cb(undefined, userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid);
    });
  });
}

module.exports.test.it_should_check_groups_when_setting_app_theme = function(finish) {
  async.waterfall([
    setupTestData,
    function (userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid, cb) {
      var opts = {appId: appid, restrictToUser: userAppAccess, theme: themeid, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(err, 'Should be error - user only has app access, err: ' + util.inspect(err));
        return cb(undefined, userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid);
      });
    },
    function (userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid, cb) {
      var opts = {appId: appid, restrictToUser: userThemeAccess, theme: themeid, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(err, 'Should be error - user only has theme access, err: ' + util.inspect(err));
        return cb(undefined, userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid);
      });
    },
    function (userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid, cb) {
      var opts = {appId: appid, restrictToUser: userNoAccess, theme: themeid, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(err, 'Should be error - user does not have access to app or theme, err: ' + util.inspect(err));
        return cb(undefined, userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid);
      });
    },
    function (userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid, cb) {
      var opts = {appId: appid, restrictToUser: userAppAndThemeAccess, theme: themeid, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(!err, 'Should NOT be error - user has access to app and theme, err: ' + util.inspect(err));
        return cb(undefined, userAppAccess, userThemeAccess, userAppAndThemeAccess, userNoAccess, appid, themeid);
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};



