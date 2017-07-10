require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var fs = require('fs');
var _ = require('underscore');
var dataTargetData = require('../Fixtures/dataTarget.js');

var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var ERROR_CODES = models.CONSTANTS.ERROR_CODES;

var DataTarget;
var connection;

function verifyDataTargetJSON(expected, actual){
  assert.ok(expected, "verifyDataSourceJSON: expected object required");
  assert.ok(actual, "verifyDataSourceJSON: actual object required");

  assert.ok(_.isEqual(expected, _.omit(actual, "lastUpdated", "dateCreated")), "Expected objects to be equal. Expected: " + util.inspect(expected) + " Actual: " + util.inspect(_.omit(actual, "lastUpdated", "dateCreated")));
}

module.exports.test = {
  "before": function(done){
    initDatabase(assert, function(err) {
      assert.ok(!err, "Unexpected Error " + util.inspect(err));
      connection = mongoose.createConnection(options.uri);
      models.init(connection);

      DataTarget = models.get(connection, models.MODELNAMES.DATA_TARGET);
      done();
    });
  },
  "after": function(done){
    //Remove Any Existing Data Targets
    DataTarget.remove({}, function(err){
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
  "Test Create New Post Processing Data Target": function(done){
    var testDataTarget = _.clone(dataTargetData.postProcessing);

    forms.dataTargets.create(options, testDataTarget, function(err, createdDataTarget){
      assert.ok(!err, "Unexpected Error When Creating A Data Target " + util.inspect(err));

      //Data Target Was Created
      assert.ok(createdDataTarget, "Expected The Data Source To Be Returned");
      assert.ok(createdDataTarget._id, "Expected The Data Source ID To Be Returned");
      assert.ok(createdDataTarget.lastUpdated, "Expected A Last Updated Field");
      assert.ok(createdDataTarget.dateCreated, "Expected A Date Created Field");
      assert.ok(createdDataTarget.createdBy, "Expected A Created By Field");
      assert.equal(createdDataTarget.createdBy, testDataTarget.createdBy);
      assert.ok(createdDataTarget.updatedBy, "Expected A Updated By Field");
      assert.equal(createdDataTarget.updatedBy, testDataTarget.updatedBy);

      testDataTarget._id = createdDataTarget._id;

      verifyDataTargetJSON(testDataTarget, createdDataTarget);

      //Checking List Operation For Data Targets
      forms.dataTargets.list(options, {}, function(err, dataTargets){
        assert.ok(!err, "Unexpected Error When Listing Data Targets " + util.inspect(err));

        assert.ok(dataTargets instanceof Array, "Expected Data Target List Response To Be An Array " + util.inspect(dataTargets));

        assert.ok(dataTargets.length === 1, "Expected A Single Data Target But Got: " + util.inspect(dataTargets));

        //Testing Get For A Single Data Target
        var getDataTargetParameters = {
          _id: testDataTarget._id
        };

        forms.dataTargets.get(options, getDataTargetParameters, function(err, singleDataTarget){
          assert.ok(!err, "Unexpected Error When Listing Data Targets " + util.inspect(err));

          //Expect A List Of Forms That Use This Data Target
          testDataTarget.forms = [];

          verifyDataTargetJSON(testDataTarget, singleDataTarget);

          done();
        });
      });
    });
  },
  "Test Remove Data Target No Associated Forms": function(done){
    var testDataTarget = _.clone(dataTargetData.postProcessing);

    forms.dataTargets.create(options, testDataTarget, function(err, createdDataTarget){
      assert.ok(!err, "Unexpected Error When Creating A Data Target " + util.inspect(err));

      //Data Target Was Created
      assert.ok(createdDataTarget, "Expected The Data Source To Be Returned");
      assert.ok(createdDataTarget._id, "Expected The Data Source ID To Be Returned");

      testDataTarget._id = createdDataTarget._id;

      verifyDataTargetJSON(testDataTarget, createdDataTarget);

      var removalParams = {
        _id: testDataTarget._id
      };

      forms.dataTargets.remove(options, removalParams, function(err){
        assert.ok(!err, "Unexpected Error When Removing A Data Target " + util.inspect(err));

        //Data Target Should Not Be Present
        forms.dataTargets.get(options, removalParams, function(err, foundDataTarget){
          assert.ok(err, "Expected An Error When Getting Data Target That Should Not Exist");
          assert.ok(err.userDetail.indexOf("Data Target Not Found") > -1);
          assert.ok(err.code === ERROR_CODES.FH_FORMS_NOT_FOUND, "Expected A HTTP Error Code Of 404");
          assert.ok(!foundDataTarget, "Expected No Data Target When Creating A Data Target With Bad Data");

          //Removing A Non Existing Data Target Should Not Cause An Error
          forms.dataTargets.remove(options, removalParams, function(err){
            assert.ok(!err, "Unexpected Error When Removing A Non Existing Data Target " + util.inspect(err));
            done();
          });
        });
      });
    });
  },
  "Test Create New Post Processing Data Target Bad Data": function(done){
    var testDataTargetNoEndpoints = {
      name: "Test Data Target",
      description: "Testing Data Target",
      serviceGuid: "service12345",
      type: "postProcessing"
    };

    var testDataTargetWrongEndpoints = {
      name: "Test Data Target",
      description: "Testing Data Target",
      serviceGuid: "service12345",
      type: "postProcessing",
      endpoints: {
        realTimeData: "/uri/to/call/after/submission"
      }
    };

    forms.dataTargets.create(options, testDataTargetNoEndpoints, function(err, dataTargetCreated){
      assert.ok(err, "Expected An Error When Creting Data Targets With No Endpoints");
      assert.ok(err.userDetail.indexOf("Invalid Data Target Creation Data.") > -1);
      assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP Error Code Of 400");
      assert.ok(!dataTargetCreated, "Expected No Data Target When Creating A Data Target With Bad Data");

      forms.dataTargets.create(options, testDataTargetWrongEndpoints, function(err, dataTargetCreated){
        assert.ok(err, "Expected An Error When Creting Data Targets With No Endpoints");
        assert.ok(err.userDetail.indexOf("Invalid Data Target Creation Data.") > -1);
        assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP Error Code Of 400");
        assert.ok(!dataTargetCreated, "Expected No Data Target When Creating A Data Target With Bad Data");

        done();
      });
    });
  },
  "Test Create New Real Time Data Target": function(done){
    var testDataTarget = _.clone(dataTargetData.realTime);

    forms.dataTargets.create(options, testDataTarget, function(err, createdDataTarget){
      assert.ok(!err, "Unexpected Error When Creating A Data Target " + util.inspect(err));

      //Data Target Was Created
      assert.ok(createdDataTarget, "Expected The Data Source To Be Returned");
      assert.ok(createdDataTarget._id, "Expected The Data Source ID To Be Returned");

      testDataTarget._id = createdDataTarget._id;

      verifyDataTargetJSON(testDataTarget, createdDataTarget);
      done();
    });
  },
  "Test Create New Real Time Data Target Wrong Endpoints": function(done){
    var testDataTargetNoEndpoints = {
      name: "Test Real Time Data Target No Endpoints",
      description: "Testing Real Time Data Target",
      serviceGuid: "service12345",
      type: "realTime"
    };

    var testDataTargetWrongEndpoints = {
      name: "Test Real Time Data Target Wrong Endpoints",
      description: "Testing Real Time Data Target",
      serviceGuid: "service12345",
      type: "realTime",
      endpoints: {
        realTimeData: "/uri/to/call/form/submissionJSON"
      }
    };

    forms.dataTargets.create(options, testDataTargetNoEndpoints, function(err, createdDataTarget){
      assert.ok(err, "Expected An Error When Creting Data Targets With No Endpoints");
      assert.ok(err.userDetail.indexOf("Invalid Data Target Creation Data.") > -1);
      assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP Error Code Of 400");
      assert.ok(!createdDataTarget, "Expected No Data Target When Creating A Data Target With Bad Data");

      forms.dataTargets.create(options, testDataTargetWrongEndpoints, function(err, createdDataTarget){
        assert.ok(err, "Expected An Error When Creting Data Targets With No Endpoints");
        assert.ok(err.userDetail.indexOf("Invalid Data Target Creation Data.") > -1);
        assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP Error Code Of 400");
        assert.ok(!createdDataTarget, "Expected No Data Target When Creating A Data Target With Bad Data");

        done();
      });
    });
  },
  "Test Update Data Target Change Endpoint Type": function(done){
    //Should be able to update the data target and change the endpoint

    var testDataTargetPostProcessing = _.clone(dataTargetData.postProcessing);

    forms.dataTargets.create(options, testDataTargetPostProcessing, function(err, createdDataTarget){
      assert.ok(!err, "Unexpected Error When Creating A Data Target " + util.inspect(err));

      //Data Target Was Created
      assert.ok(createdDataTarget, "Expected The Data Source To Be Returned");
      assert.ok(createdDataTarget._id, "Expected The Data Source ID To Be Returned");

      //Switching To A Real Time Data Target
      testDataTargetPostProcessing._id = createdDataTarget._id;
      testDataTargetPostProcessing.type = "realTime";
      testDataTargetPostProcessing.endpoints = {
        realTimeData: "/uri/to/call/form/submissionJSON",
        realTimeFile: "/uri/to/call/form/file"
      };

      forms.dataTargets.update(options, testDataTargetPostProcessing, function(err, updatedDataTarget){
        assert.ok(!err, "Unexpected Error When Updating A Data Target " + util.inspect(err));

        //Associated Forms Are Required When Updating A Data Target.
        testDataTargetPostProcessing.forms = [];
        verifyDataTargetJSON(testDataTargetPostProcessing, updatedDataTarget);

        done();
      });
    });
  },
  "Test Update Data Target Change Endpoint Type Wrong Endpoints": function(done){
    var testDataTargetPostProcessing = _.clone(dataTargetData.postProcessing);

    forms.dataTargets.create(options, testDataTargetPostProcessing, function(err, createdDataTarget){
      assert.ok(!err, "Unexpected Error When Creating A Data Target " + util.inspect(err));

      //Data Target Was Created
      assert.ok(createdDataTarget, "Expected The Data Source To Be Returned");
      assert.ok(createdDataTarget._id, "Expected The Data Source ID To Be Returned");

      //Switching To A Real Time Data Target
      var testWrongUpdateTarget = _.clone(testDataTargetPostProcessing);
      testWrongUpdateTarget._id = createdDataTarget._id;
      testWrongUpdateTarget.type = "realTime";
      testWrongUpdateTarget.endpoints = {
        realTimeData: "/uri/to/call/form/submissionJSON"
      };

      forms.dataTargets.update(options, testWrongUpdateTarget, function(err, updatedDataTarget){
        assert.ok(err, "Expected An Error When Creting Data Targets With No Endpoints");
        assert.ok(err.userDetail.indexOf("Invalid Data Target Update Data.") > -1);
        assert.ok(err.code === ERROR_CODES.FH_FORMS_INVALID_PARAMETERS, "Expected A HTTP Error Code Of 400");

        assert.ok(!updatedDataTarget, "Expected No Data Target When Updating A Data Target With Bad Data");

        //Verify That The Data Target Is In Its Original Form
        var getDataTargetParameters = {
          _id: createdDataTarget._id
        };
        forms.dataTargets.get(options, getDataTargetParameters, function(err, currentDataTarget){
          assert.ok(!err, "Unexpected Error When Getting A Data Target " + util.inspect(err));

          testDataTargetPostProcessing._id = createdDataTarget._id;
          testDataTargetPostProcessing.forms = [];

          verifyDataTargetJSON(testDataTargetPostProcessing, currentDataTarget);

          done();
        });
      });
    });
  }
}