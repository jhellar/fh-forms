require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;
var formModel;
var fieldModel;
var pageModel;

var TEST_FORM_1 = {
    "name": "Very Simple Form1 for testing App Form associations",
    "description": "This is form1.",
    "lastUpdated": "2013-11-18 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};
var TEST_FORM_2 = {
    "name": "Very Simple Form2 for testing App Form associations",
    "description": "This is form2.",
    "lastUpdated": "2013-11-18 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};

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

function assertFormNamedNotFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.equal(data, null, msg + util.inspect(data));
    cb();
  });
}

module.exports.it_should_save_app_forms = function(finish) {

  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_1.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_1, function(err, form1){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        forms.updateForm(options, TEST_FORM_2, function(err, form2){
          assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
          cb(null, form1, form2);
        });
      });
    },
    function addFormsToApp(form1, form2, cb) {
      assert.ok(form1, 'form1 should have data');
      assert.ok(form2, 'form2 should have data');

      forms.updateAppForms(options, {appId: '12345', forms: [form1._id, form2._id]}, function(err, appForms){
        assert.ok(!err, 'Error in addAppForms: ' + util.inspect(err));
        assert.equal(appForms.appId, '12345');
        assert.equal(appForms.forms.length, 2);
        return cb(err, form1, form2, appForms);
      });
    },
    // test getAllAppForms
    function getAllAppForms(form1, form2, appForms, cb) {
      forms.getAllAppForms(options, function(err, appForms) {
        assert.ok(!err, 'Error in getAllAppForms: ' + util.inspect(err));
        assert.equal(appForms[0].forms.length, 2);
        return cb(err, form1, form2, appForms);
      });
    },

    // this is effectively the reverse lookup - what apps are using this form
    function getFormApps(form1, form2, appForms, cb){
      forms.getFormApps({formId: form1._id, uri: options.uri, userEmail: options.userEmail},function(err, apps) {
        assert.ok(!err, 'Error in getFormApps: ' + util.inspect(err));
        assert.equal(apps.length, 1);
        return cb(err, form1, form2, appForms);
      });
    },

    // test getFormApps with bad id
    function getFormApps(form1, form2, appForms, cb){
      forms.getFormApps({formId: 123, uri: options.uri, userEmail: options.userEmail},function(err, apps) {
        assert.ok(err, 'Expected error, not a valid formId!');
        return cb(null, form1, form2, appForms);
      });
    },

    function updateAppForms(form1, form2, appForms, cb) {
      forms.updateAppForms(options, {appId: '12345', forms: []}, function(err, appForms){
        assert.ok(!err, 'Error in updateAppForms: ' + util.inspect(err));
        assert.equal(appForms.forms.length, 0);
        return cb(null, form1);
      });
    },

    function getFormApps2(form1, cb){
      forms.getFormApps({formId: form1._id, uri: options.uri, userEmail: options.userEmail},function(err, apps) {
        assert.ok(!err, 'Error in getFormApps: ' + util.inspect(err));
        assert.equal(apps.length, 0, 'Expected no Forms to be returned, got: ' + util.inspect(apps));
        return cb(err);
      });
    },

    function getAppFormsForApp(cb) {
      forms.getAppFormsForApp(options, '12345', function(err, appForms) {
        assert.ok(!err, 'Error in updateAppForms: ' + util.inspect(err));
        assert.equal(appForms.forms.length, 0);
        return cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

