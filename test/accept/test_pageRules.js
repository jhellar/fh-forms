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
var pageModel;

var TEST_PAGE_NAME1 = 'page1 with fields to be updated';
var TEST_PAGE_DESCRIPTION1 = 'this is page 1';
var TEST_PAGE_NAME2 = 'page2 with fields to be updated';
var TEST_PAGE_DESCRIPTION2 = 'this is page 2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2];

var TEST_INITIAL_FIELD2_HELPTEXT = 'this is the initial helptext';
var TEST_UPDATED_FIELD2_HELPTEXT  = 'this is the updated helptext';

var TEST_FORM_2_PAGES_WITH_FIELDS_AND_PAGE_RULES = {
    "name": "Simple Form with 2 pages with 2 fields each and field rules",
    "description": "This is my form. it will have field rules updated",
    "lastUpdated": "2013-11-18 06:13:52",
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
           "helpText": TEST_INITIAL_FIELD2_HELPTEXT,
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

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    pageModel = models.get(connection, models.MODELNAMES.PAGE);
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

module.exports.it_should_save_page_rules = function(finish) {

  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS_AND_PAGE_RULES.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS_AND_PAGE_RULES, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS_AND_PAGE_RULES.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');

        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function(err, updatedForm){
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function addPageRule(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [{
          sourceField: populatedFormDoc.pages[0].fields[0]._id,
          restriction: 'does not contain',
          sourceValue: 'dammit'
        }],
        targetPage: populatedFormDoc.pages[0]._id
      };

      forms.updatePageRules(options, {formId: populatedFormDoc._id, rules: [pageRule]}, function(err, frs){
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS_AND_PAGE_RULES.name}).populate('pages').populate('pageRules').exec(function (err, data) {
          return cb(err, data);
        });
      });
    },

    function updatePageRule(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assert.equal(populatedFormDoc.pageRules.length, 1, 'pageRule not saved');

      var prules = populatedFormDoc.pageRules;
      prules[0].ruleConditionalStatements[0].sourceValue = 'dammit2';
      forms.updatePageRules(options, {formId: populatedFormDoc._id, rules: prules}, function(err, prs){
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));
        assert.equal(prs[0].ruleConditionalStatements[0].sourceValue, 'dammit2', 'pageRule not updated correctly, got: ', prs[0].ruleConditionalStatements[0].sourceValue);
        cb(null, populatedFormDoc);
      });
    },

    function deletePageRule(populatedFormDoc, cb) {
      forms.updatePageRules(options, {formId: populatedFormDoc._id, rules: []}, function(err, prs){
        assert.ok(!err, 'testUpdateForm() - error from updatePageules: ' + util.inspect(err));
        assert.equal(prs.length, 0);
        cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

