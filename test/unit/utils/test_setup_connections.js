var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var mongooseConnectStub = sinon.stub();
var mongoClientConnectStub = sinon.stub();
var mongourl = "mongo://test.example.com";

var underTest = proxyquire('../../../lib/utils/setup_connections', {
  mongoose: {
    createConnection: mongooseConnectStub
  },
  mongodb: {
    MongoClient: {
      connect: mongoClientConnectStub
    }
  }
});

exports.testNewMongooseConnection = function(done) {
  mongooseConnectStub.reset();
  mongooseConnectStub.returns("newConnection");
  underTest.getMongooseConnection(mongourl, null, function(err, mongooseConnection){
    assert.ok(!err);
    assert.ok(mongooseConnection);
    assert.ok(mongooseConnectStub.calledOnce);
    done();
  });
};

exports.testReuseExistingMongooseConnection = function(done) {
  mongooseConnectStub.reset();
  var existingConnection = {useDb: sinon.stub()};
  existingConnection.useDb.returns("existingConnection");
  underTest.getMongooseConnection(mongourl, existingConnection, function(err, mongooseConnection) {
    assert.ok(!err);
    assert.ok(mongooseConnection);
    assert.equal(0, mongooseConnectStub.callCount);
    assert.ok(existingConnection.useDb.calledOnce);
    done();
  });
};

exports.testNewMongoConnection = function(done) {
  mongoClientConnectStub.reset();
  mongoClientConnectStub.yields(null, "newConnection");
  underTest.getMongoConnection(mongourl, null, function(err, mongoConnection){
    assert.ok(!err);
    assert.ok(mongoConnection);
    assert.ok(mongoClientConnectStub.calledOnce);
    done();
  });
};

exports.testExistingMongoConnnection = function(done) {
  mongoClientConnectStub.reset();
  var existingConnection = {db: sinon.stub()};
  existingConnection.db.returns("existingConnection");
  underTest.getMongoConnection(mongourl, existingConnection, function(err, mongoConnection) {
    assert.ok(!err);
    assert.ok(mongoConnection);
    assert.equal(0, mongoClientConnectStub.callCount);
    assert.ok(existingConnection.db.calledOnce);
    done();
  });
}