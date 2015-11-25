require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var misc = require('../../lib/common/misc.js');
var _ = require('underscore');
var dataSourceData = require('../Fixtures/dataSource.js');
var logger = require('../../lib/common/logger').getLogger();

var DataSource;
var connection;

var ERROR_CODES = models.CONSTANTS.ERROR_CODES;

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var dataOptions = {
  option1: function(selected){
    return  {
      key: "op1",
      value: "Option 1",
      selected: selected
    };
  },
  option2: function(selected){
    return  {
      key: "op2",
      value: "Option 2",
      selected: selected
    };
  },
  option3: function(selected){
    return  {
      key: "op3",
      value: "Option 3",
      selected: selected
    };
  }
};

function verifyDataSourceJSON(expected, actual){
  assert.ok(expected, "verifyDataSourceJSON: expected object required");
  assert.ok(actual, "verifyDataSourceJSON: actual object required");

  logger.debug("verifyDataSourceJSON ", expected, actual);

  assert.ok(_.isEqual(expected, _.omit(actual, "lastUpdated", "dateCreated")), "Expected objects to be equal. Expected: " + util.inspect(expected) + " Actual: " + util.inspect(_.omit(actual, "lastUpdated", "dateCreated")));
}

function verifyDataSourceResponse(expectedDataSource, expectedDataSourceData, expectedHash, expectedError, actualResponse){
  //The response should return the contents of the cache.
  var testResponse = _.clone(actualResponse);
  assert.ok(testResponse.lastRefreshed, "Expected A Last Refreshed Field To Be Set");

  delete testResponse.lastRefreshed;

  var status = expectedError ? {
    status: "error",
    error: expectedError
  } : {
    status: "ok"
  };

  //Should have data source data
  var expectedResponse = expectedDataSource;

  _.extend(expectedResponse, {
    dataHash: expectedHash,
    currentStatus: status,
    data: expectedDataSourceData
  });

  //Base Data Source Information Should Be Returned
  verifyDataSourceJSON(expectedResponse, testResponse);
}

