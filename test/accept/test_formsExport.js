require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var dataSource = require('../Fixtures/dataSource.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var Form;
var connection;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var appId = "123456789";

var zipPath = path.join('.', 'test', 'Fixtures', 'forms_Export.zip')

module.exports.test = {}; module.exports.test.before = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    connection = mongoose.createConnection(options.uri);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.test.after = function(finish){
  connection.close(function(err){
    forms.tearDownConnection(options, function(err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.test.testExportForms = function(finish){
  var target = fs.createWriteStream(zipPath);

  forms.exportForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function (err, zipStream) {
    assert.equal(err, null);
    assert.ok(zipStream);

    zipStream.on('error', function () {
      assert.ok(false, "Error while creating the zip file");
    });

    zipStream.pipe(target);

    target.on('finish', function () {
      if (fs.existsSync(zipPath)) {
        var zipCmd = "unzip -Z1 " + zipPath;
        exec(zipCmd, function (err, stdout) {
          assert.equal(err, null);
          var contents = stdout.split('\n');
          assert.ok(checkContents(contents), "Zip file contents invalid");
          fs.unlinkSync(zipPath);
          finish();
        });
      } else {
        assert.ok(false, "Zip file was not created");
      }
    });
  });
};

function checkContents(array) {
  var metaDataPresent = false;
  var numberOfJsonFiles = 0;

  for (var i = 0; i < array.length; ++i) {
    var entry = array[i];
    if (entry == 'metadata.json') {
      metaDataPresent = true;
    } else if (/json$/.test(entry)) {
      numberOfJsonFiles++;
    }
  }

  return metaDataPresent &&  numberOfJsonFiles == 2;
}

function createTestData(assert, cb){
  models.init(connection);
  Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

  var form1 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  //Save the forms
  async.series([function(cb){
    form1.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }, function(cb){
    form2.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }], function(err){
    assert.ok(!err);

    //Now save the forms with the appId
    var appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      cb();
    });
  });
};