require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var lodash = require('lodash');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};


var TEST_THEME = require('../Fixtures/theme.json');

var connection;
var themeModel;

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    themeModel = models.get(connection, models.MODELNAMES.THEME);
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

module.exports.it_should_delete_a_theme_when_not_in_use = function(finish){
  forms.updateTheme(options, TEST_THEME, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    checkTheme(assert, TEST_THEME, result);

    var params = options;
    params._id = result._id;

    forms.deleteTheme(params, function(err, result){
      assert.ok(!err);
      assert.ok(result);

      finish();
    });
  });
};

module.exports.it_should_not_delete_a_theme_when_in_use_by_an_app = function(finish){

  async.waterfall([
    function(cb){
      forms.updateTheme(options, TEST_THEME, function(err, result){
        assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
        assert.ok(result);

        checkTheme(assert, TEST_THEME, result);

        cb(undefined, result);
      });
    },
    function (theme, cb) {
      var opts = {appId: '12345', theme: theme._id, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(!err, 'Error in setAppTheme: ' + util.inspect(err));

        forms.getAppTheme({appId: '12345', uri: options.uri, userEmail: options.userEmail}, function(err, t) {
          assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
          assert.ok(t, 'Expected theme to be defined');
          return cb(undefined, theme);
        });
      });
    },
    function (theme, cb) {
      var params = options;
      params._id = theme._id;
      forms.deleteTheme(params, function(err, result){
        assert.ok(err);
        assert.ok(err.message.indexOf("theme in use") > -1);

        cb();
      });
    }], function(err, result){
    assert.ok(!err);
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