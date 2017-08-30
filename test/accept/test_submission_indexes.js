require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var models = require('../../lib/common/models')();

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.test = {
  "It Should Have Indexes On submissionStartedTimestamp and submissionCompletedTimestamp": function(done){
    var connection = mongoose.createConnection(options.uri);
    var _dbConnection;
    models.init(connection, {});
    //If a submission is created, it should have indexes in the submissionCompletedTimestamp and submissionStartedTimestamp fields
    async.waterfall([
      function checkIndexesCreated(cb){
        async.waterfall([
          function getSubmissionsCollection(callback){
            MongoClient.connect(options.uri, function(err, dbConnection){
              assert.ok(!err, "Expected no error " + err);

              _dbConnection = dbConnection;

              dbConnection.collection('formsubmissions', callback);
            });
          },
          function verifyIndexes(submissionsCollection, callback){
            submissionsCollection.indexExists(['submissionCompletedTimestamp_1', 'submissionStartedTimestamp_1'], function(err, indexesExist){
              assert.ok(!err, "Expeced No Error " + err);
              console.log("indexesExist", indexesExist);
              assert.equal(true, indexesExist, "Expected Indexes To Exist But Was false");
              callback();
            });
          }
        ], cb);
      },
      function disconnectMongoose(cb){
        connection.close(cb);
      },
      function disconnectDb(cb){
        _dbConnection.close(cb);
      }
    ], done);
  }
};
