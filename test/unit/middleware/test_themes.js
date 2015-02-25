var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var fakeForms = require('../../Fixtures/mockforms.js');

var fakeMongoString = "mongo://127.0.0.1:27017";
var mocks = {
  '../forms.js': fakeForms
};

var themesHandler = proxyquire('../../../lib/middleware/themes.js', mocks);

module.exports = {
  setUp: function(done){
    done();
  },
  tearDown: function(done){
    done();
  },
  "It Should List All Themes": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    themesHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected Not Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected The Themes Result To Be An Array");
      assert.ok(req.appformsResultPayload.data[0]._id, "Expected A Theme Id");
      done();
    });
  },
  "It Should Create A Theme": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: {
        name: "Some Theme Created Name"
      }
    };

    themesHandler.create(req, {}, function(err){
      assert.ok(!err, "Expected Not Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected The Themes Result To Not Be An Array");
      assert.equal(req.appformsResultPayload.data._id, "somethemeid", "Expected A Theme Id");
      done();
    });
  },
  "It Should Update A Theme": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somethemeidtoupdate"
      },
      body: {
        _id: "somethemeidtoupdate",
        name: "Some Theme Updated Name"
      }
    };

    themesHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected Not Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected The Themes Result To Not Be An Array");
      assert.equal(req.appformsResultPayload.data._id, "somethemeidtoupdate");
      done();
    });
  },
  "It Should Delete A Theme": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somethemeidtodelete"
      }
    };

    themesHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected Not Error");

      done();
    });
  },
  "It Should Clone A Theme": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "somethemeidtoclone"
      },
      body: {
        _id: "somethemeidtoclone",
        name: "Some Cloned Theme",
        updatedBy: "someuser@example.com"
      }
    };

    themesHandler.clone(req, {}, function(err){
      assert.ok(!err, "Expected Not Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected The Themes Result To Not Be An Array");
      assert.ok(req.appformsResultPayload.data._id, "Expected A Themes Result Id");

      done();
    });
  }
};