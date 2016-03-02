require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var appId = "123456789";
var assert = require('assert');
var util = require('util');
var simpleForm = require('../Fixtures/simple.js');
var dataSource = require('../Fixtures/dataSource.js');
var handyFieldData = require('../Fixtures/formSubmissions.js');
var _ = require('underscore');
var cleanUp = require('../Fixtures/cleanup.js');
var DataSource;
var ERROR_CODES = models.CONSTANTS.ERROR_CODES;
var logger = require('../../lib/common/logger').getLogger();


module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    cleanUp(finish);
  });
};

module.exports.testGetFormWorksSinglePage = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);
    assert.ok(result);

    forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : result[0]._id}, function(err, result){
      if(err) console.log(err);
      assert.ok(!err, util.inspect(err));
      assert.ok(result);
      assert.ok(result.lastUpdatedTimestamp);
      assert.ok(Date.parse(result.lastUpdatedTimestamp).toString().indexOf("Invalid") === -1);

      //Checking that admin fields are not returned
      assert.ok(result.pages[0].fields.length === 2);

      finish();
    });
  });
};

module.exports.testExportFormWorks = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);
    assert.ok(result);

    forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : result[0]._id,"export":true}, function(err, result){
      if(err) console.log(err);
      assert.ok(!err, util.inspect(err));
      assert.ok(result);
      assert.ok(undefined === result.pages[0]._id);
      assert.ok(undefined === result._id);
      assert.ok(undefined === result.pages[0].fields[0]._id);
      finish();
    });
  });
};

module.exports.testGetFormWorksAllForms = function(finish){
  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);
    assert.equal(2, result.length);
    finish();
  });
};

module.exports.testGetFormWorksArrayOfFormIds = function(finish){
  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    var formIdArray = [];

    formIdArray[0] = result[0]._id;
    formIdArray[1] = result[1]._id;

    forms.getPopulatedFormList({"uri": process.env.FH_DOMAIN_DB_CONN_URL, formids: formIdArray}, function(err, result){
      assert.ok(!err, util.inspect(err));
      assert.ok(result);
      assert.equal(2, result.length);
      checkForm(result[0], {"name": "Test Form 1", "description": "This is a test form 1."});
      checkForm(result[1], {"name": "Test Form 2", "description": "This is a test form 2."});
      finish();
    });
  });
};

module.exports.testgetPopulatedFormListFails = function(finish){
  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){

    forms.getPopulatedFormList({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
      assert.ok(err, util.inspect(err));
      finish();
    });
  });
};

/**
 * Testing the scenario where a form field references a data source. The data for the data source should be merged into the field at getForm time.
 *
 * @param finish
 */
