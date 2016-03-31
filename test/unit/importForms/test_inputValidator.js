var validate = require('../../../lib/impl/importForms/inputValidator.js');
var assert = require('assert');
var path = require('path');

describe('Validate archive content', function () {
  it("Check Invalid Path", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import1'), true, function (err) {
      assert.ok(err, 'Should have failed with error');
      done();
    });
  });
  it("Check Path is a file", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/metadata.json'), true, function (err) {
      assert.ok(err, 'Should have failed with error');
      done();
    });
  });
  it("More than 2 files in root - strict", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/missing_metadata'), true, function (err) {
      assert.ok(err, 'Should have failed with error');
      assert.equal(err, 'Root directory must contain exactly one metadata file and one forms directory');
      done();
    });
  });
  it("Extraneous files in root - strict", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/many_files_root'), true, function (err) {
      assert.ok(err, 'Should have failed with error');
      assert.equal(err, 'Root directory must contain exactly one metadata file and one forms directory');
      done();
    });
  });
  it("Extraneous files in root - loose", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/many_files_root'), false, function (err) {
      assert.ok(!err, 'Unexpected error: ' + err);
      done();
    });
  });
  it("Extraneous files in root, Missing metadata - loose", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/many_files_no_metadata'), false, function (err) {
      assert.equal(err, 'A metadata.json file must be present in the root of the zip file');
      done();
    });
  });
  it("Forms not matching to metadata", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/forms_not_matching'), true, function (err) {
      assert.ok(err, 'A file not found error was expected');
      done();
    });
  });
  it("Invalid metadata file", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/invalid_metadata'), true, function (err) {
      assert.equal(err, 'Invalid JSON file: metadata.json');
      done();
    });
  });
  it("Invalid form file", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/invalid_form'), true, function (err) {
      assert.equal(err, 'Invalid JSON file: 56ea80dd48c7b71612174288.json');
      done();
    });
  });
  it("No forms", function (done) {
    validate(path.resolve(__dirname, '../../Fixtures/forms_import/no_forms'), true, function (err) {

      var expected = 'referenced by metadata.json does not exists';

      assert.notEqual(-1, err.indexOf(expected, err.length - expected.length), 'err');
      done();
    });
  });
});
