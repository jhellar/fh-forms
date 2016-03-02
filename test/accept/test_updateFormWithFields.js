require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var _ = require('underscore');
var handyFieldData = require('../Fixtures/formSubmissions.js');
var testDataSourceData = require('../Fixtures/dataSource.js');
var testDataTargetData = require('../Fixtures/dataTarget.js');
var simpleForm = require('../Fixtures/simple.js');
var cleanUp = require('../Fixtures/cleanup.js');
var ERROR_CODES = models.CONSTANTS.ERROR_CODES;
var logger = require('../../lib/common/logger').getLogger();

var assert = require('assert');

function assertEqual(actual, expected, message) {
  var msg = message || "actual not expected: ";
  assert.strictEqual(actual, expected, msg + ", actual: " + util.inspect(actual) + ", expected: " + util.inspect(expected));
}

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;
var formModel;
var fieldModel;
var dataSourceModel, dataTargetModel, pageRuleModel, fieldRuleModel;

var TEST_PAGE_NAME1 = 'page1 with fields to be updated';
var TEST_PAGE_DESCRIPTION1 = 'this is page 1';
var TEST_PAGE_NAME2 = 'page2 with fields to be updated';
var TEST_PAGE_NAME3 = 'page3 with fields to be updated';
var TEST_PAGE_DESCRIPTION2 = 'this is page 2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2, TEST_PAGE_NAME3];

var TEST_INITIAL_FIELD2_HELPTEXT = 'this is the initial helptext';
var TEST_UPDATED_FIELD2_HELPTEXT = 'this is the updated helptext';

var TEST_FORM_2_PAGES_WITH_FIELDS = {
  "name": "Simple Form with 2 pages with 2 fields each",
  "description": "This is my form. it will have fields updated",
  "lastUpdated": "2013-10-16 06:13:52",
  "pages": [
    {
      name: TEST_PAGE_NAME1,
      description: TEST_PAGE_DESCRIPTION1,
      "fields": [
        {
          "name": "field_p1_f1",
          "helpText": "This is a text field",
          "type": "text",
          "required": false,
          "fieldOptions": {
            validation: {
              "min": 20,
              "max": 100
            },
            definition: {
              "maxRepeat": 5,
              "minRepeat": 2
            }
          },
          "repeating": true
        },
        {
          "name": "field_p1_f2",
          "helpText": TEST_INITIAL_FIELD2_HELPTEXT,
          "type": "textarea",
          "required": false,
          "fieldOptions": {
            validation: {
              "min": 50,
              "max": 100
            },
            definition: {
              "maxRepeat": 5,
              "minRepeat": 3
            }
          },
          "repeating": true
        }
      ]
    },
    {
      name: TEST_PAGE_NAME2,
      description: TEST_PAGE_DESCRIPTION2,
      "fields": [
        {
          "name": "field_p2_f1",
          "helpText": "This is a text field on page2",
          "type": "text",
          "required": false,
          "fieldOptions": {
            validation: {
              "min": 20,
              "max": 100
            },
            definition: {
              "maxRepeat": 5,
              "minRepeat": 2
            }
          },
          "repeating": true
        },
        {
          "name": "field_p2_f2",
          "helpText": "This is a text area field on page2",
          "type": "textarea",
          "required": false,
          "fieldOptions": {
            validation: {
              "min": 50,
              "max": 100
            },
            definition: {
              "maxRepeat": 5,
              "minRepeat": 3
            }
          },
          "repeating": true
        }
      ]
    },
    {
      name: TEST_PAGE_NAME3,
      description: TEST_PAGE_DESCRIPTION2,
      "fields": [
        {
          "name": "field_p2_f1",
          "helpText": "This is a text field on page2",
          "type": "text",
          "required": false,
          "fieldOptions": {
            validation: {
              "min": 20,
              "max": 100
            },
            definition: {
              "maxRepeat": 5,
              "minRepeat": 2
            }
          },
          "repeating": true
        }
      ]
    }
  ],
  "fieldRules": [],
  "pageRules": []
};

var TEST_NEW_PAGE_TO_ADD = {
  name: TEST_PAGE_NAME2,
  description: TEST_PAGE_DESCRIPTION2,
  "fields": [
    {
      "name": "field_p3_f1",
      "helpText": "This is a text field on new page",
      "type": "text",
      "required": false,
      "fieldOptions": {
        validation: {
          "min": 20,
          "max": 100
        }
      },
      "repeating": true
    }
  ]
};

var TEST_PAGE1_NEW_FIELD = {
  "name": "field_p1_newField",
  "helpText": "This is a new text field",
  "type": "text",
  "required": false,
  "fieldOptions": {
    validation: {
      "min": 20,
      "max": 100
    },
    definition: {
      "maxRepeat": 5,
      "minRepeat": 2
    }
  },
  "repeating": true
};


module.exports.setUp = function (finish) {
  initDatabase(assert, function (err) {
    assert.ok(!err);
    connection = mongoose.createConnection(process.env.FH_DOMAIN_DB_CONN_URL);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    pageRuleModel = models.get(connection, models.MODELNAMES.PAGE_RULE);
    fieldRuleModel = models.get(connection, models.MODELNAMES.FIELD_RULE);
    dataSourceModel = models.get(connection, models.MODELNAMES.DATA_SOURCE);
    dataTargetModel = models.get(connection, models.MODELNAMES.DATA_TARGET);
    finish();
  });
};