module.exports = {
  "setUp": function(done){
    initDatabase(assert, function(err) {
      assert.ok(!err, "Unexpected Error " + util.inspect(err));
      connection = mongoose.createConnection(options.uri);
      models.init(connection);

      DataSource = models.get(connection, models.MODELNAMES.DATA_SOURCE);
      done();
    });
  },
  "tearDown": function(done){
    //Remove Any Existing Data Sources

    DataSource.remove({}, function(err){
      assert.ok(!err, "Unexpected Error " + util.inspect(err));
      connection.close(function(err) {
        assert.ok(!err);
        forms.tearDownConnection(options, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  },
  "Test Create New Data Source": function(done){
    var testDataSource = _.clone(dataSourceData);

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

      //Data Source Was Created, verify responses
      assert.ok(createdDataSource, "Expected The Data Source To Be Returned");
      assert.ok(createdDataSource._id, "Expected The Data Source ID To Be Returned");
      assert.ok(createdDataSource.lastUpdated, "Expected A Last Updated Field");
      assert.ok(createdDataSource.dateCreated, "Expected A Date Created Field");
      assert.ok(createdDataSource.createdBy, "Expected A Created By Field");
      assert.equal(createdDataSource.createdBy, testDataSource.createdBy);
      assert.ok(createdDataSource.updatedBy, "Expected A Updated By Field");
      assert.equal(createdDataSource.updatedBy, testDataSource.updatedBy);

      testDataSource._id = createdDataSource._id;

      verifyDataSourceJSON(testDataSource, createdDataSource);

      done();
    });
  },
  "Test Create New Service Data Source No Service Guid": function(done){
    var testDataSource = {
      name: "Test Service Data Source",
      description: "Test Service Data Source",
      endpoint: "/path/to/data",
      refreshInterval: 3000
    };

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(err, "Expected An Error When Creating A Service Data Source With No Service Guid");
      assert.ok(err.userDetail.indexOf("Invalid Data Source Creation Data") > -1, "Unexpected Error Message: " + util.inspect(err));
      assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected An FH_FORMS_INVALID_PARAMETERS Error Code");
      assert.ok(!createdDataSource, "Exepected No Data Source To Have Been Created");

      done();
    });
  },
  "Test Remove Data Source": function(done){
    var testDataSource = _.clone(dataSourceData);

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));
      assert.ok(createdDataSource._id, "Expected A Data Source Id");

      var removalParams = {
        _id: createdDataSource._id
      };

      forms.dataSources.remove(options, removalParams, function(err){
        assert.ok(!err, "Unexpected Error: dataSource.remove" + util.inspect(err));

        forms.dataSources.get(options, removalParams, function(err, foundDataSource){
          assert.ok(err, "Expected An Error When Getting Data Source That Should Not Exist");
          assert.ok(err.userDetail.indexOf("Data Source Not Found") > -1);
          assert.ok(err.code === ERROR_CODES.FH_FORMS_NOT_FOUND, "Expected A HTTP FH_FORMS_NOT_FOUND Error Code");
          assert.ok(!foundDataSource, "Expected No Data Source When Creating A Data Source With Bad Data");
          //Removing A Non Existing Data Source Should Not Cause An Error
          forms.dataSources.remove(options, removalParams, function(err){
            assert.ok(!err, "Unexpected Error When Removing A Non Existing Data Source " + util.inspect(err));
            done();
          });
        });
      });
    });
  },
  "Test Create New Service Data Source Already Exists": function(done){
    var testDataSource = _.clone(dataSourceData);

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

      //Should Not Be Able To Create It Again
      forms.dataSources.create(options, createdDataSource, function(err){
        assert.ok(err, "Expected An Error When Creating A Data Source That Already Exists");
        assert.ok(err.userDetail.indexOf("Data Source ID Should Not Be Included When Creating A Data Source") > -1, "Unexpected Error Message: " + util.inspect(err));
        assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP FH_FORMS_INVALID_PARAMETERS Error Code");
        done();
      });
    });
  },
  "Test Update Existing Service Data Source": function(done){
    var testDataSource = _.clone(dataSourceData);

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

      testDataSource._id = createdDataSource._id;

      verifyDataSourceJSON(testDataSource, createdDataSource);

      testDataSource.description = "Updated Data Source Description";

      forms.dataSources.update(options, testDataSource, function(err, updatedDataSource){
        assert.ok(!err, "Unexpected Error: dataSource.update" + util.inspect(err));

        //Update requires a forms field to show which forms are referenced by the dataSource
        testDataSource.forms = [];

        verifyDataSourceJSON(testDataSource, updatedDataSource);

        done();
      });
    });
  },
  "Test Update Existing Service Data Source No Service GUID": function(done){
    var testDataSource = _.clone(dataSourceData);

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

      testDataSource._id = createdDataSource._id;
      verifyDataSourceJSON(testDataSource, createdDataSource);

      var updateDataSource = _.clone(testDataSource);

      delete updateDataSource.serviceGuid;
      updateDataSource.endpoint = "/new/uri/to/data";

      forms.dataSources.update(options, updateDataSource, function(err, updatedDataSource){
        assert.ok(!err, "Unexpected Error: dataSource.update" + util.inspect(err));

        assert.ok(updatedDataSource, "Expected The Data Source To Be Returned");
        assert.ok(updatedDataSource._id, "Expected The Data Source ID To Be Returned");

        var expectedResult = _.clone(testDataSource);
        expectedResult.endpoint = "/new/uri/to/data";
        expectedResult.forms = [];

        verifyDataSourceJSON(expectedResult, updatedDataSource);

        done();
      });
    });
  },
  "Test Update Data Source Data Set Single Choice": function(done){
    //First, create a data source
    var testDataSource1 = _.clone(dataSourceData);

    var testDataSource2 = _.clone(dataSourceData);

    var dataSourceSingleChoiceRefreshTimestamp;

    async.series([
      function createDataSource1(cb){
        forms.dataSources.create(options, testDataSource1, function(err, createdDataSource1){
          assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

          assert.ok(createdDataSource1._id, "Expected A Data Source ID");

          testDataSource1._id = createdDataSource1._id;

          cb();
        });
      },
      function createDataSource2(cb){
        forms.dataSources.create(options, testDataSource2, function(err, createdDataSource2){
          assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

          assert.ok(createdDataSource2._id, "Expected A Data Source ID");

          testDataSource2._id = createdDataSource2._id;

          cb();
        });
      },
      function updateDataSources(cb){
        //Updating A Single Data Source Data Set
        var dataSourceDataSingleChoice = {
          data: [
            dataOptions.option1(false),
            dataOptions.option2(true)
          ]
        };
        dataSourceDataSingleChoice._id = testDataSource1._id;
        var expectedHashSingle = misc.generateHash(dataSourceDataSingleChoice.data);


        var dataSourceDataMultiChoice = {
          data: [
            dataOptions.option1(false),
            dataOptions.option2(true),
            dataOptions.option3(true)
          ]
        };
        var expectedHashMulti = misc.generateHash(dataSourceDataMultiChoice.data);

        dataSourceDataMultiChoice._id = testDataSource2._id;

        //Now Updating A Single Data Source
        forms.dataSources.updateCache(options, [dataSourceDataSingleChoice, dataSourceDataMultiChoice], {
          currentTime: new Date()
        }, function(err, updateResult){
          assert.ok(!err, "Unexpected Error When Updating Data Source Data " + util.inspect(err));

          //Should Only Be 2 Successfully Updated Data Sources
          assert(updateResult.validDataSourceUpdates.length === 2, "Expected Two Updated Data Source To Be Returned");
          assert(updateResult.invalidDataSourceUpdates.length === 0, "Expected No Failed Data Source Updates");

          var dataSourceUpdateResponseSingle = updateResult.validDataSourceUpdates[0];
          var dataSourceUpdateResponseMulti = updateResult.validDataSourceUpdates[1];

          verifyDataSourceResponse(testDataSource1, dataSourceDataSingleChoice.data, expectedHashSingle, undefined, dataSourceUpdateResponseSingle);

          verifyDataSourceResponse(testDataSource2, dataSourceDataMultiChoice.data, expectedHashMulti, undefined, dataSourceUpdateResponseMulti);

          //Noting The Last Refreshed Timestamp
          dataSourceSingleChoiceRefreshTimestamp = dataSourceUpdateResponseSingle.lastRefreshed;

          cb();
        });
      },
      function(cb){
        //Updating A Single Data Source With Different Data should change the response.
        var updatedSingleChoiceData = {
          data: [
            dataOptions.option2(true),
            dataOptions.option1(false)
          ]
        };
        updatedSingleChoiceData._id = testDataSource1._id;
        var expectedHashUpdated = misc.generateHash(updatedSingleChoiceData.data);

        forms.dataSources.updateCache(options, [updatedSingleChoiceData], {
          currentTime: new Date()
        }, function(err, updateResult){
          assert.ok(!err, "Unexpected Error When Updating Data Source Data");

          //Should Only Be 1 Successfully Updated Data Sources
          assert(updateResult.validDataSourceUpdates.length === 1, "Expected Two Updated Data Source To Be Returned");
          assert(updateResult.invalidDataSourceUpdates.length === 0, "Expected No Failed Data Source Updates");

          var dataSourceUpdateResponseSingle = updateResult.validDataSourceUpdates[0];
          verifyDataSourceResponse(testDataSource1, updatedSingleChoiceData.data, expectedHashUpdated, undefined, dataSourceUpdateResponseSingle);


          var beforeRefreshedTimestamp = new Date(dataSourceSingleChoiceRefreshTimestamp).getTime();
          var afterRefreshedTimestamp = new Date(dataSourceUpdateResponseSingle.lastRefreshed).getTime();

          //The lastRefreshed Field Should Have Been Updated
          assert.ok(afterRefreshedTimestamp > beforeRefreshedTimestamp, "Expected The Timestamp After Updating A Data Source To Have Changed");

          cb();
        });
      }
    ], done);
  },
  "Test Update Data Source Data Set Wrong Format": function(done){
    var testDataSource = _.clone(dataSourceData);

    var dataSourceDataSingleChoice = {
      data: [
        dataOptions.option1(false),
        dataOptions.option2(true)
      ]
    };

    forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
      assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

      dataSourceDataSingleChoice._id = createdDataSource._id;

      forms.dataSources.updateCache(options, [dataSourceDataSingleChoice], {
        currentTime: new Date()
      }, function(err, updateResult){
        assert.ok(!err, "Unexpected Error When Updating Data Source Data: " + util.inspect(err) );

        var validUpdates = updateResult.validDataSourceUpdates;
        var invalidUpdates = updateResult.invalidDataSourceUpdates;

        assert.equal(1, validUpdates.length, "Expected 1 valid update");
        assert.equal(0, invalidUpdates.length, "Expected 0 invalid updates");

        assert.ok(validUpdates[0]._id, "Expected An Updated Data Source");

        //Updating A Data Source With Junk Data Should Maintain The Latest Correct Data Set
        dataSourceDataSingleChoice.data = [
          {
            wrongvalue: "wrong label 1"
          }
        ];

        forms.dataSources.updateCache(options, [dataSourceDataSingleChoice], {
          currentTime: new Date()
        }, function(err, badUpdateResult){
          assert.ok(err, "Expected An Error When Updating Data Sources With Bad Data");
          assert.equal(ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR, err.code, "Expected A FH_FORMS_UNEXPECTED_ERROR");

          var validUpdates = badUpdateResult.validDataSourceUpdates;
          var invalidUpdates = badUpdateResult.invalidDataSourceUpdates;

          assert.equal(0, validUpdates.length, "Expected 0 valid update");
          assert.equal(1, invalidUpdates.length, "Expected 1 invalid updates");

          var badUpdate = invalidUpdates[0];

          var expectedResult = _.clone(dataSourceDataSingleChoice);

          expectedResult.error = {
            code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS,
            userDetail: "Invalid Data Cache Update",
            systemDetail: "Validation failed"
          };

          verifyDataSourceJSON(expectedResult, badUpdate);

          done();
        });
      });
    });
  },
  "Test Update Data Source With Data Error": function(done){
    //Should Test An Error Expected To Be Stored With The Data Source

    var testErrorDataSource = _.clone(dataSourceData);
    var testDate = new Date();

    async.series([
      function createDataSource(cb){
        forms.dataSources.create(options, testErrorDataSource, function(err, createdDataSource) {
          assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

          testErrorDataSource._id = createdDataSource._id;
          cb();
        });
      },
      function(cb){
        testErrorDataSource.dataError = {
          userDetail: "Error Getting Data From Service",
          systemDetail: "Invalid Response Code 500",
          code: "SERVICE_NOT_AVAILABLE"
        };

        forms.dataSources.updateCache(options, [testErrorDataSource], {
          currentTime: testDate
        }, function(err, errUpdateResult){
          assert.ok(!err, "Expected No Error " + util.inspect(err));


          //It Should Be A Valid Data Source Update With An Error
          assert.ok(errUpdateResult.validDataSourceUpdates[0]);
          assert.equal(errUpdateResult.validDataSourceUpdates[0].currentStatus.status, "error");
          assert.equal(errUpdateResult.validDataSourceUpdates[0].currentStatus.error.userDetail, "Error Getting Data From Service");
          assert.equal(errUpdateResult.validDataSourceUpdates[0].currentStatus.error.systemDetail, "Invalid Response Code 500");
          assert.equal(errUpdateResult.validDataSourceUpdates[0].currentStatus.error.code, "SERVICE_NOT_AVAILABLE");
          cb();
        });
      }
    ], done);
  },
  "Test Validate Data Source Data": function(done){
    //Forms Should Have A Separate Function To Validate A Data Set.

    var baseDataSourceData = _.clone(dataSourceData);

    var dataSourceDataSingleChoice = _.extend({
      data: [
        dataOptions.option1(false),
        dataOptions.option2(true)
      ]
    }, baseDataSourceData);

    var dataSourceDataNoChoice = _.extend({
      data: [
      ]
    }, baseDataSourceData);


    async.series([
      function(cb){
        forms.dataSources.validate(options, dataSourceDataSingleChoice, function(err, validationResult){
          assert.ok(!err, "Expected No Validation Error");

          //The Validation Result Should Be A Full DataSource Object With Validation Data - Useful for the user if they want to see the data that was validated.
          var expectedResult = _.clone(dataSourceDataSingleChoice);

          expectedResult.dataHash = misc.generateHash(dataSourceDataSingleChoice.data);
          expectedResult.validationResult = {
            valid: true,
            message: "Data Source Is Valid"
          };

          verifyDataSourceJSON(expectedResult, validationResult);

          cb();
        });
      },
      function(cb){
        forms.dataSources.validate(options, dataSourceDataNoChoice, function(err, validationResult){
          assert.ok(!err, "Expected No Error");

          var expectedResult = _.clone(dataSourceDataNoChoice);

          expectedResult.dataHash = misc.generateHash(dataSourceDataNoChoice.data);
          expectedResult.validationResult = {
            valid: false,
            message: "Invalid Data Source"
          };

          verifyDataSourceJSON(expectedResult, validationResult);

          cb();
        });
      }
    ], done);
  }

};