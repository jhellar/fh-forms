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

var TEST_FORM_2_PAGES_WITH_FIELDS_AND_FIELD_RULES = {
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

function loadForm(data, cb) {
  if (!cb) cb = data;
  formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS_AND_FIELD_RULES.name}).populate('pages').populate('fieldRules').exec(function (err, data) {
    assert.ok(!err, 'should have found form');

    //Now populate the fields in each page
    formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function(err, updatedForm){
      assert.ok(!err, "Error getting fields for form");
      return cb(undefined, updatedForm.toJSON());
    });
  });
};

module.exports.it_should_save_field_rules = function(finish) {

  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS_AND_FIELD_RULES.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS_AND_FIELD_RULES, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    loadForm,
    function addFieldRule(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [{
          sourceField: populatedFormDoc.pages[0].fields[0]._id,
          restriction: 'does not contain',
          sourceValue: 'dammit'
        }],
        targetField: populatedFormDoc.pages[0].fields[0]._id
      };

      var fieldRule2 = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [{
          sourceField: populatedFormDoc.pages[0].fields[1]._id,
          restriction: 'does not contain',
          sourceValue: 'foo'
        }],
        targetField: populatedFormDoc.pages[0].fields[1]._id
      };

      forms.updateFieldRules(options, {formId: populatedFormDoc._id, rules: [fieldRule, fieldRule2]}, function(err, frs){
        assert.ok(!err, 'testUpdateForm() - error from updateFieldRules: ' + util.inspect(err));
        return cb();
      });
    },
    loadForm,
    function updateFieldRule(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assert.equal(populatedFormDoc.fieldRules.length, 2, 'fieldRule not saved');

      var frules = populatedFormDoc.fieldRules;
      frules[0].ruleConditionalStatements[0].sourceValue = 'dammit2';

      // and add another rule
      var fieldRule3 = {
        type: "show",
        ruleConditionalOperator : "and",
        ruleConditionalStatements : [{
          sourceField: populatedFormDoc.pages[0].fields[1]._id,
          restriction: 'does not contain',
          sourceValue: 'bar'
        }],
        targetField: populatedFormDoc.pages[0].fields[1]._id
      };
      frules.push(fieldRule3);

      forms.updateFieldRules(options, {formId: populatedFormDoc._id, rules: frules}, function(err, frs){
        assert.ok(!err, 'testUpdateForm() - error from updateFieldRules: ' + util.inspect(err));
        assert.equal(frs[0].ruleConditionalStatements[0].sourceValue, 'dammit2', 'fieldRule not updated correctly, got: ', frs[0].ruleConditionalStatements[0].sourceValue);
        assert.equal(frs.length, 3, 'Expected 3 rules to be saved, got: ' + util.inspect(frs));
        cb(null, populatedFormDoc);
      });
    },

    function deleteFieldRule(populatedFormDoc, cb) {
      forms.updateFieldRules(options, {formId: populatedFormDoc._id, rules: []}, function(err, frs){
        assert.ok(!err, 'testUpdateForm() - error from updateFieldRules: ' + util.inspect(err));
        assert.equal(frs.length, 0);
        cb();
      });
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

