var forms = require('../../lib/forms.js');
var formFixture = require('../Fixtures/repeatingSectionsForm2');
var assert = require('assert');
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var tests = [
  {
    name: 'it_should_create_valid_field_rule',
    ruleType: 'fieldRules',
    sources: [1],
    target: 2,
    ruleValid: true
  }, {
    name: 'it_should_not_create_invalid_field_rule_target_not_in_repeating_section',
    ruleType: 'fieldRules',
    sources: [1],
    target: 0,
    ruleValid: false
  }, {
    name: 'it_should_not_create_invalid_field_rule_target_in_different_repeating_section',
    ruleType: 'fieldRules',
    sources: [1],
    target: 5,
    ruleValid: false
  }, {
    name: 'it_should_not_create_invalid_field_rule_sources_in_different_repeating_sections',
    ruleType: 'fieldRules',
    sources: [1, 5],
    target: 2,
    ruleValid: false
  }, {
    name: 'it_should_create_valid_page_rule',
    ruleType: 'pageRules',
    sources: [7],
    target: 1,
    ruleValid: true
  }, {
    name: 'it_should_create_valid_page_rule_source_in_repeating_section',
    ruleType: 'pageRules',
    sources: [1],
    target: 1,
    ruleValid: false
  }
];

var form;

module.exports.repeating_sections = {};

module.exports.repeating_sections.before = function(finish) {
  forms.updateForm(options, formFixture, function(error, f) {
    form = f;
    finish();
  });
};

tests.forEach(function(test) {
  module.exports.repeating_sections[test.name] = function(finish) {
    form[test.ruleType] = [getRule(test.sources, test.target, test.ruleType === 'pageRules')];
    forms.updateForm(options, form, function(error, f) {
      assert.ok(!error);
      assert.equal(f[test.ruleType].length, test.ruleValid ? 1 : 0);
      finish();
    });
  };
});

function getRule(sources, target, pageRule) {
  var rule = {
    "type": "show",
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
  if (pageRule) {
    rule.targetPage = form.pages[target]._id;
  } else {
    rule.targetField = form.pages[0].fields[target]._id;
  }
  return rule;
}