module.exports.tearDown = function (finish) {
  connection.close(function (err) {
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

module.exports.testUpdateFormWithPagesWithFields = function (finish) {
  var saveDeletedFieldId;
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS.name, 'should not have found form - not added yet - found: '),
    function (cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");

          return cb(undefined, updatedForm.toJSON());
        });

      });
    },
    function (populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assertEqual(populatedFormDoc.pages.length, TEST_PAGE_NAMES.length, 'Incorrect number of pages in created form');

      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[0].name);
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form: ' + populatedFormDoc.pages[1].name);

      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');

      assert.equal(populatedFormDoc.pages[0].name, TEST_PAGE_NAME1);
      assert.equal(populatedFormDoc.pages[1].name, TEST_PAGE_NAME2);
      assert.equal(populatedFormDoc.pages[2].name, TEST_PAGE_NAME3);

      function checkFields(actualFieldsPage1, expectedFieldsPage1) {
        var actualFieldsLen = actualFieldsPage1.length;
        var expectedFieldsLen = expectedFieldsPage1.length;
        assertEqual(actualFieldsLen, expectedFieldsLen, "Incorrect number of fields");
        for (var i = 0; i < actualFieldsPage1.length; i += 1) {
          assertEqual(actualFieldsPage1[i].name, expectedFieldsPage1[i].name);
        }
      }

      for (var i = 0; i < TEST_FORM_2_PAGES_WITH_FIELDS.pages.length; i += 1) {
        checkFields(populatedFormDoc.pages[i].fields, TEST_FORM_2_PAGES_WITH_FIELDS.pages[i].fields);
      }

      populatedFormDoc.pages[0].fields[1].helpText = TEST_UPDATED_FIELD2_HELPTEXT;
      saveDeletedFieldId = populatedFormDoc.pages[0].fields[0]._id;  // save this to verify it's not deleted from database
      populatedFormDoc.pages[0].fields.splice(0, 1);  // delete field1
      populatedFormDoc.pages[0].fields.push(TEST_PAGE1_NEW_FIELD);

      populatedFormDoc.pages.push(TEST_NEW_PAGE_TO_ADD);

      var allFields = populatedFormDoc.pages[0].fields.concat(populatedFormDoc.pages[1].fields);
      forms.updateForm(options, populatedFormDoc, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        return cb(err, populatedFormDoc);
      });

    },

    function (populatedFormDoc, cb) {
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
  ], function (err) {
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

//When deleting fields, any page/field rules associated with the field should also be deleted.
module.exports.testUpdateFormDeleteField = function (finish) {
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Add a field rule and a page rule:
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: populatedFormDoc.pages[1]._id
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: populatedFormDoc.pages[0].fields[1]._id
      };

      var fieldRule2 = {
        type: "hide",
        ruleConditionalOperator: "or",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[1]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          },
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'contains',
            sourceValue: 'arg'
          }
        ],
        targetField: populatedFormDoc.pages[1].fields[0]._id
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules = [fieldRule, fieldRule2];

      forms.updateForm(options, populatedFormDoc, function(err, updatedForm){
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var fieldRule2Id = updatedFormDefinition.fieldRules[1]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Deleting field 0 on page 1 should remove fieldRule2
      var fieldRemoved = updatedFormDefinition.pages[1].fields.splice(0, 1)[0];

      assert.ok(fieldRemoved, "Expected field removed to be defined");
      assert.ok(updatedFormDefinition.fieldRules[1].targetField.toString() === fieldRemoved._id.toString(), "Expected the target field of fieldRule2 to be " + util.inspect(fieldRemoved) + " but was " + util.inspect(fieldRule2Id));

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId, cb) {
      fieldRuleModel.findOne({"_id": fieldRule2Id}, function(err, foundFieldRules){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));

        assert.ok(foundFieldRules === null, "Expected not to find but got: " + util.inspect(foundFieldRules));
        cb(undefined, fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId);
      });
    },
    function(fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId, cb){
      // read our doc from the database again
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, "Unexpected error getting form: " + util.inspect(err));
        var formJSON = data.toJSON();
        assert.ok(formJSON.fieldRules.length === 1, "Expected 1 field rule but got " + util.inspect(formJSON.fieldRules));
        assert.ok(formJSON.fieldRules[0]._id.toString() === fieldRuleId.toString(), "Expected field rule with Id " + fieldRuleId.toString() + " but got " + formJSON.fieldRules[0]._id.toString());
        assert.ok(formJSON.pageRules.length === 1, "Expected 1 page rule but got " + util.inspect(formJSON.pageRules));
        return cb(err, fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId, cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function(formData, cb){
      //Now delete field 0 on page 0, should delete the remaining rules
      var deletedField = formData.pages[0].fields.splice(0,1);
      forms.updateForm(options, formData, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined);
      });
    },
    function(cb){
      //Verify that there are no field or page rules left
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, "Unexpected error getting form: " + util.inspect(err));
        var formJSON = data.toJSON();
        assert.ok(formJSON.fieldRules.length === 0, "Expected 0 field rules but got " + util.inspect(formJSON.fieldRules));
        assert.ok(formJSON.pageRules.length === 0, "Expected 0 page rule but got " + util.inspect(formJSON.pageRules));
        return cb(err);
      });
    },
    function(cb){
      //Check rules are deleted from the database
      pageRuleModel.find({}, function(err, pageRules){
        assert.ok(!err, "Unexpected error getting pageRuleModel: " + util.inspect(err));
        var pRArray = pageRules;
        assert.ok(pRArray.length === 0, "Expect 0 page rules but got " + util.inspect(pRArray));
        fieldRuleModel.find({}, function(err, fieldRules){
          assert.ok(!err, "Unexpected error getting fieldRuleModel: " + util.inspect(err));

          var fRArray = fieldRules;
          assert.ok(fRArray.length === 0, "Expect 0 page rules but got " + util.inspect(fRArray));
          cb();
        });
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};


/**
 * Updating a field code "fieldCode" should save the code to the database.
 * @param finish
 */
module.exports.testUpdateFieldCode = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS.name, 'should not have found form - not added yet - found: '),
    function (cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });

      });
    },
    function (populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');

      //Updating the field code of field 0 page 0
      var field = populatedFormDoc.pages[0].fields[0];

      field.fieldCode = "fieldCode1";

      //Updating form

      populatedFormDoc.pages[0].fields[0] = field;

      forms.updateForm(options, populatedFormDoc, function(err, updatedDoc){
        assert.ok(!err, "received error: " + util.inspect(err));

        assert.ok(updatedDoc);

        var field = updatedDoc.pages[0].fields[0];

        //Checking that the field code was applied.
        assert.ok(field.fieldCode === "fieldCode1");

        cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

/**
 * Updating a field code "fieldCode" with an empty string should not save the code as an empty string
 * @param finish
 */
module.exports.testUpdateFieldCodeZeroLength = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS.name, 'should not have found form - not added yet - found: '),
    function (cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });

      });
    },
    function (populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');

      //Updating the field code of field 0 page 0
      var field = populatedFormDoc.pages[0].fields[0];

      //Updating with an empty string.
      field.fieldCode = "";

      //Updating form

      populatedFormDoc.pages[0].fields[0] = field;

      forms.updateForm(options, populatedFormDoc, function(err, updatedDoc){
        assert.ok(!err, "received error: " + util.inspect(err));

        assert.ok(updatedDoc);

        var field = updatedDoc.pages[0].fields[0];

        //Checking that the field code was not applied
        assert.ok(field.fieldCode === undefined);

        cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

/**
 * Updating a field code "fieldCode" with a duplicate code should return an error
 * @param finish
 */
module.exports.testUpdateFieldCodeDuplicate = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2_PAGES_WITH_FIELDS.name, 'should not have found form - not added yet - found: '),
    function (cb) {
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });

      });
    },
    function (populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');

      //Updating the field code of field 0 page 0
      var field1 = populatedFormDoc.pages[0].fields[0];
      //Updating the field code of field 0 page 1 to the same code
      var field2 = populatedFormDoc.pages[1].fields[0];

      //Updating with an empty string.
      field1.fieldCode = "fieldCodeDuplicate";
      field2.fieldCode = "fieldCodeDuplicate";

      //Updating form

      populatedFormDoc.pages[0].fields[0] = field1;
      populatedFormDoc.pages[1].fields[0] = field2;

      forms.updateForm(options, populatedFormDoc, function(err, updatedDoc){
        assert.ok(err, "Expected an error when updating the form but got nothing.");
        //Checking for a duplicate error message
        assert.ok(err.userDetail.indexOf("Duplicate") > -1);
        cb();
      });
    }
  ], function (err) {
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

/**
* Testing that when update form is used, rules are not deleted
*
* @param finish
*/
module.exports.updateFormWithMulitpleRuleTargets = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Add a field rule and a page rule:
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: populatedFormDoc.pages[1]._id
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[0].fields[1]._id, populatedFormDoc.pages[0].fields[0]._id]
      };

      var fieldRule2 = {
        type: "hide",
        ruleConditionalOperator: "or",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[1]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          },
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'contains',
            sourceValue: 'arg'
          }
        ],
        targetField: populatedFormDoc.pages[1].fields[0]._id
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules = [fieldRule, fieldRule2];

      forms.updateForm(options, populatedFormDoc, function (err, doc) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var fieldRule2Id = updatedFormDefinition.fieldRules[1]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      assert.ok(updatedFormDefinition.fieldRules[0].targetField.length === 2);

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, undefined, fieldRuleId, fieldRule2Id, pageRuleId);
      });
    },
    function(fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId, cb){
      // read our doc from the database again
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, "Unexpected error getting form: " + util.inspect(err));
        var formJSON = data.toJSON();
        assert.ok(formJSON.fieldRules.length === 2, "Expected 2 field rules but got " + util.inspect(formJSON.fieldRules));
        assert.ok(formJSON.fieldRules[0]._id.toString() === fieldRuleId.toString(), "Expected field rule with Id " + fieldRuleId.toString() + " but got " + formJSON.fieldRules[0]._id.toString());
        assert.ok(formJSON.pageRules.length === 1, "Expected 1 page rule but got " + util.inspect(formJSON.pageRules));
        return cb(err, fieldRemoved, fieldRuleId, fieldRule2Id, pageRuleId);
      });
    }], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};

