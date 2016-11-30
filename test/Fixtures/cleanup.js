require('./env.js');
var initDatabase = require('./../setup.js').initDatabase;
var async = require('async');
var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();

function cleanUp(cb) {

  initDatabase(assert, function (err) {
    assert.ok(!err);
    connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    pageRuleModel = models.get(connection, models.MODELNAMES.PAGE_RULE);
    fieldRuleModel = models.get(connection, models.MODELNAMES.FIELD_RULE);
    dataSourceModel = models.get(connection, models.MODELNAMES.DATA_SOURCE);
    dataTargetModel = models.get(connection, models.MODELNAMES.DATA_TARGET);

    async.parallel([
      function(cb){
        formModel.remove({}, cb);
      },
      function(cb){
        fieldRuleModel.remove({}, cb);
      },
      function(cb){
        pageRuleModel.remove({}, cb);
      },
      function(cb){
        dataTargetModel.remove({}, cb);
      },
      function(cb){
        dataSourceModel.remove({}, cb);
      },
      function(cb){
        fieldModel.remove({}, cb);
      }
    ], function(err){
      assert.ok(!err, "Expected No Error " + err);
      connection.close(cb);
    });
  });
}

module.exports = cleanUp;