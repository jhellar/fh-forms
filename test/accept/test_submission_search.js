require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');
var util = require('util');
var moment =require('moment');
var _ = require('underscore');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};


var TEST_TOTAL_NUM_SUBMISSIONS = 1;
var TEST_SUBMISSION_APPID = "thisisnowaprojectId123456";
var TEST_UNUSED_APPID = "ThisDidNotSubmit";
var TEST_SUBMISSION_FORMID; // will be populated by setup
var TEST_SUBMISSION_ID; // will be populated by setup
var TEST_UNUSED_FORMID = '123456789012345678901234';
var TEST_FIELD_NAME_PREFIX = "TestField";
var TEST_FIELD_VALUE_PREFIX = "TestFieldValue";

var globalFormId;
var globalFieldIds;
var globalNumberField;
var globalTextField;
var globalDateField;
var submissionId;
var subids = [];
var testFilePath = "./test/Fixtures/test.pdf";
savedFields = [];
var lessDateValue = moment().subtract(10, 'days').format('YYYY-MM-DD hh:mm');
var greaterValue =  moment().add(10, 'days').format('YYYY-MM-DD hh:mm');
var dateValue = moment().format('YYYY-MM-DD hh:mm');

var testSubmitFormBaseInfo = {
  "appId": TEST_SUBMISSION_APPID,
  "appClientId": "thisistheidpassedbytheclient",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
  "timezoneOffset" : 120,
  "userId": "user123456",
  "deviceId": "device123456",
  "deviceIPAddress": "192.168.1.1",
  "deviceFormTimestamp": new Date(Date.now()),
  "comments": [{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()),
    "value": "This is a comment"
  },{
    "madeBy": "somePerson@example.com",
    "madeOn": new Date(Date.now()),
    "value": "This is another comment"
  }]
};



module.exports.testSubmissionSearch = function(finish){
  forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]}}, function (err, ok){
    assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
    finish();
  });

};

function assertValueExists(subs, fieldId, value){
  for(var i=0; i < subs.length; i++){
    var formFields = subs[i].formFields;

    for(var j=0; j < formFields.length; j++){
      var fField = formFields[j];
      if(fField.fieldId._id === fieldId){
        assert.ok(fField.fieldValues.indexOf(value) != -1, value + "should be a field value");
      }

    }
  }

}

module.exports.testSubmissionSearchNumber = function (finish){
  async.series([
    function testGreaterThan (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalNumberField,"restriction":"is greater than","value":99}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalNumberField, 100);
        callback();
      });
    },
    function testLessThan (callback){
      async.series([function (callback){
        forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalNumberField,"restriction":"is less than","value":101}]}}, function (err, ok){
          assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
          assert.ok(ok.submissions.length === 2, "should have found two submissions");
          assertValueExists(ok.submissions, globalNumberField, 100);
          callback();
        });
      },
      function (callback){
        forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalNumberField,"restriction":"is less than","value":99}]}}, function (err, ok){
          assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
          assert.ok(ok.submissions.length === 0, "should have found no submissions");
           callback();
        });
      }],callback);
    },
    function testEqualTo (callback){
      async.series([
      function (callback){
        forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalNumberField,"restriction":"is equal to","value":100}]}}, function (err, ok){
          assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
          assert.ok(ok.submissions.length === 2, "should have found two submissions");
          assertValueExists(ok.submissions, globalNumberField, 100);
          callback();
        });
      },
      function (callback){
        forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalNumberField,"restriction":"is equal to","value":99}]}}, function (err, ok){
          assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
          assert.ok(ok.submissions.length === 0, "should have found zero submissions");
          callback();
        });
      }],callback);

    }
  ], function (err, oks){
      finish();
  });

};


module.exports.testSubmissionSearchMeta = function (finish){
  async.series([
    function testSearchIpEquals (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]},"queryMeta":{"clauses":[{"metaName": "deviceIPAddress",
        "restriction": "is equal to",
        "value": "192.168.1.1",
        "fieldId": "deviceIPAddress"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions",ok.submissions);
        callback();
      });
    },function testSearchIpContains (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]},"queryMeta":{"clauses":[{"metaName": "deviceIPAddress",
        "restriction": "contains",
        "value": "192.168",
        "fieldId": "deviceIPAddress"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions",ok.submissions);
        callback();
      });
    },function testSearchIpDoesNotContains (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]},"queryMeta":{"clauses":[{"metaName": "deviceIPAddress",
        "restriction": "does not contain",
        "value": "192.168",
        "fieldId": "deviceIPAddress"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 0, "should have found no submissions",ok.submissions);
        callback();
      });
    },
    function testSearchBeginsWith (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]},"queryMeta":{"clauses":[{"metaName": "deviceIPAddress",
        "restriction": "begins with",
        "value": "192.168",
        "fieldId": "deviceIPAddress"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions",ok.submissions);
        callback();
      });
    },
    function testSearchEndsWith (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[]},"queryMeta":{"clauses":[{"metaName": "deviceIPAddress",
        "restriction": "ends with",
        "value": "1.1",
        "fieldId": "deviceIPAddress"}]}}, function (err, ok){
          assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
          assert.ok(ok.submissions.length === 2, "should have found two submissions",ok.submissions);
          callback();
      });
    }
], finish);
};