/**
* When setting any field to admin, if the rule is the target/subject of the rule, then the rule must be removed
*/
module.exports.testUpdateFormWithAdminField = function(finish){
  async.waterfall([
    function (cb) {
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Add a field rule and a page rule:
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[1]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: populatedFormDoc.pages[1]._id
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: populatedFormDoc.pages[1].fields[0]._id
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules = [fieldRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Setting field 0 page 0 to be an admin field
      var fieldUpdated = updatedFormDefinition.pages[0].fields[0];

      updatedFormDefinition.pages[0].fields[0].adminOnly = true;

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldUpdated, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Switching p0f0 to admin should have deleted the field rule associated with it
       */
      fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, foundFieldRules){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));

        assert.ok(foundFieldRules === null, "Expected an empty result but got: " + util.inspect(foundFieldRules));
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    },
    function(fieldRemoved, fieldRuleId, pageRuleId, cb){
      // read our doc from the database again
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, "Unexpected error getting form: " + util.inspect(err));
        var formJSON = data.toJSON();
        assert.ok(formJSON.pageRules.length === 1, "Expected 1 page rule but got " + util.inspect(formJSON.pageRules));
        return cb(err, fieldRemoved, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function(formData, cb){
      //Now set field 1 on page 0 to admin, should delete the page rule
      var updatedField = formData.pages[0].fields[1];
      formData.pages[0].fields[1].adminOnly = true;

      forms.updateForm(options, formData, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined);
      });
    },
    function(cb){
      //Verify that there are no field or page rules left
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, "Unexpected error getting form: " + util.inspect(err));
        var formJSON = data.toJSON();
        assert.ok(formJSON.fieldRules.length === 0, "Expected 0 field rules but got " + util.inspect(formJSON.fieldRules));
        assert.ok(formJSON.pageRules.length === 0, "Expected 0 page rule but got " + util.inspect(formJSON.pageRules));
        return cb(err);
      });
    },
    function(cb){
      //Check rules are deleted from the database
      pageRuleModel.find({}, function(err, pageRules){
        assert.ok(!err, "Unexpected error getting pageRuleModel: " + util.inspect(err));
        var pRArray = pageRules;
        assert.ok(pRArray.length === 0, "Expect 0 page rules but got " + util.inspect(pRArray));
        fieldRuleModel.find({}, function(err, fieldRules){
          assert.ok(!err, "Unexpected error getting fieldRuleModel: " + util.inspect(err));

          var fRArray = fieldRules;
          assert.ok(fRArray.length === 0, "Expect 0 page rules but got " + util.inspect(fRArray));
          cb();
        });
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};
//
/**
* When a field has been deleted and the rule has multiple targets, the target should be removed only.
*/
module.exports.testUpdateFormDeleteFieldMultipleTargets = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Adding a field rule with multiple targets
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: [populatedFormDoc.pages[1]._id]
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[1].fields[1]._id, populatedFormDoc.pages[1].fields[0]._id]
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules =  [fieldRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Deleting field 0 page 1
      var fieldDeleted = updatedFormDefinition.pages[1].fields.splice(0,1);

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldDeleted, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Switching p0f0 to admin should have updated the field rule associated with it
       */
      fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, foundFieldRule){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));
        assert.ok(foundFieldRule, "Expected a field rule to be returned");
        assert.ok(foundFieldRule.targetField.length === 1, "Expected a single target in the field. One of the fields should have been deleted." + util.inspect(foundFieldRule.targetField));
        assert.ok(foundFieldRule.targetField[0].toString() !==  fieldRemoved[0]._id.toString(), "Expected the deleted field not to be in the target field list, but it was.");
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};
//
/**
* When a field has been switched to admin with multiple rule targets, the target should be removed only.
*/
module.exports.testUpdateFormWithAdminFieldMultipleTargets = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate("fieldRules pageRules").exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Adding a field rule with multiple targets
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: [populatedFormDoc.pages[1]._id]
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[1].fields[0]._id, populatedFormDoc.pages[1].fields[1]._id]
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules =  [fieldRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Updating field 0 page 1 to be an admin field
      var fieldUpdated = updatedFormDefinition.pages[1].fields[0];
      updatedFormDefinition.pages[1].fields[0].adminOnly = true;

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldUpdated, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Switching p0f0 to admin should have updated the field rule associated with it
       */
      fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, foundFieldRule){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));
        assert.ok(foundFieldRule, "Expected a field rule to be returned");
        assert.ok(foundFieldRule.targetField.length === 1, "Expected a single target in the field. One of the fields should have been deleted.");
        assert.ok(foundFieldRule.targetField[0].toString() !==  fieldRemoved._id.toString(), "Expected the update field not to be in the target field list, but it was.");
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};
//
/**
* When a field has been deleted and condition contains the deleted field - single condition + no flag for deletion from user  - it should delete the field
*/
module.exports.testUpdateFormDeleteFieldSingleConditionNoFlag = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Adding a field rule with multiple targets
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: [populatedFormDoc.pages[1]._id]
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[1].fields[0]._id]
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules = [fieldRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Updating field 0 page 1 to be an admin field
      var fieldUpdated = updatedFormDefinition.pages[0].fields[0]._id;
      updatedFormDefinition.pages[0].fields[0].adminOnly = true;

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldUpdated, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Switching p0f0 to admin should have deleted the field rule associated with it
       */
      pageRuleModel.findOne({"_id": pageRuleId}, function(err, foundPageRule){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));

        assert.ok(foundPageRule === null, "Expected no page rule to be returned. It should have been deleted");
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};
//
//
/**
* When a field has been switched to admin, - multiple conditions + no flag for deletion from user  - it should update the field conditions.
*/
module.exports.testUpdateFormWithAdminMultipleConditionsNoFlag = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate("fieldRules pageRules").exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Adding a field rule with multiple targets
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          },
          {
            sourceField: populatedFormDoc.pages[1].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: [populatedFormDoc.pages[1]._id]
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[1].fields[1]._id]
      };

      populatedFormDoc.pageRules = [pageRule];
      populatedFormDoc.fieldRules = [fieldRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Updating field 0 page 1 to be an admin field
      var fieldRemoved = updatedFormDefinition.pages[1].fields[0];
      updatedFormDefinition.pages[1].fields[0].adminOnly = true;

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Deleting p1f0 without a flag should have updated the field rule associated with it only.
       */
      pageRuleModel.findOne({"_id": pageRuleId}, function(err, foundPageRule){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));

        assert.ok(foundPageRule, "Expected a page rule to be returned");
        assert.ok(foundPageRule.ruleConditionalStatements.length === 1, "Expected only one conditional statement for the field rule but got " + foundPageRule.ruleConditionalStatements.length);
        assert.ok(foundPageRule.ruleConditionalStatements[0].sourceField.toString() !== fieldRemoved._id.toString(), "Expected the updated field to not be in the rule conditional statement source field but it was.");
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};
//
/**
* When a field has been deleted - multiple conditions + flag for deletion from user - it should delete the field
*/
module.exports.testUpdateFormDeleteFieldMultipleConditionsFlag = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      cleanUp(cb);
    },
    function (cb) {
      //Form deleted, Now add a new form
      forms.updateForm(options, TEST_FORM_2_PAGES_WITH_FIELDS, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function (cb) {
      formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate("fieldRules pageRules").exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assertEqual(data.description, TEST_FORM_2_PAGES_WITH_FIELDS.description, "description should ahve been added");
        assertEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        //Now populate the fields in each page
        formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, updatedForm) {
          assert.ok(!err, "Error getting fields for form");
          return cb(undefined, updatedForm.toJSON());
        });
      });
    },
    function (populatedFormDoc, cb) {
      //Adding a field rule with multiple targets
      var pageRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetPage: [populatedFormDoc.pages[1]._id]
      };

      var fieldRule = {
        type: "show",
        ruleConditionalOperator: "and",
        ruleConditionalStatements: [
          {
            sourceField: populatedFormDoc.pages[0].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          },
          {
            sourceField: populatedFormDoc.pages[1].fields[0]._id,
            restriction: 'does not contain',
            sourceValue: 'dammit'
          }
        ],
        targetField: [populatedFormDoc.pages[1].fields[1]._id]
      };

      populatedFormDoc.fieldRules = [fieldRule];
      populatedFormDoc.pageRules = [pageRule];

      forms.updateForm(options, populatedFormDoc, function (err, updatedForm) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        // read our doc from the database again
        formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
          assert.ok(!err, 'should have found form');
          formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
            assert.ok(!err, 'should have populated form');
            return cb(err, data.toJSON());
          });
        });
      });
    },
    function (updatedFormDefinition, cb) {
      assert.ok(updatedFormDefinition, "Updated form definition not found. ");
      var fieldRuleId = updatedFormDefinition.fieldRules[0]._id;
      var pageRuleId = updatedFormDefinition.pageRules[0]._id;

      //Updating field 0 page 1 to be an admin field
      var fieldRemoved = updatedFormDefinition.pages[1].fields.splice(0,1);
      var fieldRemovedId = fieldRemoved[0]["_id"].toString();

      //Flagging the rule to be deleted for the field removed
      updatedFormDefinition.ruleDeletionFlags = {};
      updatedFormDefinition.ruleDeletionFlags[fieldRemovedId] = true;

      //Update the form
      forms.updateForm(options, updatedFormDefinition, function (err, doc) {
        assert.ok(!err, 'testUpdateFormDeleteField testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    },
    function (fieldRemoved, fieldRuleId, pageRuleId, cb) {
      /**
       * Deleting p1f0 with a flag should have deleted the field rule associated with it
       */
      fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, foundFieldRule){
        assert.ok(!err, "Unexpected error when finding documents: " + util.inspect(err));

        assert.ok(foundFieldRule === null, "Expected no field rule to be returned");
        cb(undefined, fieldRemoved, fieldRuleId, pageRuleId);
      });
    }
  ], function (err) {
    assert.ok(!err, "Expected no error from test series: " + util.inspect(err));
    finish();
  });
};


