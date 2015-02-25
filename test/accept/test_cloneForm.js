require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var _ = require('underscore');
var handyFieldData = require('../Fixtures/formSubmissions.js');
var simpleForm = require('../Fixtures/simple.js');
var cleanUp = require('../Fixtures/cleanup.js');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

module.exports.setUp = function(finish){
  cleanUp(finish);
};

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testCloneForm = function(finish){
  var testForm = simpleForm.getBaseForm();
  testForm.pages = [{
    fields: []
  }];


  //Add A Text Field
  testForm.pages[0].fields.push(_.clone(handyFieldData.textFieldData));
  testForm.pages[0].fields.push(_.clone(handyFieldData.textFieldData));

  forms.updateForm(options, testForm, function(err, updatedForm){
    assert.ok(!err, "Unexpected Error updateForm Forms " + err);

    var pageId = updatedForm.pages[0]._id;
    var field1Id = updatedForm.pages[0].fields[0]._id;
    var field2Id = updatedForm.pages[0].fields[1]._id;

    assert.notEqual(field1Id, field2Id);

    var fieldRule = {
      "type": "show",
      "targetField": [field2Id],
      "ruleConditionalStatements": [{
        "sourceField": field1Id,
        "restriction": "is",
        "sourceValue": "asf"
      }],
      "ruleConditionalOperator": "and",
      "relationType": "and"
    };

    var pageRule = {
      "type": "skip",
      "targetPage": [pageId],
      "ruleConditionalStatements": [{
        "sourceField": field1Id,
        "restriction": "is",
        "sourceValue": "asfd"
      }],
      "ruleConditionalOperator": "and",
      "relationType": "and"
    };

    updatedForm.fieldRules = [fieldRule];
    updatedForm.pageRules = [pageRule];

    forms.updateForm(options, updatedForm, function(err, updatedForm) {
      assert.ok(!err, "Unexpected Error updateForm Forms " + err);

      var connOptions = _.clone(options);

      _.extend(connOptions, {_id: updatedForm._id, name: "Some Cloned Form"});

      forms.cloneForm(connOptions, function(err, clonedForm){
        assert.ok(!err, "Unexpected Error WHen cloning form " + util.inspect(err));

        assert.ok(clonedForm);

        assert.equal(clonedForm.name, "Some Cloned Form");

        assert.ok(updatedForm._id !== clonedForm._id, "Expected the cloned form to be different");

        assert.ok(updatedForm.pages[0]._id !== clonedForm.pages[0]._id, "Expected Page Ids To Be Different");

        assert.ok(updatedForm.pages[0].fields[0]._id !== clonedForm.pages[0].fields[0]._id, "Expected Field Ids To Be Different");

        cleanUp(finish);
      });
    });
  });
};