require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var lodash = require('lodash');
var assert = require('assert');
var util = require('util');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: 'foo@example.com'};

var testThemeData = require('../Fixtures/theme.json');


module.exports.setUp = function(finish){
  finish();
}

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testCreateTheme = function(finish){
  forms.updateTheme(options, testThemeData, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    finish();
  });
};

module.exports.testListTheme = function(finish) {
  forms.updateTheme(options, testThemeData, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    forms.getThemes(options, function(err, themes) {
      assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
      assert.notEqual(themes.length, 0, "Expected some themes to exist");
      finish();
    });
  });
};

module.exports.testDeleteTheme = function(finish) {
  forms.updateTheme(options, testThemeData, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    forms.deleteTheme({uri: options.uri, userEmail: options.userEmail, _id: result._id}, function(err, theme) {
      assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
      finish();
    });
  });
};

module.exports.testGetTheme = function(finish) {
  forms.updateTheme(options, testThemeData, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    checkTheme(assert, testThemeData, result);

    forms.getTheme({uri: options.uri, userEmail: options.userEmail, _id: result._id}, function(err, theme) {
      assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
      assert.ok(theme, 'Expected theme to be returned');
      finish();
    });
  });
};

module.exports.testUpdateTheme = function(finish){
  var themeToUpdate = JSON.parse(JSON.stringify(testThemeData));  // clone it
  themeToUpdate.name = 'ThemeToUpdate';
  forms.updateTheme(options, themeToUpdate, function(err, result){
    assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
    assert.ok(result);

    // verify theme created
    assert.ok(result._id, 'created theme should have id');
    var createdThemeId = result._id;
    assert.strictEqual(result.name, 'ThemeToUpdate');
    checkTheme(assert, themeToUpdate, result);

    themeToUpdate.name = 'Updated Name';
    themeToUpdate._id = createdThemeId;
    forms.updateTheme(options, themeToUpdate, function(err, result){
      assert.ok(!err, 'should not have returned error: ' + util.inspect(err));
      assert.ok(result);

      // verify theme created
      assert.ok(result._id, 'updated theme should have id');
      assert.equal(JSON.stringify(result._id), JSON.stringify(createdThemeId), 'Id should be them same as the theme created - expected: ' + createdThemeId + ", actual: " + result._id);
      assert.strictEqual(result.name, 'Updated Name');
      checkTheme(assert, themeToUpdate, result);

      finish();
    });
  });
};

function checkTheme(assert, expectedThemeData, actualThemeData){
  assert.ok(actualThemeData);
  assert.ok(actualThemeData._id);//Check id exists
  assert.ok(actualThemeData.lastUpdated);//Check lastUpdated exists
  assert.ok(actualThemeData.css);
  assert.ok(actualThemeData.css.indexOf("Error Generating Appforms CSS") == -1);

  var expectedSections = expectedThemeData.sections;
  var actualSections = actualThemeData.sections;
  assert.ok(expectedSections, "Expected Sections Not Present: "+ JSON.stringify(expectedThemeData));
  assert.ok(actualSections, "Actual Sections Not Present: "+ JSON.stringify(actualThemeData));

  expectedSections.forEach(function(expectedSection, index){
    var actualSection = actualSections[index];

    assert.ok(lodash.isEqual(expectedSection.id, actualSection.id), "Expected section id " + expectedSection.id + " ACTUAL: " + actualSection.id);
    assert.ok(lodash.isEqual(expectedSection.label,actualSection.label), "Expected section id " + expectedSection.id + " ACTUAL: " + actualSection.id);

    var expectedSubSections = expectedSection.sub_sections;
    var actualSubSections = actualSection.sub_sections;

    expectedSubSections.forEach(function(expectedSubSection, index){
      var actualSubSection = actualSubSections[index];

      assert.ok(lodash.isEqual(expectedSubSection, actualSubSection), "Expected sub section: " + JSON.stringify(expectedSubSection) + " ACTUAL: " + JSON.stringify(actualSubSection) );
    });
  });
}