function checkEqual(expected, actual){
  logger.debug("checkEqual ", expected, actual);
  assert.ok(_.isEqual(expected, actual), "Expected Objects To Be Equal. Expected: " + JSON.stringify(expected) + " Actual: " + JSON.stringify(actual));
}

/**
 * Test Form Updates For Fields That Use Data Sources
 * @param finish
 */
module.exports.testFormWithDataSources = function(finish){
  var dropdownField = _.clone(handyFieldData.dropdownFieldData);
  var checkboxesField = _.clone(handyFieldData.checkboxFieldData);
  var radioField = _.clone(handyFieldData.radioFieldData);
  var readOnlyField = _.clone(handyFieldData.readOnlyData);

  var testDataSource = _.clone(testDataSourceData);
  testDataSource.name = "testDs1FormUpdate";

  var testDataSource2 = _.clone(testDataSourceData);
  testDataSource2.name = "testDs2FormUpdate";

  var testDataTarget = _.clone(testDataTargetData.postProcessing);

  var testForm = simpleForm.getBaseForm();

  async.waterfall([
    cleanUp,
    //First, create a data source
    function createDataSource1(cb){
      forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
        assert.ok(!err, "Expected No Error When Creating A Data Source " + util.inspect(err));

        assert.ok(createdDataSource, "Expected A Data Source");
        testDataSource = createdDataSource;

        cb(undefined, createdDataSource._id);
      });
    },
    function createDataTarget(createdDataSourceId, cb){
      forms.dataTargets.create(options, testDataTarget, function(err, createdDataTarget){
        assert.ok(!err, "Expected No Error When Creating A Data Target " + util.inspect(err));

        assert.ok(createdDataTarget, "Expected A Data Target");
        testDataTarget = createdDataTarget;

        cb(undefined, createdDataSourceId, createdDataTarget._id);
      });
    },
    //Creating A Form That Contains A Data Source
    function createCoreFormSingleDataSource(createdDataSourceId, createdDataTargetId, cb){

      //cloning a simple base form
      var testFirstForm = _.clone(testForm);

      //Cloning a base dropdown field
      var dropdownFieldDataSource = _.clone(dropdownField);

      //New Field name
      dropdownFieldDataSource.name = "Data Source Dropdown";

      //It is not necessary to add any static options when creating fields that use data sources -- kind of the point really.
      dropdownFieldDataSource.fieldOptions.definition.options;

      //First, just a dropdown field
      testFirstForm.pages[0].fields[0] = dropdownFieldDataSource;

      //Assigning the data source
      dropdownFieldDataSource.dataSourceType = "dataSource";
      dropdownFieldDataSource.dataSource = createdDataSourceId;

      var formUpdateOptions = _.clone(options);

      //Expect/Don't expect data source cache to be present. This is useful when deploying forms to environments and saving to core where cache data will not be present.
      formUpdateOptions.expectDataSourceCache = false;

      //Assign The Data Target
      testFirstForm.dataTargets = [createdDataTargetId];

      forms.updateForm(formUpdateOptions, testFirstForm, function(err, createdForm){
        assert.ok(!err, "Expected No Error When Creating A New Form" + util.inspect(err));

        assert.ok(createdForm._id, "Expected A Form ID To Be Present");

        var expectedForm = _.clone(testFirstForm);

        //Should be One data source listed
        expectedForm.dataSources = {
          formDataSources: [
            {
              _id: createdDataSourceId,
              name: testDataSource.name,
              lastUpdated: testDataSource.lastUpdated,
              updatedBy: testDataSource.updatedBy,
              createdBy: testDataSource.createdBy
            }
          ]
        };

        //Expect A Single Data Target
        expectedForm.dataTargets = [
          {
            _id: createdDataTargetId,
            name: testDataTarget.name,
            lastUpdated: testDataTarget.lastUpdated,
            updatedBy: testDataTarget.updatedBy,
            createdBy: testDataTarget.createdBy
          }
        ];

        //Checking Data Sources And Targets Are assigned to the form
        checkEqual(expectedForm.dataSources, createdForm.dataSources);
        checkEqual(expectedForm.dataTargets, createdForm.dataTargets);

        //Checking the field data source was assigned
        var expectedField = dropdownFieldDataSource;
        var actualField = createdForm.pages[0].fields[0];

        //Assigning the id of the field
        expectedField._id = actualField._id;

        //Other than _id, the fields should be identical.
        checkEqual(expectedField, actualField);

        return cb(undefined, createdDataSourceId, createdDataTargetId, createdForm);
      });
    },
    function createSecondDataSource(createdDataSource1Id, createdDataTargetId, createdForm, cb){
      forms.dataSources.create(options, testDataSource2, function(err, createdDataSource2){
        assert.ok(!err, "Expected No Error When Creating A Data Source " + util.inspect(err));

        assert.ok(createdDataSource2, "Expected A Data Source");
        testDataSource2 = createdDataSource2;

        cb(undefined, {
          createdDataSource2Id: createdDataSource2._id,
          createdDataSource1Id: createdDataSource1Id,
          createdDataTargetId: createdDataTargetId,
          createdForm: createdForm
        });
      });
    },
    function updateFormWithSecondField(params, cb){
      //Now add a checkboxes and radio field
      var baseCheckboxes  = _.clone(checkboxesField);
      var baseRadio = _.clone(radioField);
      var baseReadOnly = _.clone(readOnlyField);

      //Deleting options
      delete baseCheckboxes.fieldOptions.definition.options;
      delete baseRadio.fieldOptions.definition.options;

      //Setting To The Same Data Source
      baseCheckboxes.dataSourceType = "dataSource";
      baseRadio.dataSourceType = "dataSource";
      baseReadOnly.dataSourceType = "dataSource";

      //Assigning A New Data Source.
      baseCheckboxes.dataSource = params.createdDataSource2Id;
      baseRadio.dataSource = params.createdDataSource2Id;
      baseReadOnly.dataSource = params.createdDataSource2Id;

      //Updating The Form
      params.createdForm.pages[0].fields.push(baseCheckboxes);
      params.createdForm.pages[0].fields.push(baseRadio);
      params.createdForm.pages[0].fields.push(baseReadOnly);

      //Updating The Form
      var formUpdateOptions = _.clone(options);

      //Expect/Don't expect data source cache to be present. This is useful when deploying forms to environments and saving to core where cache data will not be present.
      formUpdateOptions.expectDataSourceCache = false;

      forms.updateForm(formUpdateOptions, params.createdForm, function(err, updatedForm){
        assert.ok(!err, "Expected No Error When Updating A Form " + util.inspect(err));

        logger.debug("updatedForm", updatedForm.pages[0].fields);

        var expectedForm = _.clone(params.createdForm);

        //Should have 2 data sources
        expectedForm.dataSources = {
          formDataSources: [
            {
              _id: params.createdDataSource1Id,
              name: testDataSource.name,
              lastUpdated: testDataSource.lastUpdated,
              updatedBy: testDataSource.updatedBy,
              createdBy: testDataSource.createdBy
            },
            {
              _id: params.createdDataSource2Id,
              name: testDataSource2.name,
              lastUpdated: testDataSource2.lastUpdated,
              updatedBy: testDataSource2.updatedBy,
              createdBy: testDataSource2.createdBy
            }
          ]
        };

        //Expect A Single Data Target
        expectedForm.dataTargets = [
          {
            _id: params.createdDataTargetId,
            name: testDataTarget.name,
            lastUpdated: testDataTarget.lastUpdated,
            updatedBy: testDataTarget.updatedBy,
            createdBy: testDataTarget.createdBy
          }
        ];

        //Checking Data Sources And Targets Are assigned to the form
        checkEqual(expectedForm.dataSources, updatedForm.dataSources);
        checkEqual(expectedForm.dataTargets, updatedForm.dataTargets);

        var expectedCheckboxes = baseCheckboxes;
        var expectedRadio = baseRadio;
        var expectedReadOnly = baseReadOnly;

        //The fields should be in order
        var actualCheckboxes = updatedForm.pages[0].fields[1];
        var actualRadio = updatedForm.pages[0].fields[2];
        var actualReadOnly = updatedForm.pages[0].fields[3];

        expectedCheckboxes._id = actualCheckboxes._id;
        expectedRadio._id = actualRadio._id;
        expectedReadOnly._id = actualReadOnly._id;

        //Other than ID, they should be identical.
        checkEqual(expectedCheckboxes, actualCheckboxes);
        checkEqual(expectedRadio, actualRadio);
        checkEqual(expectedReadOnly, actualReadOnly);

        cb();
      });
    }
  ], function(err){
    assert.ok(!err, "Expected No Errors " + util.inspect(err));
    finish();
  });

};

