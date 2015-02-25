var proxyquire = require('proxyquire');
var assert = require('assert');
var fakeForms = require('../../Fixtures/mockforms.js');

var fakeMongoString = "mongo://127.0.0.1:27017";

var mocks = {
  '../forms.js': fakeForms
};

var dataTargetHandler = proxyquire('../../../lib/middleware/dataTargets.js', mocks);


module.exports = {
  "Test List Data Targets": function(done){

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    dataTargetHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Data Targets To Be Set On The Request");
      done();
    });
  },
  "Test Create Data Target": function(done){
    var testDataTarget = {
      _id: "dataTargetId",
      name: "Created dataTargetType"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: testDataTarget
    };

    dataTargetHandler.create(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data._id,  "Expected Created Data Target To Be Returned");
      done();
    });
  },
  "Test Get Data Target": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataTarget1234"
      }
    };

    dataTargetHandler.get(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data._id,  "Expected Data Target To Be Returned");
      done();
    });
  },
  "Test Update Data Target": function(done){
    var testDataTarget = {
      _id: "dataTargetId",
      name: "Created dataTargetType"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataTargetId"
      },
      body: testDataTarget
    };

    dataTargetHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(req.appformsResultPayload.data.name, "Updated Data Target",  "Expected Data Target To Be Returned");
      done();
    });
  },
  "Test Delete Data Target": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataTarget1234"
      }
    };

    dataTargetHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      done();
    });
  },
  "Get Data Targets Associated With A Service": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataTargetId"
      }
    };

    dataTargetHandler.getDataTargetsForService(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Data Targets To Be Set On The Request");
      done();
    });
  },
  "Test Validate Data Target": function(done){
    var testDataTarget = {
      name: "Test Validate dataTargetType"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: testDataTarget
    };

    dataTargetHandler.validate(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data.valid,  "Expected Created Data Target To Be Returned");
      done();
    });
  }
};