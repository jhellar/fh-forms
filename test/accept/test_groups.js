require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var fs = require('fs');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var groups = require('../../lib/impl/groups.js');

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;
var formModel;
var themeModel;

var form1id;
var form2id;
var themeid;

var TEST_GROUP_NAME = 'test group name';
var TEST_GROUP_NAME_UPDATE = 'test group name UPDATED';
var TEST_GROUP_APP1 = 'testapp12345';
var TEST_GROUP_USER1 = 'testuser67890';
var TEST_GROUP_VALIDATION_NAME = 'test group validation name';
var TEST_GROUP_GETALL_NAME = 'test group getall name';
var TEST_GROUP_INVALID_USER = "notexist@example.com";

var TEST_FORM_1 = {
    "name": "Very Simple Form1 for testing groups",
    "description": "This is form1.",
    "lastUpdated": "2013-11-18 06:13:52",
    "updatedBy": "test@example.com",
    "pages": [],
    "fieldRules": [],
    "pageRules": [],
    "theme": {}
};
var TEST_FORM_2 = {
    "name": "Very Simple Form2 for testing groups",
    "description": "This is form2.",
    "lastUpdated": "2013-11-18 06:13:52",
    "updatedBy": "test@example.com",
    "pages": [],
    "fieldRules": [],
    "pageRules": [],
    "theme": {}
};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    themeModel = models.get(connection, models.MODELNAMES.THEME);

    async.series([
      function(cb) {
        var newForm = new formModel(TEST_FORM_1);
        newForm.save(function(err, form) {
          assert.ok(!err, util.inspect(err));
          form1id = form._id.toString();
          return cb();
        });
      },
      function(cb) {
        var newForm = new formModel(TEST_FORM_2);
        newForm.save(function(err, form) {
          assert.ok(!err, util.inspect(err));
          form2id = form._id.toString();
          return cb();
        });
      },
      function(cb) {
        var testThemeData = JSON.parse(fs.readFileSync('./test/Fixtures/theme.json'));
        var newTheme = new themeModel(testThemeData);

        newTheme.save(function(err, theme){
          assert.ok(!err, util.inspect(err));
          themeid = theme._id.toString();
          return cb();
        });
      },
    ], function(err) {
      assert.ok(!err, util.inspect(err));
      finish();
    });
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