/**
 * Testing The Scenario Where A Form Is Deployed Containing Data Sources
 * @param finish
 */
module.exports.testDeployFormWithDataSources = function(finish){
  var checkboxesField = _.clone(handyFieldData.checkboxFieldData);

  var testDataSource = _.clone(testDataSourceData);
  testDataSource.name = "testDSDeploy";

  var testForm = simpleForm.getBaseForm();

  async.waterfall([
    cleanUp,
    //First, create a data source
    function createDataSource(cb){
      forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
        assert.ok(!err, "Expected No Error When Creating A Data Source " + util.inspect(err));

        assert.ok(createdDataSource, "Expected A Data Source");
        testDataSource = createdDataSource;

        cb(undefined, createdDataSource._id);
      });
    },
    //Creating A Form That Contains A Data Source
    function createCoreFormSingleDataSource(createdDataSourceId, cb){

      //cloning a simple base form
      var testFirstForm = _.clone(testForm);

      //Cloning a base dropdown field
      var checkBoxFieldDataSource = _.clone(checkboxesField);

      //New Field name
      checkBoxFieldDataSource.name = "Data Source Dropdown";

      //It is not necessary to add any static options when creating fields that use data sources -- kind of the point really.
      delete checkBoxFieldDataSource.fieldOptions.definition.options;

      //First, just a checkbox field
      testFirstForm.pages[0].fields[0] = checkBoxFieldDataSource;

      //Assigning the data source
      checkBoxFieldDataSource.dataSourceType = "dataSource";
      checkBoxFieldDataSource.dataSource = createdDataSourceId;

      var formUpdateOptions = _.clone(options);

      //Expect/Don't expect data source cache to be present. This is useful when deploying forms to environments and saving to core where cache data will not be present.
      formUpdateOptions.expectDataSourceCache = false;

      forms.updateForm(formUpdateOptions, testFirstForm, function(err, createdForm){
        assert.ok(!err, "Expected No Error When Creating A New Form" + util.inspect(err));

        assert.ok(createdForm._id, "Expected A Form ID To Be Present");

        var expectedForm = _.clone(testFirstForm);

        //Should be One data source listed
        expectedForm.dataSources = {
          formDataSources: [
            {
              _id: createdDataSourceId,
              name: testDataSource.name,
              lastUpdated: testDataSource.lastUpdated,
              updatedBy: testDataSource.updatedBy,
              createdBy: testDataSource.createdBy
            }
          ]
        };

        logger.debug("expectedForm", expectedForm.dataSources);
        logger.debug("createdForm", createdForm.dataSources);

        //Checking Data Sources And Targets Are assigned to the form
        checkEqual(expectedForm.dataSources, createdForm.dataSources);

        //Checking the field data source was assigned
        var expectedField = checkBoxFieldDataSource;
        var actualField = createdForm.pages[0].fields[0];

        //Assigning the id of the field
        expectedField._id = actualField._id;

        //Other than _id, the fields should be identical.
        checkEqual(expectedField, actualField);

        return cb(undefined, createdDataSourceId, createdForm);
      });
    },
    function removeForm(createdDataSourceId, createdForm, cb){
      forms.deleteForm(_.extend({_id: createdForm._id}, options), function(err){
        assert.ok(!err, "Expected No Error " + util.inspect(err));

        cb(err, createdDataSourceId, createdForm);
      });
    },
    function deployForm(createdDataSourceId, createdForm, cb){
      var formDeployOptions = _.clone(options);

      formDeployOptions.createIfNotFound = true;

      forms.updateForm(formDeployOptions, createdForm, function(err, deployedForm){
        assert.ok(!err, "Expected No Error " + util.inspect(err));


        //The Deployed Form Should Have The Data Sources
        console.log("Deployed Form ", deployedForm);
        assert.equal(deployedForm.pages[0].fields[0].dataSource.toString(), createdDataSourceId.toString());
        assert.equal(deployedForm.pages[0].fields[0].dataSourceType, "dataSource");
        assert.ok(deployedForm.dataSources.formDataSources[0]._id, "Expected A Data Source Entry");
        cb(err);
      });
    }
  ], function(err){
    assert.ok(!err, "Expected No Errors " + util.inspect(err));
    finish();
  });

};

