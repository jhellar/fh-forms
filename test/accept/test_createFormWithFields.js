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

var TEST_PAGE_NAME1 = 'page1 with fields';
var TEST_PAGE_DESCRIPTION1 = 'this is page 1';
var TEST_PAGE_NAME2 = 'page2 with fields';
var TEST_PAGE_DESCRIPTION2 = 'this is page 2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2];
var TEST_FORM_2_PAGES_WITH_FIELDS = {
    "name": "Simple Form with 2 pages with 2 fields each",
    "description": "This is my form.",
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
           "fieldOptions":[
              {
                 "min":20,
                 "max":100
              },
              {
                 "maxRepeat":5
              },
              {
                 "minRepeat":2
              }
           ],
           "repeating":true
        },
        {
           "name":"field_p1_f2",
           "helpText":"This is a text area field",
           "type":"textarea",
           "required":false,
           "fieldOptions":[
              {
                 "min":50,
                 "max":100
              },
              {
                 "maxRepeat":5
              },
              {
                 "minRepeat":3
              }
           ],
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
           "fieldOptions":[
              {
                 "min":20,
                 "max":100
              },
              {
                 "maxRepeat":5
              },
              {
                 "minRepeat":2
              }
           ],
           "repeating":true
        },
        {
           "name":"field_p2_f2",
           "helpText":"This is a text area field on page2",
           "type":"textarea",
           "required":false,
           "fieldOptions":[
              {
                 "min":50,
                 "max":100
              },
              {
                 "maxRepeat":5
              },
              {
                 "minRepeat":3
              }
           ],
           "repeating":true
        }
      ]
    }],
    "fieldRules": [],
    "pageRules": []
};

var TEST_PAGE1_NEW_FIELD = {
  "name":"field_p1_newField",
  "helpText":"This is a new text field",
  "type":"text",
  "required":false,
  "fieldOptions":[
    {
      "min":20,
      "max":100
    },
    {
      "maxRepeat":5
    },
    {
      "minRepeat":2
    }
  ],
  "repeating":true
};

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    pageModel = models.get(connection, models.MODELNAMES.PAGE);
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

module.exports.testAddFormWithPagesWithFields = function(finish) {
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
        assert.ok(data,'should have found form data');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "new description should ahve been added");
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
      function checkFields(actualFields, expectedFields) {
        var actualFieldsLen = actualFields.length;
        var expectedFieldsLen = expectedFields.length;
        assertEqual(actualFieldsLen, expectedFieldsLen, "Incorrect number of fields");
        for (var i = 0; i < actualFields.length; i += 1) {
          assertEqual(actualFields[i].name, expectedFields[i].name);
        }        
      }

      for(var i = 0; i < TEST_FORM_2_PAGES_WITH_FIELDS.pages.length; i += 1) {
        checkFields(populatedFormDoc.pages[i].fields, TEST_FORM_2_PAGES_WITH_FIELDS.pages[i].fields);
      }

      return cb();
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};
