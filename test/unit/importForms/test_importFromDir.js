var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var importFormsFromDirPath = "../../../lib/impl/importForms/importFromDir";
var path = require('path');
var recursive = require('recursive-readdir');

describe('Importing forms from dir', function(){
  it('import forms from dir', function(done){
    var updateForm = sinon.stub();
    var connections = {};
    var importFormFromDir = proxyquire(importFormsFromDirPath, {
      '../updateForm': updateForm
    });

    var importDirPath = path.resolve(__dirname, '../../Fixtures/forms_import/correct');

    updateForm.yieldsAsync();

    recursive(path.join(importDirPath, 'forms'), function(err, files){
      if(err){
        assert.ok(!err, 'Unexpected error ' + err);
      } else {
        importFormFromDir(connections, importDirPath, function(err){
          assert.ok(!err, "Expected no error" + err);

          assert.equal(updateForm.callCount, files.length);

          done();
        });
      }
    });
  });
});