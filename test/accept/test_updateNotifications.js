require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;

var assert = require('assert');
var OPTIONS = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com" };

var connection;
var formModel;
var fieldModel;
var pageModel;


module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(OPTIONS.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    finish();
  });
};

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(OPTIONS, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.it_should_set_form_notifications = function(finish) {

  var simpleForm = {
    "name": "Notifications Test Form",
    "description": "This is a simple test form.",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
  };
  simpleForm.name += "Original " + Date.now();

  forms.updateForm(OPTIONS, simpleForm, function(err, doc){
    assert.ok(!err, 'error fom updateForm: ' + util.inspect(err));
    var subscribers = ["cian@cianclarke.com", "test@example.com"];
    OPTIONS._id = doc._id;

    forms.updateNotifications(OPTIONS, subscribers, function(err){
      assert.ok(!err, 'Error in updateNotifications: ' + util.inspect(err));

      forms.getNotifications(OPTIONS, function(err, res) {
        assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
        assert.ok(res, 'Expected a subscribers object to be defined');
        assert.equal(res.subscribers.length, subscribers.length, 'Expected subscribers to have length');
        return finish();
      });
    });
  });
};

