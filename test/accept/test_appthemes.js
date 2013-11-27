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


module.exports.setUp = function(finish){
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

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.it_should_set_app_theme = function(finish) {

  async.waterfall([
    function(cb) {
      var Theme = models.get(connection, models.MODELNAMES.THEME);

      var testThemeData = JSON.parse(fs.readFileSync('./test/Fixtures/theme.json'));
      var testTheme = new Theme(testThemeData);

      testTheme.save(function(err, theme){
        assert.ok(!err);
        cb(null, theme);
      });
    },
    function setAppTheme(theme, cb) {
      var opts = {appId: '12345', theme: theme._id, uri: options.uri, userEmail: options.userEmail}
      forms.setAppTheme(opts, function(err){
        assert.ok(!err, 'Error in setAppTheme: ' + util.inspect(err));

        forms.getTheme({appId: '12345', uri: options.uri, userEmail: options.userEmail}, function(err, t) {
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

