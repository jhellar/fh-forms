require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var _ = require('underscore');
var themeData = require('../Fixtures/theme.json');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    finish();
  });
};

module.exports.test.after = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.test.testCloneTheme = function(finish){
  var testTheme = _.clone(themeData);

  var testOptions = _.clone(options);

  forms.updateTheme(testOptions, testTheme, function(err, updatedTheme){
    assert.ok(!err, "Unexpected Error When Updating Theme " + err);

    testOptions._id = updatedTheme._id;
    testOptions.name = "Some Cloned Theme";

    forms.cloneTheme(testOptions, function(err, clonedTheme){
      assert.ok(!err, "Unexpected Error When Cloning Theme " + err);

      assert.ok(clonedTheme, "Expected A Cloned Theme");


      assert.equal(clonedTheme.name, "Some Cloned Theme");
      assert.ok(clonedTheme._id != updatedTheme._id, "Expected Theme IDs To Be Different");
      finish();
    });
  });
};