module.exports.it_should_crud_groups = function(finish) {

  async.waterfall([
    function(cb) {
      forms.getAllGroups(options, function(err, groups){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        assert.equal(groups.length, 0, 'expected no groups');
        return cb();
      });
    },
    function testCreateGroup(cb) {
      forms.createGroup(options, {name: TEST_GROUP_NAME, apps: [TEST_GROUP_APP1], forms: [form1id, form2id], users: [TEST_GROUP_USER1], themes: [themeid]}, function(err, group){
        assert.ok(!err, 'Error in createGroup: ' + util.inspect(err));
        assert.equal(group.name, TEST_GROUP_NAME);
        assert.ok(group._id);
        return cb(err, group);
      });
    },
    function testGetAllGroups(createdGroup, cb) {
      forms.getAllGroups(options, function(err, groups) {
        assert.ok(!err, 'Error in getAllGroups: ' + util.inspect(err));
        assert.equal(groups.length, 1, 'should now be 1 group in list');
        assert.equal(groups[0]._id.toString(), createdGroup._id.toString(), 'should have found created group in list: ' + util.inspect(groups));
        assert.equal(groups[0].name, TEST_GROUP_NAME, 'should have found created group name in list: ' + util.inspect(groups));
        assert.ok(groups[0].forms);
        assert.ok(groups[0].users);
        assert.ok(groups[0].apps);
        assert.ok(groups[0].themes);
        return cb(err, createdGroup);
      });
    },
    function testGetGroup(createdGroup, cb){
      forms.getGroup(options, {_id: createdGroup._id}, function(err, group) {
        assert.ok(!err, 'Error in getGroup: ' + util.inspect(err));
        assert.ok(group);
        assert.equal(group._id.toString(), createdGroup._id.toString(), 'should have retrieved created group');
        assert.equal(group.name, TEST_GROUP_NAME, 'should have found created group name in retrieved group');
        return cb(err, createdGroup);
      });
    },
    function testUpdateGroup(createdGroup, cb){
      var params = {
        _id: createdGroup._id,
        name: TEST_GROUP_NAME_UPDATE,
        apps: createdGroup.apps,
        forms: createdGroup.forms,
        users: createdGroup.users,
        themes: createdGroup.themes
      };
      forms.updateGroup(options, params, function(err, group) {
        assert.ok(!err, 'Error in updateGroup: ' + util.inspect(err));
        assert.ok(group);
        assert.equal(group._id.toString(), createdGroup._id.toString(), 'should have retrieved created group');
        assert.equal(group.name, TEST_GROUP_NAME_UPDATE, 'should have found updated group name in retrieved group');
        return cb(null, createdGroup);
      });
    },
    function testDeleteGroup(createdGroup, cb) {
      forms.deleteGroup(options, {_id: createdGroup._id}, function(err){
        assert.ok(!err, 'Error in updateAppForms: ' + util.inspect(err));
        return cb(null, createdGroup);
      });
    },
    function testGetGroupNotExists(createdGroup, cb){
      forms.getGroup(options, {_id: createdGroup._id}, function(err, group) {
        assert.ok(!err, 'Error in getGroup: ' + util.inspect(err));
        assert.ok(!group);
        return cb(err, createdGroup);
      });
    },
    function testGetAllGroupsNotExists(createdGroup, cb) {
      forms.getAllGroups(options, function(err, groups){
        assert.ok(!err, 'Error in updateForm: ' + util.inspect(err));
        assert.equal(groups.length, 0, 'expected no groups');
        return cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.it_should_validate_groups = function(finish) {
  var connections = {mongooseConnection: connection};

  async.waterfall([
    function testCreateGroup(cb) {
      forms.createGroup(options, {name: TEST_GROUP_VALIDATION_NAME, apps: [TEST_GROUP_APP1], forms: [form1id, form2id], users: [TEST_GROUP_USER1], themes: [themeid]}, function(err, group){
        assert.ok(!err, 'Error in createGroup: ' + util.inspect(err));
        assert.ok(group._id);
        return cb(err);
      });
    },
    function (cb) {
      groups.validateAppAllowedForUser(connections, undefined, TEST_GROUP_APP1, function (err) {
        assert.ok(!err, 'Should validate with no user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateAppAllowedForUser(connections, TEST_GROUP_USER1, TEST_GROUP_APP1, function (err) {
        assert.ok(!err, 'Should validate with test user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateAppAllowedForUser(connections, TEST_GROUP_INVALID_USER, TEST_GROUP_APP1, function (err) {
        assert.ok(err, 'Should invalidate with invalid user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateFormAllowedForUser(connections, undefined, form1id, function (err) {
        assert.ok(!err, 'Should validate with no user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateFormAllowedForUser(connections, TEST_GROUP_USER1, form1id, function (err) {
        assert.ok(!err, 'Should validate with test user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateFormAllowedForUser(connections, TEST_GROUP_INVALID_USER, form1id, function (err) {
        assert.ok(err, 'Should invalidate with invalid user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateThemeAllowedForUser(connections, undefined, themeid, function (err) {
        assert.ok(!err, 'Should validate with no user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateThemeAllowedForUser(connections, TEST_GROUP_USER1, themeid, function (err) {
        assert.ok(!err, 'Should validate with test user specified: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.validateThemeAllowedForUser(connections, TEST_GROUP_INVALID_USER, themeid, function (err) {
        assert.ok(err, 'Should invalidate with invalid user specified: ' + util.inspect(err));
        return cb();
      });
    },
    // function (cb) {

    // },
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

// function getFormsForUser(connections, userToRestrictTo, cb) {
//   return getDataForUser(connections, GROUP_MODEL_FORMS_FIELD, userToRestrictTo, cb);
// }

// function getAppsForUser(connections, userToRestrictTo, cb) {
//   return getDataForUser(connections, GROUP_MODEL_APPS_FIELD, userToRestrictTo, cb);
// }

// function getThemesForUser(connections, userToRestrictTo, cb) {
//   return getDataForUser(connections, GROUP_MODEL_THEMES_FIELD, userToRestrictTo, cb);
// }

module.exports.it_should_get_groups = function(finish) {
  var connections = {mongooseConnection: connection};

  async.waterfall([
    function testCreateGroup(cb) {
      forms.createGroup(options, {name: TEST_GROUP_GETALL_NAME, apps: [TEST_GROUP_APP1], forms: [form1id, form2id], users: [TEST_GROUP_USER1], themes: [themeid]}, function(err, group){
        assert.ok(!err, 'Error in createGroup: ' + util.inspect(err));
        assert.ok(group._id);
        return cb(err);
      });
    },
    function (cb) {
      groups.getAppsForUser(connections, undefined, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.ok(!list, 'Should not be restricted list: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.getAppsForUser(connections, TEST_GROUP_INVALID_USER, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 0, 'Should be empty list for invalid user: ' + util.inspect(list));
        return cb();
      });
    },
    function (cb) {
      groups.getAppsForUser(connections, TEST_GROUP_USER1, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 1, 'Should not be empty list for valid user: ' + util.inspect(list));
        assert.equal(list[0], TEST_GROUP_APP1, 'App should be listed in allowed: ' + util.inspect(list));
        return cb();
      });
    },

    function (cb) {
      groups.getFormsForUser(connections, undefined, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.ok(!list, 'Should not be restricted list: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.getFormsForUser(connections, TEST_GROUP_INVALID_USER, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 0, 'Should be empty list for invalid user: ' + util.inspect(list));
        return cb();
      });
    },
    function (cb) {
      groups.getFormsForUser(connections, TEST_GROUP_USER1, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 2, 'Should not be empty list for valid user: ' + util.inspect(list));
        assert.ok(list.indexOf(form1id) >= 0, 'Form 1 (' + form1id + ') should be listed: ' + util.inspect(list));
        assert.ok(list.indexOf(form2id) >= 0, 'Form 2 (' + form2id + ') should be listed: ' + util.inspect(list));
        return cb();
      });
    },

    function (cb) {
      groups.getThemesForUser(connections, undefined, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.ok(!list, 'Should not be restricted list: ' + util.inspect(err));
        return cb();
      });
    },
    function (cb) {
      groups.getThemesForUser(connections, TEST_GROUP_INVALID_USER, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 0, 'Should be empty list for invalid user: ' + util.inspect(list));
        return cb();
      });
    },
    function (cb) {
      groups.getThemesForUser(connections, TEST_GROUP_USER1, function (err, list) {
        assert.ok(!err, 'Should not have error: ' + util.inspect(err));
        assert.equal(list.length, 1, 'Should not be empty list for valid user: ' + util.inspect(list));
        assert.equal(list[0], themeid, 'Theme should be listed in allowed: ' + util.inspect(list));
        return cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};