/**
 * Testing The Case Where A Data Source/Target Does Not Exist
 * @param finish
 */
module.exports.testFormWithDataSourcesNoDataSourceTarget = function(finish){

  var dropdownFieldNoDataSource = _.clone(handyFieldData.dropdownFieldData);

  var fakeId = "123456789012345678901234";

  dropdownFieldNoDataSource.dataSourceType = "dataSource";
  //ID of a data source that does not exist
  dropdownFieldNoDataSource.dataSource = fakeId;

  var testForm = simpleForm.getBaseForm();

  async.series([
    cleanUp,
    function(cb){
      var testNoDataSourceForm = _.clone(testForm);
      testNoDataSourceForm.pages[0].fields[0] = dropdownFieldNoDataSource;
      forms.updateForm(options, testNoDataSourceForm, function(err){
        assert.ok(err, "Expected An Error When Updating A Form With A Data Source That Does Not Exist");
        assert.ok(err.userDetail.indexOf("Could Not Be Found") > -1, "Invalid Error Message");
        assert.ok(err.systemDetail.indexOf(fakeId) > -1, "The ID Of The Data Source Should Be In The System Detail");
        assert.equal(err.code, ERROR_CODES.FH_FORMS_INVALID_PARAMETERS);
        cb();
      });
    },
    function(cb){
      var testNoDataTargetForm = _.clone(testForm);

      testNoDataTargetForm.dataTargets = [fakeId];

      forms.updateForm(options, testNoDataTargetForm, function(err){
        assert.ok(err, "Expected An Error When Updating A Form With A Data Source That Does Not Exist");

        assert.ok(err.userDetail.indexOf("Could Not Be Found") > -1, "Invalid Error Message");
        assert.ok(err.systemDetail.indexOf(fakeId) > -1, "The ID Of The Data Target Should Be In The System Detail");
        assert.equal(err.code, ERROR_CODES.FH_FORMS_INVALID_PARAMETERS);
        cb();
      });
    }

  ], function(){
    finish();
  });
};

