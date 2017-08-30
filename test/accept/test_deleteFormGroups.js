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

var TEST_FORM1 = {
    "name": "Very Simple Form 1 for testing form delete with groups",
    "description": "This is form1.",
    "lastUpdated": "2013-11-18 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};

var TEST_FORM2 = {
    "name": "Very Simple Form 2 for testing form delete with groups",
    "description": "This is form2.",
    "lastUpdated": "2013-11-18 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};


// setup 2 groups
// group 1 give user1 access to form1
// group 2 give user 2 access to form1 and form 2
function setupTestGroups(allowedUser1, allowedUser2, form1Id, form2Id, cb) {
  var group1Setup = {
    name: 'testGroup',
    users: [allowedUser1],
    forms: [form1Id],
    apps: [],
    themes: []
  };
  var group2Setup = {
    name: 'testGroup2',
    users: [allowedUser2],
    forms: [form1Id, form2Id],
    apps: [],
    themes: []
  };
  forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group1Setup, function (err) {
    if(err) return cb(err);
    forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group2Setup, function (err) {
      if(err) return cb(err);
      return cb();
    });
  });    
}

module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    //Removing any forms
    formModel.remove({}, function(err){
      finish();
    });
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

function createForms(cb) {
  var form1id,
      form2id;
  var form1acces = 'user1@example.com';
  var form1and2access = 'user2@example.com';
  var noaccess = 'user3@example.com';

  async.series([
    function(cb){
      //Removing any forms
      formModel.remove({}, cb);
    },
    function(cb) {
      forms.updateForm(options, TEST_FORM1, function(err, form){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        form1id = form._id;
        cb(null, form);
      });
    }, function(cb) {
      forms.updateForm(options, TEST_FORM2, function(err, form){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        form2id = form._id;
        cb(null, form);
      });
    },
  ], function (err) {
    assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
    setupTestGroups(form1acces, form1and2access, form1id, form2id, function (err) {
      assert.ok(!err, 'Error in setupTestGroups: ' + util.inspect(err));

      return cb(undefined, form1id, form2id, form1acces, form1and2access, noaccess);
    });
  });
}

module.exports.test.it_should_not_delete_form_without_group_access = function(finish) {
  async.waterfall([
    createForms,
    function deleteForm1(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form1id, restrictToUser: noaccess, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(err, 'should have error trying to delete form, with user not listed in groups');
        return cb(undefined, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    },
    function deleteForm2(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form2id, restrictToUser: form1acces, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(err, 'should have error trying to delete form, with disallowed user');
        return cb(undefined, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.test.it_should_delete_form_without_group_restrictions = function(finish) {
  async.waterfall([
    createForms,
    function deleteForm1(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form1id, restrictToUser: undefined, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(!err, 'should not have error trying to delete form, with no restrictions: ' + util.inspect(err));
        return cb(err, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    },
    function deleteForm2(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form2id, restrictToUser: undefined, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(!err, 'should not have error trying to delete form, with no restrictions: ' + util.inspect(err));
        return cb(err, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.test.it_should_delete_form_when_in_allowed_group = function(finish) {
  async.waterfall([
    createForms,
    function deleteForm1(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form1id, restrictToUser: form1acces, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(!err, 'should not have error trying to delete form, with allowed user: ' + util.inspect(err));
        return cb(err, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    },
    function deleteForm2(form1id, form2id, form1acces, form1and2access, noaccess, cb) {
      forms.deleteForm({_id: form2id, restrictToUser: form1and2access, uri: options.uri, userEmail: options.userEmail}, function(err, data){
        assert.ok(!err, 'should not have error trying to delete form, with allowed user: ' + util.inspect(err));
        return cb(err, form1id, form2id, form1acces, form1and2access, noaccess);
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};
