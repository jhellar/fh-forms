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

var TEST_FORM = {
    "name": "Very Simple Form for testing form delete",
    "description": "This is form1.",
    "lastUpdated": "2013-11-18 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};

module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
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

function assertFormNamedNotFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.equal(data, null, msg + util.inspect(data));
    cb();
  });
}

module.exports.test.it_should_delete_form = function(finish) {

  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM, function(err, form){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        cb(null, form);
      });
    },
    function getForm(form, cb) {
      // sanity check that getForm returns our form
      assert.ok(form, 'form should have data');
      forms.getForm({_id: form._id, uri: options.uri, userEmail: options.userEmail}, function(err, form) {
        assert.ok(!err, 'Error in getForm: ' + util.inspect(err));
        assert.ok(form, 'Expected form to exist!');
        return cb(null, form);
      });
    },
    function deleteForm(form, cb) {
      assert.ok(form, 'form should have data');
      forms.deleteForm({_id: form._id, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(!err, 'Error in deleteForm: ' + util.inspect(err));
        return cb(err, form._id);
      });
    },
    function getForm(formId, cb) {
      assert.ok(formId, 'formId should not be null');
      forms.getForm({_id: formId, uri: options.uri, userEmail: options.userEmail}, function(err, form) {
        assert.ok(!err, 'Expected error', err);
        assert.ok(!form, 'Form should not exist');
        return cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};
