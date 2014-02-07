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
  assert.ok(actualThemeData.lastUpdated);//Check id exists
  assert.ok(actualThemeData.css);
  assert.ok(actualThemeData.css != "ERROR_GENERATING_CSS");

  //delete actualThemeData._id;//Should be equal bar the id
  for(var key in expectedThemeData){
    assert.ok(lodash.isEqual(expectedThemeData[key], actualThemeData[key]), 'expected: ' + util.inspect(expectedThemeData[key]) + ', actual: ' + util.inspect(actualThemeData[key]));
  }
}