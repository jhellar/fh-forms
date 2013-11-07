require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      test.finish();
    });
  });
}

module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

function createTestData(assert, cb){
  cb(null);
}