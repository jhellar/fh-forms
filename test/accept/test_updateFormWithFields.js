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
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    fieldModel = models.get(connection, models.MODELNAMES.FIELD);
    pageRuleModel = models.get(connection, models.MODELNAMES.PAGE_RULE);
    fieldRuleModel = models.get(connection, models.MODELNAMES.FIELD_RULE);
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
      formModel.remove({}, function (err) {
        assert.ok(!err, "Expected no error when removing forms " + util.inspect(err));
        fieldRuleModel.remove({}, function(err){
          assert.ok(!err, "Expected no error when removing fieldRules " + util.inspect(err));
          pageRuleModel.remove({}, function(err){
            assert.ok(!err, "Expected no error when removing pageRules " + util.inspect(err));
            cb();
          });
        });
      });
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

      forms.updatePageRules(options, {formId: populatedFormDoc._id, rules: [pageRule]}, function (err, frs) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        forms.updateFieldRules(options, {formId: populatedFormDoc._id, rules: [fieldRule, fieldRule2]}, function (err, frs) {
          assert.ok(!err, 'testUpdateForm() - error from updateFieldRules: ' + util.inspect(err));

          // read our doc from the database again
          formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
            assert.ok(!err, 'should have found form');
            formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
              assert.ok(!err, 'should have populated form');
              return cb(err, data.toJSON());
            });
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

        var resArray = foundFieldRules ? foundFieldRules.toArray() : [];
        assert.ok(resArray.length === 0, "Expected an empty array but got: " + util.inspect(resArray));
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
 * When setting any field to admin, if the rule is the target/subject of the rule, then the rule must be removed
 */
module.exports.testUpdateFormWithAdminField = function(finish){
  async.waterfall([
    function (cb) {
      //Cleaning forms and rules first
      formModel.remove({}, function (err) {
        assert.ok(!err, "Expected no error when removing forms " + util.inspect(err));
        fieldRuleModel.remove({}, function(err){
          assert.ok(!err, "Expected no error when removing fieldRules " + util.inspect(err));
          pageRuleModel.remove({}, function(err){
            assert.ok(!err, "Expected no error when removing pageRules " + util.inspect(err));
            cb();
          });
        });
      });
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

      forms.updatePageRules(options, {formId: populatedFormDoc._id, rules: [pageRule]}, function (err, frs) {
        assert.ok(!err, 'testUpdateForm() - error from updatePageRules: ' + util.inspect(err));

        forms.updateFieldRules(options, {formId: populatedFormDoc._id, rules: [fieldRule]}, function (err, frs) {
          assert.ok(!err, 'testUpdateForm() - error from updateFieldRules: ' + util.inspect(err));

          // read our doc from the database again
          formModel.findOne({name: TEST_FORM_2_PAGES_WITH_FIELDS.name}).populate('pages').populate('pageRules fieldRules').exec(function (err, data) {
            assert.ok(!err, 'should have found form');
            formModel.populate(data, {"path": "pages.fields", "model": fieldModel, "select": "-__v -fieldOptions._id"}, function (err, data) {
              assert.ok(!err, 'should have populated form');
              return cb(err, data.toJSON());
            });
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

        var resArray = foundFieldRules ? foundFieldRules.toArray() : [];
        assert.ok(resArray.length === 0, "Expected an empty array but got: " + util.inspect(resArray));
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