module.exports.testGetFormIncludingDataSourceData = function(finish){
  var testForm = simpleForm.getBaseForm();
  var testDropdownField = _.clone(handyFieldData.dropdownFieldData);

  testForm.pages[0].fields[0] =  testDropdownField;

  var testDataSource = _.clone(dataSource);
  var testCacheOptions = [
    {
      key: "op1",
      value: 'Option 1',
      selected: false
    },
    {
      key: "op2",
      value: 'Option 2',
      selected: false
    },
    {
      key: "op3",
      value: 'Option 3',
      selected: true
    }
  ];

  var expectedTestCacheOptions = [
    {
      key: "op1",
      label: 'Option 1',
      checked: false
    },
    {
      key: "op2",
      label: 'Option 2',
      checked: false
    },
    {
      key: "op3",
      label: 'Option 3',
      checked: true
    }
  ];

  var updatedCacheOptions = [
    {
      key: "op1",
      value: 'Changed Option 1',
      selected: false
    },
    {
      key: "op2",
      value: 'Changed Option 2',
      selected: true
    }
  ];

  var expectedUpdatedCacheOptions = [
    {
      key: "op1",
      label: 'Changed Option 1',
      checked: false
    },
    {
      key: "op2",
      label: 'Changed Option 2',
      checked: true
    }
  ];


  async.waterfall([
    function createDataSource(cb){
      forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
        assert.ok(!err, "Unexpected Error: dataSource.create" + util.inspect(err));

        assert.ok(createdDataSource._id, "Expected A Data Source ID");

        cb(undefined, createdDataSource);
      });
    },
    function createForm(createdDataSource, cb){
      forms.updateForm(options, testForm, function(err, createdForm){
        assert.ok(!err, "Expected No Error When Creating A New Form " + util.inspect(err));

        return cb(undefined, createdDataSource, createdForm);
      });
    },
    function getStaticForm(createdDataSource, createdForm, cb){
      //If a form definition is not sourced from a data source, the static data should be returned

      var getFormOptions = _.clone(options);


      //This option will include form data sources in the response. useful for supercore forms CRUD operations.
      //The $fh.forms cloud API should not have access to the data source IDs that populate the form. -- just the data that it was populated with
      getFormOptions.includeDataSources = true;

      //Getting a form definition will ignore any fields with data source cache data by default and return an error if data source cache does not exist.
      //This parameter stops this from happening. Useful for core forms operations that contain data sources with no cache set.
      getFormOptions.expectDataSourceCache = false;

      getFormOptions._id = createdForm._id;

      forms.getForm(getFormOptions, function(err, returnedForm){
        assert.ok(!err, "Expected No Error When Getting A Form");

        //The Form Data Sources Field Is Returned
        assert.ok(_.isEqual(returnedForm.dataSources, {
            formDataSources: []
        }), "Expected No Form Data Sources");

        var formDropdownField = returnedForm.pages[0].fields[0];

        assert.equal(formDropdownField.dataSourceType, "static");

        return cb(undefined, createdDataSource, createdForm);
      });
    },
    function assignDataSourceToField( createdDataSource, createdForm, cb){

      //Assigning THe Data Source To THe Field
      createdForm.pages[0].fields[0].dataSourceType = "dataSource";
      createdForm.pages[0].fields[0].dataSource = createdDataSource._id;

      //Updating The Form
      forms.updateForm(options, createdForm, function(err, updatedForm){
        assert.ok(!err, "Expected no error when updating a form " + util.inspect(err));

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function getDataSourceFormNoCache(createdDataSource, updatedForm, cb){
      var getFormOptions = _.clone(options);

      getFormOptions.includeDataSources = true;

      //Not expecting Any cache
      getFormOptions.expectDataSourceCache = false;

      getFormOptions._id = updatedForm._id;

      forms.getForm(getFormOptions, function(err, returnedForm){
        assert.ok(!err, "Expected No Error When Getting A Form " + util.inspect(err));

        //The Form Data Sources Field Is Returned
        assert.ok(_.isEqual(returnedForm.dataSources, {
          formDataSources: [{
            _id: createdDataSource._id,
            name: createdDataSource.name,
            lastUpdated: createdDataSource.lastUpdated,
            createdBy: createdDataSource.createdBy,
            updatedBy: createdDataSource.updatedBy
          }]
        }), "Expected One Form Data Source");

        var formDropdownField = returnedForm.pages[0].fields[0];

        //The field should have data source information.
        assert.equal(formDropdownField.dataSourceType, "dataSource");
        assert.equal(formDropdownField.dataSource.toString(), createdDataSource._id.toString());

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function getDataSourceFormNoDataSourceInfo(createdDataSource, updatedForm, cb){
      var getFormOptions = _.clone(options);

      getFormOptions.includeDataSources = false;

      //Not expecting Any cache
      getFormOptions.expectDataSourceCache = false;

      getFormOptions._id = updatedForm._id;

      forms.getForm(getFormOptions, function(err, returnedForm){
        assert.ok(!err, "Expected No Error When Getting A Form " + util.inspect(err));

        //The Form Data Sources Field Is Returned
        assert.ok(_.isEqual(returnedForm.dataSources, undefined), "Expected No Data Source Information");

        var formDropdownField = returnedForm.pages[0].fields[0];

        //The field should have no data source information.
        assert.equal(formDropdownField.dataSourceType, undefined);
        assert.equal(formDropdownField.dataSource, undefined);

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function getDataSourceFormCacheExpectedNoCache(createdDataSource, updatedForm, cb){
      var getFormOptions = _.clone(options);

      getFormOptions.includeDataSources = false;

      //Not expecting Any cache
      getFormOptions.expectDataSourceCache = true;

      getFormOptions._id = updatedForm._id;

      //If the data source has no cache, then the form should not return as at least one of the fields will not contain data.
      forms.getForm(getFormOptions, function(err){
        assert.ok(err, "Expected An Error When Getting A Form With Data Source Data That Does Not Exist");
        assert.ok(err.userDetail.indexOf("No Field Data Available") > -1);
        assert.equal(err.code, ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR);

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function updateDataSourceCache(createdDataSource, updatedForm, cb){
      var testCacheData = {
        _id: createdDataSource._id,
        data: testCacheOptions
      };

      forms.dataSources.updateCache(options, [testCacheData], {
        currentTime: new Date()
      }, function(err, updateResult){
        assert.ok(!err, "Expected No Error When Updating Data Cache " + util.inspect(err), util.inspect(updateResult));

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function getDataSourceFormCacheExpected(createdDataSource, updatedForm, cb){
      var getFormOptions = _.clone(options);

      getFormOptions.includeDataSources = false;

      //Not expecting Any cache
      getFormOptions.expectDataSourceCache = true;

      getFormOptions._id = updatedForm._id;

      forms.getForm(getFormOptions, function(err, returnedForm){
        assert.ok(!err, "Expected No Error When Getting Form " + util.inspect(err));

        logger.debug("gotForm ", returnedForm);

        //The Form Data Sources Field Is Returned
        assert.ok(_.isEqual(returnedForm.dataSources, undefined), "Expected No Data Source Information");

        var formDropdownField = returnedForm.pages[0].fields[0];

        //The field should have no data source information.
        assert.equal(formDropdownField.dataSourceType, undefined);
        assert.equal(formDropdownField.dataSource, undefined);

        //The field should have data associated with the data source
        _.each(expectedTestCacheOptions, function(cacheOption, index){
          logger.debug("testCacheOptions ", cacheOption, formDropdownField);
          assert.ok(_.isEqual(JSON.stringify(cacheOption), JSON.stringify(formDropdownField.fieldOptions.definition.options[index])));
        });

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function updateCacheAgain(createdDataSource, updatedForm, cb){
      var testCacheData = {
        _id: createdDataSource._id,
        data: updatedCacheOptions
      };

      forms.dataSources.updateCache(options, [testCacheData], {
        currentTime: new Date()
      }, function(err, updateResult){
        assert.ok(!err, "Expected No Error When Updating Data Cache ", + err);

        logger.debug("updateResult ", updateResult);

        return cb(undefined, createdDataSource, updatedForm);
      });
    },
    function getDataSourceFormUpdatedCacheExpected(createdDataSource, updatedForm, cb){
      var getFormOptions = _.clone(options);

      getFormOptions.includeDataSources = false;

      //Not expecting Any cache
      getFormOptions.expectDataSourceCache = true;

      getFormOptions._id = updatedForm._id;

      forms.getForm(getFormOptions, function(err, returnedForm){
        assert.ok(!err, "Expected No Error When Getting Form " + err);

        //The Form Data Sources Field Is Returned
        assert.ok(_.isEqual(returnedForm.dataSources, undefined), "Expected No Data Source Information");

        var formDropdownField = returnedForm.pages[0].fields[0];

        //The field should have no data source information.
        assert.equal(formDropdownField.dataSourceType, undefined);
        assert.equal(formDropdownField.dataSource, undefined);

        //The field should have data associated with the data source
        _.each(expectedUpdatedCacheOptions, function(cacheOption, index){
          assert.ok(_.isEqual(JSON.stringify(cacheOption), JSON.stringify(formDropdownField.fieldOptions.definition.options[index])));
        });
        return cb(undefined, createdDataSource, updatedForm);
      });
    }
  ], function (err){
    assert.ok(!err, "Expected No Error");
    finish();
  });
};

function checkForm(form, options){
  assert.ok(form);
  assert.equal(form.name, options.name, "Expected " + options.name + " got " + form.name);
  assert.ok(form._id);
  assert.equal(form.description, options.description, "Expected " + options.description + " got " + form.description);
}

//Adding data needed for the test
function createTestData(assert, cb){
  //Add a form to the database.

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);
  var FieldRule = models.get(connection, models.MODELNAMES.FIELD_RULE);
  var PageRule = models.get(connection, models.MODELNAMES.PAGE_RULE);


  var appForm1;

  var form1 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  var field1 = new Field({
    "name":"field1",
    "helpText":"field1 Help Text",
    "type":"text",
    "repeating":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    },
    "required":true
  });
  var field2 = new Field({
    "name":"field2",
    "helpText":"field2 Help Text",
    "type":"textarea",
    "repeating":true,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    },
    "required":false
  });

  var field3 = new Field({
    "name":"field3Admin",
    "helpText":"field3 Admin Text",
    "type":"textarea",
    "repeating":true,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    },
    "required":false,
    "adminOnly": true
  });

  var page1 = new Page({"name" : "page1", "description" : "Page1 Description"});
  var page2 = new Page({"name" : "page2", "description" : "Page2 Description"});

  var fieldRule1;
  var pageRule1;


  async.series([saveFields, savePages, saveFieldRules, savePageRules, saveForm, saveAppForm], function(err){
    connection.close(function(err){
      if(err) console.log(err);
      cb(err);
    });
  });

  function saveFields(cb){
    async.series([function(cb){
      field1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }, function(cb){
      field2.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    },function(cb){
      field3.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      cb(err);
    });
  }

  function savePages(cb){

    //Add fields to the page
    page1.fields.push(field1);
    page1.fields.push(field2);
    page1.fields.push(field3);

    page2.fields.push(field1);
    page2.fields.push(field2);

    page1.save(function(err){
      assert.ok(!err);

      page2.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    });
  }

  function saveFieldRules(cb){

    var ruleData = {
      "type": "hide",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": field1._id,
        "restriction": "contains",
        "sourceValue": "asd"
      }]
    };

    fieldRule1 = new FieldRule(ruleData);

    fieldRule1.targetField = field2;

    fieldRule1.save(function(err){
      assert.ok(!err);
      cb(err);
    });
  }

  function savePageRules(cb){

    var ruleData = {
      "type": "skip",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": field1._id,
        "restriction": "contains",
        "sourceValue": "None"
      }]
    };

    pageRule1 = new PageRule(ruleData);
    pageRule1.targetPage = page1;

    pageRule1.save(function(err){
      assert.ok(!err);
      cb(err);
    });
  }

  function saveForm(cb){
    //Save the forms

    form1.pages.push(page1);
    form2.pages.push(page1);
    form1.fieldRules.push(fieldRule1);
    form1.pageRules.push(pageRule1);

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
      cb(err);
    });
  }

  function saveAppForm(cb){
    appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      cb(err);
    });
  }
}
