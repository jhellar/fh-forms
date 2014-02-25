//need a form a group a submission a theme

require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var connection;
var formsModel;
var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};
var assert = require('assert');
var TEST_APPID = "123456789123456789456121";
var TEST_GROUP_NAME = "test group delete app refs";
var testForm;

module.exports.setUp = function(finish){
  async.waterfall([

  function createConnection(callback){
    initDatabase(assert, function(err) {
      assert.ok(!err);
      connection = mongoose.createConnection(options.uri);
      callback();
    });
  },
  function setUpForm (callback){
      forms.updateForm(options, TEST_FORM, function(err,form){
       console.log("setup form ", err, form);
       testForm = form;
       callback(undefined, form);
      });
  },
  function setUpAppForms(form,callback){
    forms.updateAppForms(options, {appId: TEST_APPID, forms: [form._id]}, function(err, appForms){
      console.log("set up app forms ", appForms);
      assert.ok(!err, 'Error in setUpAppForms: ' + util.inspect(err));
      assert.equal(appForms.appId, TEST_APPID);
      return callback();
    });
  },
  function setUpGroup(callback){
    forms.createGroup(options, {name: TEST_GROUP_NAME, apps: [TEST_APPID], forms: [], users: [], themes: []}, function(err, group){
      console.log("setupGroup done ", group);
      assert.ok(!err, 'Error in createGroup: ' + util.inspect(err));
      return callback();
    });
  },
  function setUpConfig(callback){
    var params = JSON.parse(JSON.stringify(TEST_APP_CONFIG));
    params.appId = '12345';
    params.client.quality = 80;
    console.log("params ", params);
    forms.setAppConfig(options, params, function(err, result) {
      console.log("setup app config ", err, result);
      assert.ok(!err, 'should have updated appConfig: ' + util.inspect(err));
      return callback();
    });
  },
  function setUpSubmission(callback){
    testForm.populate("pages",function (err, form){

      var fieldId = form.pages[0].fields[0];
      var testValues = [{
        "fieldId" : fieldId,
        "fieldValues": ["test1test1test1test1test1test1"]
      }];
      var submission = testSubmitFormBaseInfo;
      submission.formId = testForm._id;
      submission.formFields = testValues;
      forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission" : submission}, function(err, result){
        console.log("submission created ", err, result);
        if(err) assert.fail(err);
        forms.completeFormSubmission({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission" :result}, function(err, ok){
          console.log("completed form submission ", util.inspect(err), ok);
          callback();
        });
      });
    });
  }

  ],  function seriesComplete (err, oks){
    console.log("finished set up");
    if(err) assert.fail(err);
    finish();
  });

};

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};


module.exports.it_should_delete_app_refs = function(finish) {
  console.log("called test delete app refs");
  //set up has been done we have a form so can perform a delete app refs and assert all is as expected.
  forms.deleteAppRefrences()
  finish();
};

var TEST_FORM = {
  "name": "Very Simple Form for testing app ref delete",
  "description": "This is form1.",
  "lastUpdated": "2013-11-18 06:13:52",
  "pages": [{
    name: "page1",
    description: "page 1",
    "fields": [
      {
        "name":"field_p1_f1",
        "helpText":"This is a text field",
        "type":"text",
        "required":false,
        "fieldOptions":{
          validation: {
            "min":10,
            "max":100
          },
          definition:
          {
            "maxRepeat":5,
            "minRepeat":1
          }
        },
        "repeating":true
      }],
  "fieldRules": [],
  "pageRules": []
  }]
};

var TEST_APP_CONFIG = {
  "client": {
    "sent_save_min": 5,
    "sent_save_max": 1000,
    "targetWidth": 100,
    "targetHeight": 100,
    "quality": 80,
    "debug_mode": false,
    "logger" : false,
    "max_retries" : 0,
    "timeout" : 30,
    "log_line_limit": 300,
    "log_email": "testing@example.com",
    "config_admin_user": true
  },
  "cloud": {
    "logging": {
      "enabled":false
    }
  }
};

var testSubmitFormBaseInfo = {
  "appId": TEST_APPID,
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



