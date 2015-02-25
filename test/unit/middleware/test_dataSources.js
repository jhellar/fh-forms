var proxyquire = require('proxyquire');
var assert = require('assert');
var fakeForms = require('../../Fixtures/mockforms.js');

var fakeMongoString = "mongo://127.0.0.1:27017";

var mocks = {
  '../forms.js': fakeForms
};
var dataSourceHandler = proxyquire('../../../lib/middleware/dataSources.js', mocks);


module.exports = {
  "setUp": function(done){
    done();
  },
  "tearDown": function(done){
    done();
  },
  "Test List Data Sources": function(done){

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    dataSourceHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);

      assert.ok(req.appformsResultPayload.data, "Expected Data Sources To Be Set On The Request");
      done();
    });
  },
  "Test Create Data Source": function(done){

    var testDataSource = {
      name: "Created dataSourceType"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: testDataSource
    };

    dataSourceHandler.create(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data._id,  "Expected Created Data Source To Be Returned");
      done();
    });
  },
  "Test Get Data Source": function(done){

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataSource1234"
      }
    };

    dataSourceHandler.get(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data._id,  "Expected Data Source To Be Returned");
      done();
    });
  },
  "Test Update Data Source": function(done){

    var testDataSource = {
      _id: "dataSourceId",
      name: "Created dataSourceType"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataSourceId"
      },
      body: testDataSource
    };

    dataSourceHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(req.appformsResultPayload.data.name, "Updated Data Source",  "Expected Data Source To Be Returned");
      done();
    });
  },
  "Test Delete Data Source": function(done){

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "dataSourceId"
      }
    };

    dataSourceHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      done();
    });
  },
  "Get Data Sources Associated With A Service": function(done){

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someServiceGuid"
      }
    };

    dataSourceHandler.getDataSourcesForService(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Data Sources To Be Set On The Request");
      done();
    });
  },
  "Test Validate Data Source": function(done){

    var testDataSource = {
      name: "Data Source To Validate"
    };

    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: testDataSource
    };

    dataSourceHandler.validate(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data.valid,  "Expected Created Data Source To Be Returned");
      done();
    });
  }
};