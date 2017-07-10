require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var lodash = require('lodash');
var assert = require('assert');
var fs = require('fs');
var util = require('util');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "1234567892";

var testThemeData = require('../Fixtures/theme.json');
var testThemeId;

module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err, util.inspect(err));

    createTestData(assert, function(err, themeId) {
      assert.ok(!err, util.inspect(err));
      assert.ok(themeId);
      testThemeId = themeId;
      finish();
    });
  });
};

module.exports.test.after = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err, util.inspect(err));
    finish();
  });
};


// setup 3 groups
// group 1 give user1 access to theme and app
// group 2 give user 2 access to theme but not app
// group 3 give user 3 access to app but not theme
function setupTestGroups(userid, themeid, appid, cb) {
  var group1Setup = {
    name: 'testGroup1',
    users: [userid],
    forms: [],
    apps: [appId],
    themes: [themeid]
  };
  var group2Setup = {
    name: 'testGroup2',
    users: [userid],
    forms: [],
    apps: [],
    themes: [themeid]
  };
  var group3Setup = {
    name: 'testGroup3',
    users: [userid],
    forms: [],
    apps: [appId],
    themes: []
  };
  forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group1Setup, function (err) {
    if(err) return cb(err);
    forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group2Setup, function (err) {
      if(err) return cb(err);
      forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group3Setup, function (err) {
        if(err) return cb(err);
        return cb();
      });
    });
  });    
}

module.exports.test.testGetThemeWorksGroupRestrictions = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);
    var allowedUser1 = 'users1@example.com';
    async.series([
      function(cb) {
        return setupTestGroups(allowedUser1, testThemeId, appId, cb);
      },
      function(cb) {
        forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId, restrictToUser: "notexist@example.com"}, function(err, result){
          assert.ok(err, 'should have returned error, doesn\'t have access to app');
          assert.ok(err.message.toLowerCase().indexOf('not allowed') >= 0, 'error should complain about access to app');
          return cb();
        });
      },
      function(cb) {
        forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId, restrictToUser: allowedUser1}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result);   // theme should be returned
          return cb();
        });
      },
      function(cb) { // getTheme with an appid also used to return a theme for an app
        forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId, restrictToUser: "notexist@example.com"}, function(err, result){
          assert.ok(err, 'should have returned error, doesn\'t have access to app');
          assert.ok(err.message.toLowerCase().indexOf('not allowed') >= 0, 'error should complain about access to app');
          return cb();
        });
      },
      function(cb) { // getTheme with an appid also used to return a theme for an app
        forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId, restrictToUser: allowedUser1}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result);   // theme should be returned
          return cb();
        });
      },
      function(cb) { // getTheme with an appid also used to return a theme for an app
        forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": testThemeId, restrictToUser: "notexist@example.com"}, function(err, result){
          assert.ok(err, 'should have returned error, doesn\'t have access to app');
          assert.ok(err.message.toLowerCase().indexOf('not allowed') >= 0, 'error should complain about access to app');
          return cb();
        });
      },
      function(cb) { // getTheme with an appid also used to return a theme for an app
        forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": testThemeId, restrictToUser: allowedUser1}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result);   // theme should be returned
          return cb();
        });
      },
      function(cb) { // getThemes
        forms.getThemes({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result,'should have results from getTheme');   // theme should be returned);   // theme should be returned
          assert.ok(result.length > 0, 'should have themes in results from getTheme: ' + util.inspect(result));   // theme should be returned);   // theme should be returned
          return cb();
        });
      },
      function(cb) { // getThemes 
        forms.getThemes({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: "notexist@example.com"}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result, 'should have results from getTheme');   // theme should be returned);   // theme should be returned
          assert.ok(result.length === 0, 'should have 0 themes in results from getTheme: ' + util.inspect(result));   // theme should be returned);   // theme should be returned
          return cb();
        });
      },
      function(cb) { // getThemes 
        forms.getThemes({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: allowedUser1}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.ok(result,'should have results from getTheme');   // theme should be returned);   // theme should be returned
          assert.ok(result.length > 0, 'should have themes in results from getTheme: ' + util.inspect(result));   // theme should be returned);   // theme should be returned
          return cb();
        });
      }
    ], function (err) {
      assert.ok(!err, util.inspect(err));
      finish();
    });
  });
};


module.exports.test.testGetThemeWorks = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    finish();
  });
};

module.exports.test.testGetThemeById = function(finish){
  assert.ok(testThemeId, "test no setup correctly - should have testThemeId: " + JSON.stringify(testThemeId));
  forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": testThemeId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    finish();
  });
};

module.exports.test.testGetThemeByIdNotExists = function(finish){
  forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": '000000'}, function(err, result){
    assert.ok(err, 'Should have returned error');
    finish();
  });
};

module.exports.test.testGetThemeNoUri = function(finish){
  forms.getTheme({}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
};

module.exports.test.testGetThemeNoAppId = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
};

module.exports.test.testGetThemeNoAppExists = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": "theWrongId"}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(!result);
    finish();
  });
};

function checkTheme(assert, expectedThemeData, actualThemeData){
  assert.ok(actualThemeData);
  assert.ok(actualThemeData._id);//Check id exists
  assert.ok(actualThemeData.lastUpdated);//Check lastUpdated exists
  assert.ok(actualThemeData.css);
  assert.ok(actualThemeData.css.indexOf("Error Generating Appforms CSS") == -1);

  var expectedSections = expectedThemeData.sections;
  var actualSections = actualThemeData.sections;
  assert.ok(expectedSections, "Expected Sections Not Present: "+ JSON.stringify(expectedThemeData));
  assert.ok(actualSections, "Actual Sections Not Present: "+ JSON.stringify(actualThemeData));

  expectedSections.forEach(function(expectedSection, index){
    var actualSection = actualSections[index];

    assert.ok(lodash.isEqual(expectedSection.id, actualSection.id), "Expected section id " + expectedSection.id + " ACTUAL: " + actualSection.id);
    assert.ok(lodash.isEqual(expectedSection.label,actualSection.label), "Expected section id " + expectedSection.id + " ACTUAL: " + actualSection.id);

    var expectedSubSections = expectedSection.sub_sections;
    var actualSubSections = actualSection.sub_sections;

    expectedSubSections.forEach(function(expectedSubSection, index){
      var actualSubSection = actualSubSections[index];

      assert.ok(lodash.isEqual(expectedSubSection, actualSubSection), "Expected sub section: " + JSON.stringify(expectedSubSection) + " ACTUAL: " + JSON.stringify(actualSubSection) );
    });
  });
}

function createTestData(assert, cb){
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  //Creating a theme
  var Theme = models.get(connection, models.MODELNAMES.THEME);

  var testTheme = new Theme(testThemeData);

  testTheme.save(function(err, theme){
    if(err) console.log(err);
    assert.ok(!err, util.inspect(err));

    var AppTheme = models.get(connection, models.MODELNAMES.APP_THEMES);

    var testAppTheme = new AppTheme({"appId": appId});
    testAppTheme.theme = testTheme;

    testAppTheme.save(function(err){
      assert.ok(!err, util.inspect(err));

      connection.close(function(err){
        if(err) console.log(err);
        cb(err, theme._id);
      });
    });
  });
}
