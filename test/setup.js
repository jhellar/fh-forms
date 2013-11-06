var proxyquire =  require('proxyquire').noCallThru(),
  application, ditchMock, authMock;

var testAppFormsDb = "testAppFormsDb";
var DB = require('mongodb').Db;
var Server = require('mongodb').Server;
var async = require('async');
var testEnv = require('./Fixtures/env.js');
var testsConfig = {
  "dbUser": "appformsuser",
  "dbPassword": "appformspass",
  "dbAddress" : "localhost",
  "dbPort": 27017,
  "dbForTests": "testAppFormsDb"
};

var models = require('../lib/common/models.js')();

//Need test data for fields, pages, forms, themes, appforms, appthemes,

var fieldSchemaText = {
  "_id": "123456789",
  "label": "SingleText",
  "helpText": "This is test single text Field 1.",
  "type": "singleText",
  "options": [{"key": "maxLength", "val": "100"}],
  "required": false
};

var fieldSchemaMultiText = {
  "_id": "123456788",
  "label": "MultiText",
  "helpText": "This is multi text Field 1.",
  "type": "multiText",
  "options": [{"key": "maxLength", "val": "900"}],
  "required": false
};

var fieldSchemaMultiText = {
  "_id": "123456787",
  "label": "testField1",
  "helpText": "This is test Field 1.",
  "type": "multiText",
  "options": [{"key": "maxLength", "val": "900"}],
  "required": false
};

exports.globalSetUp = function(test, assert){

  cleanDatabase(assert, function(err){
    assert.isNull(err);
    setUpDatabase(assert, function(err){
      assert.isNull(err);

      test.finish(); //Database set up will all data needed for tests.
    });
  });

}

exports.globalTearDown = function(test, assert){
  console.log("tearDown Called");
  cleanDatabase(assert, function(err){
    if(err) console.log(err);
    test.finish();
  });
}

function cleanDatabase(assert, cb){
  var db = new DB(testAppFormsDb, new Server(testsConfig.dbAddress, testsConfig.dbPort), {"w": 1, j: false});

  db.open(function(err, db){
    assert.isNull(err);
    assert.isDefined(db);

    db.authenticate("admin", "admin", {"authSource": "admin"}, function(err, ok){
      assert.isNull(err);

      db.dropDatabase(function(err, ok){
        assert.isNull(err);

        db.close(cb);
      });
    });
  });
}

function setUpDatabase(assert, cb){
  var db = new DB(testAppFormsDb, new Server(testsConfig.dbAddress, testsConfig.dbPort), {"w": 1, j: false});

  db.open(function(err, db){
    assert.isNull(err);

    db.authenticate("admin", "admin", {"authSource": "admin"}, function(err, ok){
      assert.isNull(err);

      db.addUser(testsConfig.dbUser, testsConfig.dbPassword, {}, function(err, ok){
        assert.isNull(err);

        //User added, add the data

        addTestData(db, function(err){
          assert.isUndefined(err);

          db.close(cb);
        });
      });
    });
  });
}

function addTestData(db, cb){

 return cb();
}