module.exports.testSubmissionSearchText = function (finish){
  async.series(
   [
    function testEqualTo (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"is equal to","value":"some value"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalTextField, "some value");
        callback();
      });
    },
    function testNotEqualTo (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"is not","value":"some value"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search ");
        assert.ok(ok.submissions.length === 0, "should have found no submissions");
        callback();
      });
    },
    function testContains (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"contains","value":"some"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalTextField, "some value");
        callback();
      });
    },
    function testIs (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"is","value":"some"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 0, "should have found no submissions");
        callback();
      });
    },
    function testIs (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"is","value":"some value"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalTextField, "some value");
        callback();
      });
    },
    function testDoesNotContain (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"does not contain","value":"some"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 0, "should have found no submissions");
        callback();
      });
    },
    function testBeginsWith (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"begins with","value":"some"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalTextField, "some value");
        callback();
      });
    },
    function testEndsWith (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalTextField,"restriction":"ends with","value":"value"}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalTextField, "some value");
        callback();
      });
    }
  ]
  ,finish);
};

module.exports.testSubmissionSearchPaginate = function (finish) {

  var query = {
    "formId": globalFormId,
    "clauseOperator": "and",
    "queryFields": {
      "clauses": [{
        "fieldId": globalDateField,
        "restriction": "is at",
        "value": dateValue
      }]
    }
  };

  async.series([
    //Testing that 2 records are found without pagination
    function testIsAt(callback) {
      forms.submissionSearch({
        "uri": process.env.FH_DOMAIN_DB_CONN_URL
      }, query, function (err, submissionResult) {
        assert.ok(!err,
          "no error should be returned for submission search " + util.inspect(err));
        assert.equal(2, submissionResult.submissions.length, "should have found two submissions");
        assert.equal(2, submissionResult.total);
        assert.equal(1, submissionResult.pages);
        assertValueExists(submissionResult.submissions, globalDateField, dateValue);
        callback();
      });
    },
    function testIsAtPage1(callback) {
      //Only want 1 record per page
      var paginationParams = {
        paginate: {
          page: 1,
          limit: 1
        }
      };
      forms.submissionSearch({
        "uri": process.env.FH_DOMAIN_DB_CONN_URL
      }, _.extend(paginationParams, query), function (err, submissionResult) {
        assert.ok(!err,
          "no error should be returned for submission search " +  util.inspect(err));
        assert.equal(1, submissionResult.submissions.length, "should have found 1 submission");
        assert.equal(2, submissionResult.total);
        assert.equal(2, submissionResult.pages);
        callback();
      });
    },
    function testIsAtPage2(callback) {
      var paginationParams = {
        paginate: {
          page: 2,
          limit: 1
        }
      };
      forms.submissionSearch({
        "uri": process.env.FH_DOMAIN_DB_CONN_URL
      }, _.extend(paginationParams, query), function (err, submissionResult) {
        assert.ok(!err,
          "no error should be returned for submission search " + util.inspect(err));
        assert.equal(1, submissionResult.submissions.length, "should have found 1 submission");
        assert.equal(2, submissionResult.total);
        assert.equal(2, submissionResult.pages);
        callback();
      });
    }
  ], finish);
};

module.exports.testSubmissionSearchDate = function (finish){
  async.series([
    function testIsAt (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalDateField,"restriction":"is at","value":dateValue}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalDateField, dateValue);
        callback();
      });
    },
    function testIsBefore (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalDateField,"restriction":"is before","value":dateValue}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 0, "should have found no submissions");

        callback();
      });
    },
    function testIsBefore (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalDateField,"restriction":"is before","value":greaterValue}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalDateField, dateValue);
        callback();
      });
    },
    function testIsAfter (callback){
      forms.submissionSearch({"uri": process.env.FH_DOMAIN_DB_CONN_URL},{"formId":globalFormId,"clauseOperator":"and","queryFields":{"clauses":[{"fieldId":globalDateField,"restriction":"is after","value":lessDateValue}]}}, function (err, ok){
        assert.ok(! err, "no error should be returned for submission search " + util.inspect(err));
        assert.ok(ok.submissions.length === 2, "should have found two submissions");
        assertValueExists(ok.submissions, globalDateField, dateValue);
        callback();
      });
    }

  ], finish);
};


