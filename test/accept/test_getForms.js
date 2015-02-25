require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var dataSource = require('../Fixtures/dataSource.js');
var handyFieldData = require('../Fixtures/formSubmissions.js');
var util = require('util');
var _ = require('underscore');
var simpleForm = require('../Fixtures/simple.js');
var Form;
var connection;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var appId = "123456789";

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    connection = mongoose.createConnection(options.uri);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
};

function cleanUp(cb){
  Form.remove({}, function(err){
    assert.ok(!err, "Expected No Error When Clearing Forms");
    cb();
  });
}

module.exports.tearDown = function(finish){
  connection.close(function(err){
    if(err) console.log(err);
    forms.tearDownConnection(options, function(err) {
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.testGetFormsWorks = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);

    assert.ok(Array.isArray(result));
    assert.ok(result.length === 2);// Should have 2 forms associated with the appId

    checkForm(result[0], {"name": "Test Form 1", "description" : "This is a test form 1."});
    checkForm(result[1], {"name": "Test Form 2", "description" : "This is a test form 2."});

    finish();
  });
};

module.exports.testGetFormsNoUri = function(finish){
  forms.getForms({}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetFormsNoAppId = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetFormsNoAppExists = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": "theWrongId"}, function(err, result){
    assert.ok(!err);
    assert.ok(Array.isArray(result));
    assert.ok(result.length === 0);
    finish();
  });
}

module.exports.testGetFormWorksAllForms = function(finish){
  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result);
    assert.equal(2, result.length);

    checkAllForms(result[0], {"name": "Test Form 1", "description" : "This is a test form 1."});
    checkAllForms(result[1], {"name": "Test Form 2", "description" : "This is a test form 2."});


    finish();
  });
};

/**
 * Testing the scenario where a data source has been updated, the forms list should include a lastDataRefresh field.
 * This will allow clients to determine if the form has been updated or not.
 * @param finish
 */
module.exports.testGetFormsDataSourceUpdated = function (finish) {
  var testForm = simpleForm.getBaseForm()
  var testDropdownField = _.clone(handyFieldData.dropdownFieldData);

  testForm.pages[0].fields[0] = testDropdownField;

  var firstRefreshTime, secondRefreshTime;

  var testDataSource = _.clone(dataSource);
  var testCacheOptions = [
    {
      label: "Option 1",
      checked: false
    },
    {
      label: "Option 2",
      checked: false
    },
    {
      label: "Option 3",
      checked: true
    }
  ];

  var updatedCacheOptions = [
    {
      label: "Changed Option 1",
      checked: false
    },
    {
      label: "Changed Option 2",
      checked: true
    }
  ];

  async.waterfall([
    cleanUp,
    function createDataSource(cb) {
      console.log("Creating Data Source");
      forms.dataSources.create(options, testDataSource, function (err, createdDataSource) {
        assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

        assert.ok(createdDataSource._id, "Expected A Data Source ID");

        cb(undefined, createdDataSource);
      });
    },
    function createForm(createdDataSource, cb) {
      forms.updateForm(options, testForm, function (err, createdForm) {
        assert.ok(!err, "Expected No Error When Creating A New Form " + util.inspect(err));

        return cb(undefined, createdDataSource, createdForm);
      });
    },
    function getFormsNoDataSources(createdDataSource, createdForm, cb){
      //If there is no data source associated with the form, then the lastDataRefresh should be the same as the lastUpdated field.

      forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, response){
        assert.ok(!err, "Expected No Error " + util.inspect(err));

        //There should only be one form
        assert.equal(response.length, 1);

        var formMeta = response[0];



        assert.equal(new Date(formMeta.lastUpdated).getTime(), new Date(formMeta.lastDataRefresh).getTime());
        cb(undefined, createdDataSource, createdForm);
      });
    },
    function updateDataSourceCache(createdDataSource, createdForm, cb){
      var testCacheData = {
        _id: createdDataSource._id,
        data: {
          fieldType: "singleChoice",
          options: testCacheOptions
        }
      };

      forms.dataSources.updateCache(options, [testCacheData], function(err, updateResult){
        assert.ok(!err, "Expected No Error When Updating Data Cache ", + err);

        firstRefreshTime = updateResult.validDataSourceUpdates[0].lastRefreshed;

        setTimeout(function(){
          return cb(undefined, createdDataSource, createdForm);
        }, 1000);
      });
    },
    function addDataSourceToField(createdDataSource, createdForm, cb){
      createdForm.pages[0].fields[0].dataSourceType = "dataSource";
      createdForm.pages[0].fields[0].dataSource = createdDataSource._id;

      //Updating The Form
      forms.updateForm(options, createdForm, function(err, updatedForm){
        assert.ok(!err, "Expected no error when updating a form " + util.inspect(err));

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function checkUpdatedDataTimestamp(createdDataSource, updatedForm, cb){
      //The form meta should now have the updated last data update field

      forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, response){
        assert.ok(!err, "Expected No Error " + util.inspect(err));

        //There should only be one form
        assert.equal(response.length, 1);

        var formMeta = response[0];

        assert.equal(new Date(formMeta.lastUpdated).getTime(), new Date(formMeta.lastDataRefresh).getTime());
        cb(undefined, createdDataSource, updatedForm);
      });
    },
    function updateCacheAgain(createdDataSource, updatedForm, cb){
      var testCacheData = {
        _id: createdDataSource._id,
        data: {
          fieldType: "singleChoice",
          options: updatedCacheOptions
        }
      };

      forms.dataSources.updateCache(options, [testCacheData], function(err, updateResult){
        assert.ok(!err, "Expected No Error When Updating Data Cache ", + err);

        secondRefreshTime = updateResult.validDataSourceUpdates[0].lastRefreshed;

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function checkUpdatedDataTimestamp(createdDataSource, updatedForm, cb){
      //The form meta should now have the updated again last data update field

      forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, response){
        assert.ok(!err, "Expected No Error " + util.inspect(err));

        //There should only be one form
        assert.equal(response.length, 1);

        var formMeta = response[0];

        assert.equal(new Date(secondRefreshTime).getTime(), new Date(formMeta.lastDataRefresh).getTime());
        cb(undefined, createdDataSource, updatedForm);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error " + util.inspect(err));
    finish();
  });

};

function checkAllForms(formToCheck, options){
  checkForm(formToCheck, options);
  assert.ok(formToCheck.lastUpdated);
  assert.ok(formToCheck.appsUsingForm !== undefined);
  assert.ok(formToCheck.submissionsToday !== undefined);
  assert.ok(formToCheck.submissionsTotal !== undefined);
}

function checkForm(form, options){
  assert.ok(form);
  assert.equal(form.name, options.name, "Expected " + options.name + " got " + form.name);
  assert.ok(form._id);
  assert.equal(form.description, options.description, "Expected " + options.description + " got " + form.description);
  assert.ok(form.lastUpdated);
  assert.ok(form.lastUpdatedTimestamp);
}

function createTestData(assert, cb){

  //Set up the connection
  models.init(connection);

  Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

  var form1 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  //Save the forms
  async.series([function(cb){
    form1.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }, function(cb){
    form2.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }], function(err){
    assert.ok(!err);

    console.log("Forms Saved");
    //Now save the forms with the appId
    var appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);

      cb();
    });
  });
};