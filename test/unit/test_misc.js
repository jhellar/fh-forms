var misc = require('../../lib/common/misc.js');
var assert = require('assert');


module.exports = {
  "Test Sorted Hash Generator": function(done){
    //The generator should generate consistent hashes regardless of the order of the object
    var obj1 = {
      key1: "val1",
      key2: "val2"
    };

    var generatedHash1 = misc.generateHash(obj1);

    var obj2 = {
      "key2": "val2",
      "key1": "val1"
    };

    var generatedHash2 = misc.generateHash(obj2);

    assert.strictEqual(generatedHash2, generatedHash1, "Expected Hashes To Be Equal");

    obj2.key1 = "val3";

    var generatedDifferentHash = misc.generateHash(obj2);

    assert.notEqual(generatedDifferentHash, generatedHash2, "Expected Different Hashes");

    //Two objects with nested order should have the same hash

    var complexObj1 = {
      "key1": {
        subkey1: "subval1",
        subkey2: "subval2"
      },
      "key2": "keyval2"
    };

    var complexHash1 = misc.generateHash(complexObj1);

    var complexObj2 = {
      "key2": "keyval2",
      "key1": {
        "subkey2": "subval2",
        subkey1: "subval1"
      }
    };

    var complexHash2 = misc.generateHash(complexObj2);

    assert.strictEqual(complexHash2, complexHash1, "Expected Hashes To Be Equal");

    //Two objects with different array order should have different hashes

    var arrayObj1 = {
      "key2": "keyval2",
      "key1": {
        "subkey2": "subval2",
        subkey1: ["arrayEntry1", "arrayEntry2"]
      }
    };

    var arrayObj2 = {
      "key2": "keyval2",
      "key1": {
        "subkey2": "subval2",
        subkey1: [ "arrayEntry2", "arrayEntry1"]
      }
    };

    assert.notEqual(misc.generateHash(arrayObj1), misc.generateHash(arrayObj2), "Expected Array Hashes To Not Be Equal");

    done();
  },
  "Test Submission File Storage Builder": function(done){

    var testSubmissions = [{
      _id: "somesubmissionid",
      formId: "someformid1",
      formFields: [{
        fieldId: "sometextfieldid",
        fieldValues: ["sometextval"]
      }, {
        fieldId: "somefilefieldid",
        fieldValues: [{
          fileSize: 22,
          fileName: "somefilename.pdf"
        },{
          fileSize: 33,
          fileName: "somefilename2.pdf"
        }]
      }]
    }, {
      _id: "someothersubmissionid",
      formId: "someformid2",
      formFields: [{
        fieldId: "sometextfieldid",
        fieldValues: ["sometextval"]
      }, {
        fieldId: "somefilefieldid",
        fieldValues: [{
          fileSize: 10,
          fileName: "somefilename.pdf"
        },{
          fileSize: 20,
          fileName: "somefilename2.pdf"
        }]
      }]
    }];

    var result = misc.buildFormFileSizes(testSubmissions);

    assert.equal(result["someformid1"], 55);
    assert.equal(result["someformid2"], 30);

    done();
  }
};