require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "123456789";

var output = {
  "updatedBy":"test@example.com",
  "name":"Test Form 1",
  "description":"This is a test form 1.",
  "_id":"527b9101892f01072500000b",
  "pageRules":[
    {
      "targetPage":"527b9101892f010725000012",
      "sourceField":"527b9101892f01072500000d",
      "type":"skip",
      "restriction":"contains",
      "sourceValue":"None",
      "_id":"527b9102892f010725000014"
    }
  ],
  "fieldRules":[
    {
      "targetField":"527b9101892f01072500000f",
      "sourceField":"527b9101892f01072500000d",
      "type":"hide",
      "restriction":"contains",
      "sourceValue":"asd",
      "_id":"527b9101892f010725000013"
    }
  ],
  "pages":[
    {
      "name":"page1",
      "description":"Page1 Description",
      "_id":"527b9101892f010725000012",
      "fields":[
        {
          "label":"field1",
          "helpText":"field1 Help Text",
          "type":"text",
          "required":true,
          "_id":"527b9101892f01072500000d",
          "fieldOptions":[
            {
              "key":"someNiceKey",
              "val":"someNiceVal"
            }
          ],
          "repeating":false
        },
        {
          "label":"field2",
          "helpText":"field2 Help Text",
          "type":"textarea",
          "required":false,
          "_id":"527b9101892f01072500000f",
          "fieldOptions":[
            {
              "key":"someNiceKey",
              "val":"someNiceVal"
            },
            {
              "key":"someNiceKey2",
              "val":"someNiceVal2"
            }
          ],
          "repeating":true
        }
      ]
    }
  ],
  "lastUpdated":"2013-11-07T13:09:21.967Z",
  "dateCreated":"2013-11-07T13:09:21.965Z"
};

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      test.finish();
    });
  });
}

module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testGetFormWorksSinglePage = function(test, assert){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);
    assert.isDefined(result);

    forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "formId" : result.forms[0].formId}, function(err, result){
      assert.ok(!err);
      assert.isDefined(result);

      console.log("Test Finished");
      test.finish();
    });
  });
};


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

  var form1 = new Form({"updatedBy": "test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  var field1 = new Field({"label": "field1", "helpText": "field1 Help Text", "type": "text", "repeating": false, "fieldOptions": [{"key": "someNiceKey", "val": "someNiceVal"}], "required": true});
  var field2 = new Field({"label": "field2", "helpText": "field2 Help Text", "type": "textarea", "repeating": true, "fieldOptions": [{"key": "someNiceKey", "val": "someNiceVal"}, {"key": "someNiceKey2", "val": "someNiceVal2"}], "required": false});

  var page1 = new Page({"name" : "page1", "description" : "Page1 Description"});

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
    }], function(err){
      assert.ok(!err);
      console.log("Fields Saved");
      cb(err);
    });
  }

  function savePages(cb){

    //Add fields to the page
    page1.fields.push(field1);
    page1.fields.push(field2);

    page1.save(function(err){
      assert.ok(!err);
      console.log("Pages Saved");
      cb(err);
    });
  }

  function saveFieldRules(cb){
    fieldRule1 = new FieldRule({"type": "hide", "restriction": "contains", "sourceValue": "asd"});

    fieldRule1.sourceField = field1;
    fieldRule1.targetField = field2;

    fieldRule1.save(function(err){
      assert.ok(!err);
      console.log("FieldRule Saved");
      cb(err);
    });
  }

  function savePageRules(cb){
    pageRule1 = new PageRule({"type": "skip", "restriction": "contains", "sourceValue": "None"});

    pageRule1.sourceField = field1;
    pageRule1.targetPage = page1;

    pageRule1.save(function(err){
      assert.ok(!err);
      console.log("PageRule Saved");
      cb(err);
    });
  }

  function saveForm(cb){
    //Save the forms

    form1.pages.push(page1);
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
      console.log("Forms Saved");
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
      console.log("Appform Saved");
      cb(err);
    });
  }
}