require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;

var assert = require('assert');

function assertEqual(actual, expected, message) {
  var msg = message || "actual not expected: "
  assert.strictEqual(actual, expected, msg + ", actual: " + util.inspect(actual) + ", expected: " + util.inspect(expected));
}

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;
var formModel;
var fieldModel;

var TEST_PAGE_NAME1 = 'page1 with fields to be updated';
var TEST_PAGE_DESCRIPTION1 = 'this is page 1';
var TEST_PAGE_NAME2 = 'page2 with fields to be updated';
var TEST_PAGE_DESCRIPTION2 = 'this is page 2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2];

var TEST_INITIAL_FIELD2_HELPTEXT = 'this is the initial helptext';
var TEST_UPDATED_FIELD2_HELPTEXT  = 'this is the updated helptext';

var TEST_FORM_2_PAGES_WITH_FIELDS = {
    "name": "Simple Form with 2 pages with 2 fields each",
    "description": "This is my form. it will have fields updated",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [{
      name: TEST_PAGE_NAME1,
      description: TEST_PAGE_DESCRIPTION1,
      "fields": [
        {
           "name":"field_p1_f1",
           "helpText":"This is a text field",
           "type":"text",
           "required":false,
           "fieldOptions":{
              validation: {
                 "min":20,
                 "max":100
              },
              definition: {
                 "maxRepeat":5,
                 "minRepeat":2
              }
           },
           "repeating":true
        },
        {
           "name":"field_p1_f2",
           "helpText": TEST_INITIAL_FIELD2_HELPTEXT,
           "type":"textarea",
           "required":false,
           "fieldOptions":{
              validation: {
                 "min":50,
                 "max":100
              },
              definition: {
                 "maxRepeat":5,
                 "minRepeat":3
              }
           },
           "repeating":true
        }
      ]
    }, {
      name: TEST_PAGE_NAME2,
      description: TEST_PAGE_DESCRIPTION2,
      "fields": [
        {
           "name":"field_p2_f1",
           "helpText":"This is a text field on page2",
           "type":"text",
           "required":false,
           "fieldOptions": {
              validation: {
                 "min":20,
                 "max":100
              },
              definition: {
                 "maxRepeat":5,
                 "minRepeat":2
              }
           },
           "repeating":true
        },
        {
           "name":"field_p2_f2",
           "helpText":"This is a text area field on page2",
           "type":"textarea",
           "required":false,
           "fieldOptions":{
              validation: {
                 "min":50,
                 "max":100
              },
              definition: {
                 "maxRepeat":5,
                 "minRepeat":3
              }
           },
           "repeating":true
        }
      ]
    }],
    "fieldRules": [],
    "pageRules": []
};

var TEST_NEW_PAGE_TO_ADD = {
  name: TEST_PAGE_NAME2,
  description: TEST_PAGE_DESCRIPTION2,
  "fields": [
    {
       "name":"field_p3_f1",
       "helpText":"This is a text field on new page",
       "type":"text",
       "required":false,
       "fieldOptions":{
          validation: {
             "min":20,
             "max":100
          }
       },
       "repeating":true
    }
  ]
};

var TEST_PAGE1_NEW_FIELD = {
  "name":"field_p1_newField",
  "helpText":"This is a new text field",
  "type":"text",
  "required":false,
  "fieldOptions": {
    validation: {
      "min":20,
      "max":100
    },
    definition: {
      "maxRepeat":5,
      "minRepeat":2
    }
  },
  "repeating":true
};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    finish();
  });
};

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

function assertFormNamedNotFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.equal(data, null, msg + util.inspect(data));
    cb();
  });
}

function assertFormNamedFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.ok(data, msg + util.inspect(data));
    cb();
  });
}

module.exports.testUpdateFormWithPagesWithFields = function(finish) {
  var saveDeletedFieldId; 
  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");  
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function(err, updatedForm){
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });

      });
    },
    function(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assertEqual(populatedFormDoc.pages.length, TEST_PAGE_NAMES.length, 'Incorrect number of pages in created form');
      
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[0].name);
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[1].name);

      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');

      function checkFields(actualFieldsPage1, expectedFieldsPage1) {
        var actualFieldsLen = actualFieldsPage1.length;
        var expectedFieldsLen = expectedFieldsPage1.length;
        assertEqual(actualFieldsLen, expectedFieldsLen, "Incorrect number of fields");
        for (var i = 0; i < actualFieldsPage1.length; i += 1) {
          assertEqual(actualFieldsPage1[i].name, expectedFieldsPage1[i].name);
        }        
      }

      for(var i = 0; i < TEST_FORM_2_PAGES_WITH_FIELDS.pages.length; i += 1) {
        checkFields(populatedFormDoc.pages[i].fields, TEST_FORM_2_PAGES_WITH_FIELDS.pages[i].fields);
      }

      populatedFormDoc.pages[0].fields[1].helpText = TEST_UPDATED_FIELD2_HELPTEXT;
      saveDeletedFieldId = populatedFormDoc.pages[0].fields[0]._id;  // save this to verify it's not deleted from database
      populatedFormDoc.pages[0].fields.splice(0, 1);  // delete field1
      populatedFormDoc.pages[0].fields.push(TEST_PAGE1_NEW_FIELD);

      populatedFormDoc.pages.push(TEST_NEW_PAGE_TO_ADD);

      var allFields = populatedFormDoc.pages[0].fields.concat(populatedFormDoc.pages[1].fields);
      forms.updateForm(options, populatedFormDoc, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        return cb(err, populatedFormDoc);
      });

    },

    function(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assertEqual(populatedFormDoc.pages.length, TEST_PAGE_NAMES.length + 1, 'Incorrect number of pages in created form');  // have add a new page
      
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[0].name);
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[1].name);

      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');

      function checkFields(actualFieldsPage1, expectedFieldsPage1) {
        var actualFieldsLen = actualFieldsPage1.length;
        var expectedFieldsLen = expectedFieldsPage1.length;
        assertEqual(actualFieldsLen, expectedFieldsLen, "Incorrect number of fields");
        for (var i = 0; i < actualFieldsPage1.length; i += 1) {
          assertEqual(actualFieldsPage1[i].name, expectedFieldsPage1[i].name);
        }        
      }

      assertEqual(populatedFormDoc.pages[0].fields[0].name, TEST_FORM_2_PAGES_WITH_FIELDS.pages[0].fields[1].name, "new field1 should match initial field2");
      assertEqual(populatedFormDoc.pages[0].fields[0].helpText, TEST_UPDATED_FIELD2_HELPTEXT, "helpText field should have been updated");
      assertEqual(populatedFormDoc.pages[0].fields[1].name, TEST_PAGE1_NEW_FIELD.name, "new field should have been added");

      fieldModel.findById(saveDeletedFieldId, function (err, data) {
        assert.ok(!err, 'should not return error: ' + util.inspect(err));
        assert.ok(data, "unreferenced field should still exist in database" + util.inspect(data));
        return cb(err);
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

