require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var lodash = require('lodash');
var assert = require('assert');
var fs = require('fs');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "1234567892";

var testThemeData = require('../Fixtures/theme.json');
var testThemeId;

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err, themeId) {
      assert.ok(!err);
      assert.ok(themeId);
      testThemeId = themeId;
      finish();
    });
  });
}

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testGetThemeWorks = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);
    assert.ok(result);

    checkTheme(assert, result);

    finish();
  });
}

module.exports.testGetThemeById = function(finish){
  assert.ok(testThemeId, "test no setup correctly - should have testThemeId: " + JSON.stringify(testThemeId));
  forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": testThemeId}, function(err, result){
    assert.ok(!err);
    assert.ok(result);

    checkTheme(assert, result);

    finish();
  });
}

module.exports.testGetThemeByIdNotExists = function(finish){
  forms.getTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id": '000000'}, function(err, result){
    assert.ok(err, 'Should have returned error');
    finish();
  });
}

module.exports.testGetThemeNoUri = function(finish){
  forms.getTheme({}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetThemeNoAppId = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetThemeNoAppExists = function(finish){
  forms.getAppTheme({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": "theWrongId"}, function(err, result){
    assert.ok(!err);
    assert.ok(!result);
    finish();
  });
}

function checkTheme(assert, theme){
  assert.ok(theme);
  assert.ok(theme._id);//Check id exists
  assert.ok(theme.lastUpdated);//Check id exists

  delete theme._id;//Should be equal bar the id
  for(var key in testThemeData){
    assert.ok(lodash.isEqual(testThemeData[key], theme[key]));
  }
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
    assert.ok(!err);

    var AppTheme = models.get(connection, models.MODELNAMES.APP_THEMES);

    var testAppTheme = new AppTheme({"appId": appId});
    testAppTheme.theme = testTheme;

    testAppTheme.save(function(err){
      assert.ok(!err);

      connection.close(function(err){
        if(err) console.log(err);
        cb(err, theme._id);
      });
    });
  });
};
