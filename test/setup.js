var proxyquire =  require('proxyquire').noCallThru(),
  application, ditchMock, authMock;

var testAppFormsDb = "testAppFormsDb";
var DB = require('mongodb').Db;
var Server = require('mongodb').Server;
var async = require('async');
require('./Fixtures/env.js');
var models = require('../lib/common/models.js')();

//var fieldCollection = {[
//  "_id": "1234566783455463",
//  "label": String,
//  "helpText": String,
//  "type": String,
//  "required": Boolean
//}];

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
  var db = new DB(testAppFormsDb, new Server("localhost", 27017), {"w": 1, j: false});

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
  var db = new DB(testAppFormsDb, new Server("localhost", 27017), {"w": 1, j: false});

  db.open(function(err, db){
    assert.isNull(err);

    db.authenticate("admin", "admin", {"authSource": "admin"}, function(err, ok){
      assert.isNull(err);

      db.addUser("appformsuser", "appformspass", {}, function(err, ok){
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


