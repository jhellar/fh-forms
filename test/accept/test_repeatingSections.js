var forms = require('../../lib/forms.js');
var formFixture = require('../Fixtures/repeatingSectionsForm2');
var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var form;

module.exports.repeating_sections = {};

module.exports.repeating_sections.before = function(finish) {
  forms.updateForm(options, formFixture, function(error, f) {
    form = f;
    finish();
  });
};

module.exports.repeating_sections.it_should_create_valid_rule = function(finish) {
  form.fieldRules = [getFieldRule([1], 2)];
  forms.updateForm(options, form, function(error, f) {
    assert.ok(!error);
    assert.equal(f.fieldRules.length, 1);
    finish();
  });
};

module.exports.repeating_sections.it_should_not_create_invalid_rule1 = function(finish) {
  form.fieldRules = [getFieldRule([1], 0)];
  forms.updateForm(options, form, function(error, f) {
    assert.ok(!error);
    assert.equal(f.fieldRules.length, 0);
    finish();
  });
};

module.exports.repeating_sections.it_should_not_create_invalid_rule2 = function(finish) {
  form.fieldRules = [getFieldRule([1], 5)];
  forms.updateForm(options, form, function(error, f) {
    assert.ok(!error);
    assert.equal(f.fieldRules.length, 0);
    finish();
  });
};

module.exports.repeating_sections.it_should_not_create_invalid_rule3 = function(finish) {
  form.fieldRules = [getFieldRule([1, 5], 2)];
  forms.updateForm(options, form, function(error, f) {
    assert.ok(!error);
    assert.equal(f.fieldRules.length, 0);
    finish();
  });
};

function getFieldRule(sources, target) {
  var rule = {
    "type": "hide",
    "targetField": [
      form.pages[0].fields[target]._id
    ],
    "ruleConditionalStatements": [],
    "ruleConditionalOperator": "and",
    "relationType": "and"
  };
  sources.forEach(function(source) {
    rule.ruleConditionalStatements.push({
      "sourceField": form.pages[0].fields[source]._id,
      "restriction": "is",
      "sourceValue": "a"
    });
  });
  return rule;
}