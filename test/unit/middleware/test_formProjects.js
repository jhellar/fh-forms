var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var fakeForms = require('../../Fixtures/mockforms.js');

var fakeMongoString = "mongo://127.0.0.1:27017";

var mocks = {
  '../forms.js': fakeForms
};

var formsProjectHandler = proxyquire('../../../lib/middleware/formProjects.js', mocks);

module.exports = {
  "setUp": function(done){
    done();
  },
  "tearDown": function(done){
    done();
  },
  "Test List Forms Projects": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    formsProjectHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected Forms Projects To Be Set On The Request");
      done();
    });
  },
  "Test Get Forms Project": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someFormsProjectGuid"
      }
    };

    formsProjectHandler.get(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Forms Projects To Be Set On The Request");
      done();
    });
  },
  "Test Update Forms Project": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someFormsProjectGuid"
      },
      body: {
        appId: "someFormsProjectGuid",
        forms: ["someNewForms"]
      }
    };

    formsProjectHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Forms Projects To Be Set On The Request");
      done();
    });
  },
  "Test Remove Forms Project": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someFormsProjectGuid"
      }
    };

    formsProjectHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      done();
    });
  },
  "Test Get Forms Project Config": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someFormsProjectGuid"
      }
    };

    formsProjectHandler.getConfig(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Forms Projects Config To Be Set On The Request");
      assert.ok(req.appformsResultPayload.data.client, "Expected A Client Config");
      assert.ok(req.appformsResultPayload.data.cloud, "Expected A Cloud Config");
      done();
    });
  },
  "Test Update Forms Project Config": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someFormsProjectGuid"
      },
      body: {
        client: {
          someClientKey: "someClientVal"
        },
        cloud: {
          someCloudKey: "someCloudVal"
        }
      }
    };

    formsProjectHandler.updateConfig(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data, "Expected Forms Projects Config To Be Set On The Request");
      assert.ok(req.appformsResultPayload.data.client, "Expected A Client Config");
      assert.ok(req.appformsResultPayload.data.cloud, "Expected A Cloud Config");
      done();
    });
  },
  "Test Export Forms Project Config": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    formsProjectHandler.exportProjectConfig(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data[0].appId);
      assert.ok(req.appformsResultPayload.data[0].client, "Expected A Client Config");
      assert.ok(req.appformsResultPayload.data[0].cloud, "Expected A Cloud Config");
      done();
    });
  },
  "Test Import Forms Project Config": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: [{
        appId: "someappid",
        client: {

        },
        cloud: {

        }
      }]
    };

    formsProjectHandler.importProjectConfig(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      done();
    });
  },
  "Test Export Appforms": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    formsProjectHandler.exportProjects(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(req.appformsResultPayload.data[0].appId);
      done();
    });
  },
  "Test Import Appforms": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: [{appId: "someappid"}]
    };

    formsProjectHandler.importProjects(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);
      done();
    });
  }
};