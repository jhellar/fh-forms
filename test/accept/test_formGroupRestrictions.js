require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "thisisnowaprojectId123456";
var assert = require('assert');
var util = require('util');
var submissionToday1;
var submissionToday2;
var submissionYesterday1;
var submissionDataBase = {
  "submissionCompletedTimestamp": "",
  "updatedBy": "testing@sometime.com",
  "timezoneOffset" : 2,
  "appId": appId,
  "appClientId": "thisistheidpassedbytheclient",
  "appCloudName": "someCloud",
  "appEnvironment": "dev",
  "userId": "SomeUser",
  "deviceId": "123456",
  "deviceIPAddress": "192.168.1.1",
  "status": "complete",
  "deviceFormTimestamp": Date.now(),
  "masterFormTimestamp": Date.now(),
  "comments": [],
  "formFields": []
};


module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
};

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testGetFormGroupRestrictFail = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);
    assert.ok(result);

    var formId = result[0]._id;
    forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : formId, restrictToUser: "notexist@example.com"}, function(err, result){
      assert.ok(err, 'should generate error since no access to that form');

      var allowedUser = 'users1@example.com';
      var groupSetup = {
        name: 'testGroup',
        users: [allowedUser],
        forms: [formId],
        apps: [],
        themes: []
      };
      forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, groupSetup, function (err) {
        // should still fail, since user not listed
        forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : formId, restrictToUser: "notexist@example.com"}, function(err, result){
          assert.ok(err, 'should generate error since no access to that form');

          // should pass since user is listed
          forms.getForm({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "_id" : formId, restrictToUser: allowedUser}, function(err, result){
            assert.ok(!err, util.inspect(err));

            finish();
          });
        });
      });
    });
  });
};

function checkSubmissions(form, expectedTotal, expectedToday, expectedAppsUsingForm){
  assert.ok(form.submissionsTotal === expectedTotal, "Expected total submissions to be " + expectedTotal + " but was " + form.submissionsTotal);
  assert.ok(form.submissionsToday === expectedToday, "Expected today submissions to be " + expectedToday + " but was " + form.submissionsToday);
  assert.ok(form.appsUsingForm === expectedAppsUsingForm, "Expected apps using form to be " + expectedAppsUsingForm + " but was " + form.appsUsingForm);
};

module.exports.testGetFormSubmissionStatistics = function(finish){

  var today = new Date();
  var yesterday = new Date().setHours(-1, 0, 0, 0);

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Submission = models.get(connection, models.MODELNAMES.FORM_SUBMISSION);


  submissionToday1 = new Submission(submissionDataBase);
  submissionToday1.submissionCompletedTimestamp = today;

  submissionToday2 = new Submission(submissionDataBase);
  submissionToday2.submissionCompletedTimestamp = today;

  submissionYesterday1 = new Submission(submissionDataBase);
  submissionYesterday1.submissionCompletedTimestamp = yesterday;


  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);
    assert.equal(result.length, 2, 'Should have been 2 forms setup');
    var form1 = result[0];
    submissionToday1.formId = form1._id;

    var form1Id = result[0]._id;
    var form2Id = result[1]._id;
    var allowedUser1 = 'users1@example.com';
    var allowedUser2 = 'users2@example.com';
    setupTestGroups(allowedUser1, allowedUser2, form1Id, form2Id, function (err) {
      assert.ok(!err, util.inspect(err));
      checkSubmissions(form1, 0, 0, 1);

      submissionToday1.save(function(err){
      assert.ok(!err, util.inspect(err));
      forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
        assert.ok(!err, util.inspect(err));
        assert.ok(result);
        assert.equal(result.length, 2, 'Should have been 2 forms setup');
        var form1 = result[0];
        submissionToday2.formId = form1._id;

        checkSubmissions(form1, 1, 1, 1);

        submissionToday2.save(function(err){
          assert.ok(!err, util.inspect(err));

          forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
            assert.ok(!err, util.inspect(err));
            assert.ok(result);
            assert.equal(result.length, 2, 'Should have been 2 forms setup');
            var form1 = result[0];
            submissionYesterday1.formId = form1._id;

            checkSubmissions(form1, 2, 2, 1);

            submissionYesterday1.save(function(err){
              assert.ok(!err, util.inspect(err));
              forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
                assert.ok(!err, util.inspect(err));
                assert.ok(result);
                assert.equal(result.length, 2, 'Should have been 2 forms setup');
                var form1 = result[0];

                checkSubmissions(form1, 3, 2, 1);

                connection.close(function(err){
                  if(err) console.error(err);
                  finish();
                });
              });
             });
          });
        });
      });
    });
    });
  });
};

// setup 2 groups
// group 1 give user1 access to form1
// group 2 give user 2 access to form1 and form 2
function setupTestGroups(allowedUser1, allowedUser2, form1Id, form2Id, cb) {
  var group1Setup = {
    name: 'testGroup',
    users: [allowedUser1],
    forms: [form1Id],
    apps: [appId],
    themes: []
  };
  var group2Setup = {
    name: 'testGroup2',
    users: [allowedUser2],
    forms: [form1Id, form2Id],
    apps: [appId],
    themes: []
  };
  forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group1Setup, function (err) {
    if(err) return cb(err);
    forms.createGroup({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, group2Setup, function (err) {
      if(err) return cb(err);
      return cb();
    });
  });    
}

