require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var CONSTANTS = require('../../lib/common/constants');
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var util = require('util');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};


module.exports = {
  setUp: function(done) {
    initDatabase(assert, function(err) {
      assert.ok(!err, util.inspect(err));

      done();
    });
  },
  tearDown: function(done) {
    forms.tearDownConnection(options, function(err) {
      assert.ok(!err, util.inspect(err));
      done();
    });
  },
  "Test async submissions export": function(done) {

    async.series([
      function startCSVExport(cb) {
        forms.startCSVExport(options, function(err, exportStatus){
          assert.equal(undefined, err);

          assert.equal(CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_INPROGRESS, exportStatus.status);
          assert.equal("Preparing submission CSV export", exportStatus.message);
          assert.equal(undefined, exportStatus.error);

          cb();
        });
      },
      function cantStartCSVExportAgain(cb) {
        forms.startCSVExport(options, function(err, exportStatus) {
          assert.equal(undefined, exportStatus);

          assert.equal("Submission CSV Export already in progress", err);

          cb();
        });
      },
      function resetExportCSV(cb) {
        forms.resetExportCSV(options, function(err, exportStatus) {
          assert.equal(undefined, err);

          assert.equal(CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_RESET, exportStatus.status);
          assert.equal("Submission CSV export reset. Please try again", exportStatus.message);
          assert.equal(undefined, exportStatus.error);

          cb();
        });
      },
      function shoulBeAbleToStartAgain(cb) {
        forms.startCSVExport(options, function(err, exportStatus){
          assert.equal(undefined, err);

          assert.equal(CONSTANTS.SUBMISSION_CSV_EXPORT.STATUS_INPROGRESS, exportStatus.status);
          assert.equal("Preparing submission CSV export", exportStatus.message);
          assert.equal(undefined, exportStatus.error);

          cb();
        });
      }
    ], done);
  }
};