/**
 * Testing The Case Where No Cache Exists. This is the case where a form is being deployed to an mbaas and it needs to ensure that data source data exists.
 * @param finish
 */
module.exports.testFormWithDataSourcesNoDataSourceCache = function(finish){
  var testDataSourceNoCache = _.clone(testDataSourceData);
  testDataSourceNoCache.name = "testDataSourceNoCache";

  var dropdownField = _.clone(handyFieldData.dropdownFieldData);

  dropdownField.dataSourceType = "dataSource";
  //ID of a data source that does not exist

  var testForm = simpleForm.getBaseForm();

  testForm.pages[0].fields[0] = dropdownField;

  async.waterfall([
    cleanUp,
    function createDataSource(cb){
      forms.dataSources.create(options, testDataSourceNoCache, function(err, createdDataSource){
        assert.ok(!err, "Expected No Error When Creating A Data Source " + util.inspect(err));

        cb(undefined, createdDataSource);
      });
    },
    function updateFormExpectingDataCache(createdDataSource, cb) {
      //Assinging the data source id to the field
      testForm.pages[0].fields[0].dataSource = createdDataSource._id;

      var formUpdateOptions = _.clone(options);

      //Expecting The Cache To Be Present -- Useful For Form Deploys
      formUpdateOptions.expectDataSourceCache = true;

      forms.updateForm(formUpdateOptions, testForm, function(err){
        assert.ok(err, "Expected An Error When Updating A Form With A Data Source That Does Not Exist");

        assert.ok(err.userDetail.indexOf("Cached Data") > -1, "Invalid Error Message");
        assert.ok(err.systemDetail.indexOf(createdDataSource._id.toString()) > -1, "The ID Of The Data Source Should Be In The System Detail");
        assert.equal(err.code, ERROR_CODES.FH_FORMS_INVALID_PARAMETERS);
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};

/**
 * Testing The Case Where A Field Is Switched To A Static Field, but there is no field data
 */
module.exports.testFormFieldChangeFromDataSourceToStaticNoFields = function(finish){
  var testDataSource = _.clone(testDataSourceData);
  testDataSource.name = "testDataSourceToStatic";

  var dropdownField = _.clone(handyFieldData.dropdownFieldData);
  dropdownField.fieldOptions = {

  };

  var testForm = simpleForm.getBaseForm();
  testForm.pages[0].fields[0] = dropdownField;

  async.waterfall([
    cleanUp,
    function(cb){
      forms.dataSources.create(options, testDataSource, function(err, createdDataSource){
        assert.ok(!err, "Expected No Error When Creating A Data Source " + util.inspect(err));

        dropdownField.dataSourceType = "dataSource";
        dropdownField.dataSource = createdDataSource._id;


        cb(undefined, createdDataSource);
      });
    },
    function(createdDataSource, cb){
      forms.updateForm(options, testForm, function(err, createdForm){
        assert.ok(!err, "Expected No Error When Updating A Form " + util.inspect(err));

        cb(undefined, createdDataSource, createdForm);
      });
    },
    function(createdDataSource, createdForm, cb){
      //Here, the form will be updated to switch the data source to static, but add no options. This should produce an error

      createdForm.pages[0].fields[0].dataSourceType = "static";

      forms.updateForm(options, createdForm, function(err){
        assert.ok(err, "Expected An Error When Updating A Form With A Field That Is Static But With No Options");

        assert.ok(err.userDetail.indexOf("Must Contain Field Options") > -1, "Invalid Error Message");
        assert.equal(err.code, ERROR_CODES.FH_FORMS_INVALID_PARAMETERS);
        cb(undefined, createdDataSource, createdForm);
      });
    },
    function(createdDataSource, createdForm, cb){
      //Now Update The Field To Static With Actual Options
      var formToUpdate = _.clone(createdForm);
      formToUpdate.pages[0].fields[0].dataSourceType = "static";
      //Assigning some field data
      formToUpdate.pages[0].fields[0].fieldOptions = {
        definition : handyFieldData.dropdownFieldData.fieldOptions.definition
      };

      forms.updateForm(options, formToUpdate, function(err, updatedForm){
        assert.ok(!err, "Expected No Error When Updating A Form " + util.inspect(err));

        //The field should now be static and have options
        var expectedField = _.clone(handyFieldData.dropdownFieldData);
        expectedField.dataSourceType = "static";
        expectedField.dataSource = createdDataSource._id;
        var actualField = createdForm.pages[0].fields[0];
        expectedField._id =  actualField._id;

        checkEqual(expectedField, actualField);

        //The form should have no data sources associated
        assert.equal(updatedForm.dataSources.formDataSources.length, 0);

        cb();
      });
    }
  ],  function(err){
    assert.ok(!err);
    finish();
  });
};


/**
 * Testing the scenario where the form is updated with a field and a field / page rule with temorary ids.
 * This happens in a live-editing scenario where a field is added to a form and associated with a rule before saving.
 * The updateForm function must manage the mapping of these temporray ids to new mongo ids.
 * @param finish
 */
module.exports.testFormFieldRuleChangeWithTempIds = function(finish){

  var testForm = {
    "name": "Simple Form with 1 pages with 1 field",
    "description": "This is my form. it will have fields updated",
    "pages": [
      {
        _id: "temppageid",
        name: "New Page With Temp Id",
        isNewModel: true,
        description: "Some Page",
        cid: "temppageid",
        fields: [
          {
            "_id": "tempfieldid",
            "cid": "tempfieldid",
            "isNewModel": true,
            "name": "Some Text Field",
            "helpText": "This is a text field",
            "type": "text",
            "required": false,
            "fieldOptions": {
              validation: {
                "min": 20,
                "max": 100
              },
              definition: {
                "maxRepeat": 5,
                "minRepeat": 2
              }
            },
            "repeating": true
          },
          {
            "_id": "tempfieldid2",
            "cid": "tempfieldid2",
            "isNewModel": true,
            "name": "Another Text Field",
            "helpText": "This is a text field",
            "type": "text",
            "required": false,
            "fieldOptions": {
              validation: {
                "min": 20,
                "max": 100
              },
              definition: {
                "maxRepeat": 5,
                "minRepeat": 2
              }
            },
            "repeating": true
          }
        ]
      },
      {
        _id: "temppageid2",
        name: "Another Page With Temp Id",
        isNewModel: true,
        description: "Another Page",
        cid: "temppageid2",
        fields: [
          {
            "name": "Another Text Field",
            "helpText": "This is a text field",
            "type": "text",
            "required": false,
            "fieldOptions": {
              validation: {
                "min": 20,
                "max": 100
              },
              definition: {
                "maxRepeat": 5,
                "minRepeat": 2
              }
            },
            "repeating": true
          }
        ]
      }
    ]
    ,
    "fieldRules": [{
      ruleConditionalOperator: "and",
      ruleConditionalStatements: [{
        restriction: "is",
        sourceField: "tempfieldid",
        sourceValue: "someval"
      }],
      targetField: ["tempfieldid2"],
      type: "hide"
    }],
    "pageRules": [{
      ruleConditionalOperator: "and",
      ruleConditionalStatements: [{
        restriction: "is",
        sourceField: "tempfieldid2",
        sourceValue: "someotherval"
      }],
      targetPage: ["temppageid2"],
      type: "skip"
    }]
  };

  forms.updateForm(options, testForm, function (err, doc) {
    assert.ok(!err, 'testFormFieldRuleChangeWithTempIds() - error fom updateForm: ' + util.inspect(err));

    assert.equal(doc.pageRules.length, 1, "Expected A Page Rule To Be Set");
    assert.equal(doc.fieldRules.length, 1, "Expected A Field Rule To Be Set");

    finish();
  });

};