module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err, 'error creating test data - err: ' + util.inspect(err));
      assert.ok(globalFormId, 'form has not been created during test setup');
      assert.notEqual(globalFormId, TEST_UNUSED_FORMID, "generated formid happens to match need to re-run");
     var submission = testSubmitFormBaseInfo;
      submission.formFields = [];
      submission.formId = globalFormId;
     for(var i=0; i < savedFields.length; i++){
        console.log("saved field *** ", savedFields[i], " ***");
        var savedField = JSON.parse(savedFields[i]);
        var val = ("number" === savedField.type) ? 100 : "some value";
        val = ("dateTime" === savedField.type) ? dateValue : val;

        if(! globalNumberField && "number" == savedField.type){
            globalNumberField = savedField._id;
        }else if(! globalTextField && "text" == savedField.type){
            globalTextField = savedField._id;
        }else if(! globalDateField && "dateTime" == savedField.type){
          globalDateField = savedField._id;
        }
        submission.formFields.push({
           "fieldId":savedField._id,
           "fieldValues":[val]
        });
     }
     console.log("CREATED SUBMISSION ", submission.formFields);
//      finish();
//
      async.series([
        async.apply(doSubmission,submission),
        async.apply(completeSubmission, assert)
      ], function(err){
        assert.ok(!err, 'error in setUp - err: ' + util.inspect(err));
        finish();
      });
    });
  });
};

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};


function doSubmission (submission,cb){
  async.series([function (callback){
    forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
      if(err) console.log(err);
      assert.ok(!err, "problem submitting test form data - err: " + util.inspect(err));
      submissionId = dataSaveResult.submissionId;
      subids.push(submissionId);
      callback();
    });
  },
  function (callback){
    forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission": submission}, function(err, dataSaveResult){
      if(err) console.log(err);
      assert.ok(!err, "problem submitting test form data - err: " + util.inspect(err));
      submissionId = dataSaveResult.submissionId;
      subids.push(submissionId);
      callback();
    });
  }],cb);

}

function completeSubmission(assert, cb){
  console.log("subids are ", subids);
  var toComplete = [];

  subids.forEach(function (id){
    toComplete.push(function (callback){
      forms.completeFormSubmission({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "submission" : {"submissionId" : id}}, function(err, result){
        if(err) return cb(err);
        assert.ok(!err);
        callback();
      });
    });
  });

  async.series(toComplete,cb);
}

function createTestData(assert, cb){

  var connection = mongoose.createConnection(options.uri);

  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);

  var requiredForm = new Form({"updatedBy" : "user@example.com","createdBy" : "user@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
  var testRequiredPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

  var realTestData = require("./../Fixtures/formSubmissions.js");
  var testData = JSON.parse(JSON.stringify(realTestData));


  var textFieldOrig = testData.textFieldData;
  var numberField = testData.numberFieldData;
  delete numberField.repeating;
  var numField = new Field(numberField);
  var dateFieldOrig = testData.dateTimeFieldData;
  dateFieldOrig.repeating = false;
  var dateField = new Field(dateFieldOrig);

  var fields = [];
  fields.push(numField);
  fields.push(dateField);

  var testField;
  for(var i = 0; i < 2; i += 1) {
    testField = JSON.parse(JSON.stringify(textFieldOrig));
    testField.name = TEST_FIELD_NAME_PREFIX + i;
    testField.repeating = false;  // fixtures file specifies a repeating field, should add a non repeating field
    delete testField.fieldOptions.definition;
    fields.push(new Field(testField));
  }


  saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
    assert.ok(!err, 'error saving form - err: ' + util.inspect(err));
    assert.ok(formId, 'should have a form id');
    assert.ok(fieldIds, 'should have field ids');

    globalFormId = formId;
    TEST_SUBMISSION_FORMID = formId.toString();
    globalFieldIds = fieldIds;

    connection.close(cb);
  });

  function saveSingleForm(fields, testPage, testFieldsForm, cb){
    var globalFormId;
    var fieldIds = {};
    async.series([saveFields, savePage, saveForm], function(err){
      cb(err, globalFormId, fieldIds);
    });

    function saveForm(cb){
      testFieldsForm.pages.push(testPage);
      testFieldsForm.save(function(err){
        if(err) console.log(err);
        assert.ok(!err);

        assert.ok(testFieldsForm._id);
        globalFormId = testFieldsForm._id;

        cb(err);
      });
    }

    function savePage(cb){
      async.eachSeries(fields, function(field, cb){
        testPage.fields.push(field);
        cb();
      }, function(err){
        if(err) console.log(err);
        assert.ok(!err);
        testPage.save(cb);
      });
    }

    function saveFields(cb){
      async.eachSeries(fields, function(field, cb){
        field.save(function(err){
          if(err) console.log(err);
          assert.ok(!err);

          assert.ok(field._id);

          fieldIds[field.name] = field._id;
          savedFields.push(JSON.stringify(field));

          cb(err);
        });
      }, function(err){
        if(err) console.log(err);
        assert.ok(!err);

        cb(err, globalFormId, fieldIds);
      });
    }
  }
}