module.exports.testGetFormsGroupRestrict = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);

    assert.equal(result.length, 2, 'Should have been 2 forms setup');
    var form1Id = result[0]._id;
    var form2Id = result[1]._id;
    var allowedUser1 = 'users1@example.com';
    var allowedUser2 = 'users2@example.com';
    setupTestGroups(allowedUser1, allowedUser2, form1Id, form2Id, function (err) {
      assert.ok(!err, util.inspect(err));

      forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: "notexist@example.com", "appId": appId}, function(err, result){
        assert.ok(!err, util.inspect(err));
        assert.equal(result.length, 0, 'should be no forms returned: ' + util.inspect(result));

        forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: allowedUser2, "appId": appId}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.equal(result.length, 2, 'should be 2 forms returned: ' + util.inspect(result));

          // should be 1 form
          forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: allowedUser1, "appId": appId}, function(err, result){
            assert.ok(!err, util.inspect(err));
            assert.equal(result.length, 1, 'should be 1 form returned: >>>>>' + util.inspect(result) + "<<<<<<");

            finish();
          });
        });
      });
    });
  });
};

module.exports.testGetAllFormsGroupRestrict = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err, util.inspect(err));
    assert.ok(result);

    assert.equal(result.length, 2, 'Should have been 2 forms setup');
    var form1Id = result[0]._id;
    var form2Id = result[1]._id;
    var allowedUser1 = 'users1@example.com';
    var allowedUser2 = 'users2@example.com';
    setupTestGroups(allowedUser1, allowedUser2, form1Id, form2Id, function (err) {
      assert.ok(!err, util.inspect(err));

      forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: "notexist@example.com"}, function(err, result){
        assert.ok(!err, util.inspect(err));
        assert.equal(result.length, 0, 'should be no forms returned: ' + util.inspect(result));

        forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: allowedUser2}, function(err, result){
          assert.ok(!err, util.inspect(err));
          assert.equal(result.length, 2, 'should be 2 forms returned: ' + util.inspect(result));

          // should be 1 form
          forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, restrictToUser: allowedUser1}, function(err, result){
            assert.ok(!err, util.inspect(err));
            assert.equal(result.length, 1, 'should be 1 form returned: >>>>>' + util.inspect(result) + "<<<<<<");

            finish();
          });
        });
      });
    });
  });
};

//Adding data needed for the test
function createTestData(assert, cb){
  //Add a form to the database.

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);
  var FieldRule = models.get(connection, models.MODELNAMES.FIELD_RULE);
  var PageRule = models.get(connection, models.MODELNAMES.PAGE_RULE);

  var appForm1;

  var form1 = new Form({"updatedBy": "test@example.com","createdBy":"test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  var field1 = new Field({
    "name":"field1",
    "helpText":"field1 Help Text",
    "type":"text",
    "repeating":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    },
    "required":true
  });
  var field2 = new Field({
    "name":"field2",
    "helpText":"field2 Help Text",
    "type":"textarea",
    "repeating":true,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    },
    "required":false
  });

  var page1 = new Page({"name" : "page1", "description" : "Page1 Description"});
  var page2 = new Page({"name" : "page2", "description" : "Page2 Description"});

  var fieldRule1;
  var pageRule1;


  async.series([saveFields, savePages, saveFieldRules, savePageRules, saveForm, saveAppForm], function(err){
    assert.ok(!err);
    connection.close(function(err){
      if(err) console.log(err);
      cb(err);
    });
  });

  function saveFields(cb){
    async.series([function(cb){
      field1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }, function(cb){
      field2.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      console.log("Fields Saved");
      cb(err);
    });
  }

  function savePages(cb){

    //Add fields to the page
    page1.fields.push(field1);
    page1.fields.push(field2);

    page2.fields.push(field1);
    page2.fields.push(field2);

    page1.save(function(err){
      assert.ok(!err);

      page2.save(function(err){
        assert.ok(!err);

        console.log("Pages Saved");
        cb(err);
      });
    });
  }

  function saveFieldRules(cb){

    var ruleData = {
      "type": "hide",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": field1._id,
        "restriction": "contains",
        "sourceValue": "asd"
      }]
    };

    fieldRule1 = new FieldRule(ruleData);

    fieldRule1.targetField = field2;

    fieldRule1.save(function(err){
      assert.ok(!err);
      console.log("FieldRule Saved");
      cb(err);
    });
  }

  function savePageRules(cb){

    var ruleData = {
      "type": "skip",
      "ruleConditionalOperator": "and",
      "ruleConditionalStatements": [{
        "sourceField": field1._id,
        "restriction": "contains",
        "sourceValue": "None"
      }]
    };

    pageRule1 = new PageRule(ruleData);
    pageRule1.targetPage = page1;

    pageRule1.save(function(err){
      assert.ok(!err);
      console.log("PageRule Saved");
      cb(err);
    });
  }

  function saveForm(cb){
    //Save the forms

    form1.pages.push(page1);
    form2.pages.push(page1);
    form1.fieldRules.push(fieldRule1);
    form1.pageRules.push(pageRule1);

    async.series([function(cb){
      form1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }, function(cb){
      form2.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      console.log("Forms Saved");
      cb(err);
    });
  }

  function saveAppForm(cb){
    appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);
      console.log("Appform Saved");
      cb(err);
    });
  }
}