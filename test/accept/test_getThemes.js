require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var lodash = require('lodash');
var assert = require('assert');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "123456789";

var testThemeId;


module.exports.setUp = function(finish){
  createTestData(assert, function(err, themeId){
    assert.ok(!err);
    testThemeId = themeId;
    finish();
  });
}

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
}

module.exports.testGetThemesWorks = function(finish){

  forms.getThemes({"uri" : process.env.FH_DOMAIN_DB_CONN_URL}, function(err, themes){
    if(err) console.log(err);
    assert.ok(!err);
    assert.ok(themes);
    assert.ok(Array.isArray(themes));

    assert.ok(themes.length === 1);

    var themeRes = themes[0];

    assert.ok(themeRes.appsUsingTheme === 1);
    assert.ok(themeRes.apps);
    assert.ok(Array.isArray(themeRes.apps));

    assert.ok(themeRes.apps.length === 1);

    var appThemeRes = themeRes.apps[0];

    assert.ok(appThemeRes.appId === appId);
    assert.ok(appThemeRes.theme.toString() === testThemeId.toString());
    finish();
  });
}


function createTestData(assert, cb){
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  //Creating a theme
  var Theme = models.get(connection, models.MODELNAMES.THEME);

  Theme.find(function(err, themesFound){
    assert.ok(!err);

    async.eachSeries(themesFound, function(theme,cb){
      theme.remove(cb);
    }, function(err){
      assert.ok(!err);

      testThemeData = require("../Fixtures/theme.json");

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
    });
  });
};
