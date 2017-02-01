var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var logger = require('../../lib/common/logger');
var log = logger.getLogger();

var mongoClient = sinon.stub();
var mongooseConnect = sinon.stub();

var underTest = proxyquire('../../lib/shared-mongo-connections', {
  'mongodb': {
    MongoClient: {
      connect: mongoClient
    }
  },
  'mongoose': {
    createConnection: mongooseConnect
  }
});

exports.testGetSharedMongodb = function(done) {
  var mongoString = "mongo://test.example.me/test";
  var config = {
    mongo: {
      admin_auth: {
        user: 'test',
        pass: 'test'
      }
    }
  };
  var mongoConnection = "mongoConnection";
  var mongooseConnection = "mongooseConnection";
  mongoClient.yields(null, mongoConnection);
  mongooseConnect.returns(mongooseConnection);

  underTest(log, mongoString, config, function(err, connections) {
    assert.ok(!err);
    assert.equal(connections.mongodbConnection,  mongoConnection);
    assert.equal(connections.mongooseConnection, mongooseConnection);
    done();
  });
};