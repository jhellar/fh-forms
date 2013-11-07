require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      test.finish();
    });
  });
}

module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testDidNotSaveRequiredField = function(test, assert){
  test.finish();
};



//////////////////////// Testing all of the field types for valid and invalid parameters

module.exports.testSubmitText = function(test, assert){
 test.finish();
};

module.exports.testSubmitTextTooShort = function(test, assert){
  test.finish();
}

module.exports.testSubmitTextTooLong = function(test, assert){
  test.finish();
};

module.exports.testSubmitTextArea = function(test, assert){
  test.finish();
};

module.exports.testSubmitTextAreaTooShort = function(test, assert){
  test.finish();
};

module.exports.testSubmitTextAreaTooLong = function(test, assert){
  test.finish();
};

module.exports.testSubmitRadio = function(test, assert){
  test.finish();
};

module.exports.testSubmitRadioWrongOption = function(test, assert){
  test.finish();
};

module.exports.testSubmitCheckBox = function(test, assert){
  test.finish();
};

module.exports.testSubmitCheckBoxWrongOption = function(test, assert){
  test.finish();
};

module.exports.testSubmitNumber = function(test, assert){
  test.finish();
};

module.exports.testSubmitNumberNotANumber = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationLatLong = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationLatLongInvalid = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationNorthEast = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationNorthEastInvalid = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationMap = function(test, assert){
  test.finish();
};

module.exports.testSubmitLocationMapInvalid = function(test, assert){
  test.finish();
};

module.exports.testSubmitDate = function(test, assert){
  test.finish();
};

module.exports.testSubmitDateInvalid = function(test, assert){
  test.finish();
};

module.exports.testSubmitDateTime = function(test, assert){
  test.finish();
};

module.exports.testSubmitDateTimeInvalid = function(test, assert){
  test.finish();
};

function createTestData(assert, cb){
  cb(null);
}