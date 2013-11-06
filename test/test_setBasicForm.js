require('./Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../lib/common/models.js')();
var forms = require('../lib/forms.js');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

var emptyForm = require('./Fixtures/emptyform.json');

var connection;

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err) {
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    test.finish();
  });
};

module.exports.setUp = function(test, assert){
  test.finish();
};

module.exports.tearDown = function(test, assert){
  console.log('tearDown');
  test.finish();
};

module.exports.testUpdateForm = function(test, assert){
  //console.log(forms);

  var formModel = models.get(connection, models.MODELNAMES.FORM);

  async.series([
    function(cb) {
      console.log('testUpdateForm() - 1 ');
      formModel.findOne({name: emptyForm.name}, function (err, data) {
        assert.ok(!err, 'should not returned error: ' + util.inspect(err));
        assert.isNull(data, 'should not have found form - haven\'t added it yet - found: ' + util.inspect(data));
        cb();
      });
    },
    function(cb) {
      console.log('testUpdateForm() - 2 ');
      forms.updateForm(options, emptyForm, function(err){
        console.log("testUpdateForm() - in callback");
        assert.isUndefined(err);
        cb();
      });
    },
    function(cb) {
      console.log('testUpdateForm() - 3 ');
      formModel.findOne({name: emptyForm.name}, function (err, data) {
        assert.ok(!err, 'should have found form');
        assert.assert.strictEqual(data.formDescription, emptyForm.formDescription, "new description should ahve been added");
        cb();
      });
    },
  ], function(err){
    assert.isUndefined(err);
    test.finish();
  });
};