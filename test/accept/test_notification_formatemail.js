var async = require('async');
var assert = require('assert');

var notification = require('../../lib/impl/notification.js');

var submission = {
  _id: "52f0bb82594dd41a232dbd75",
  appCloudName: 'appCloudName123456',
  appEnvironment: 'devLive',
  appId: 'appId123456',
  deviceFormTimestamp: new Date().toString(),
  deviceIPAddress: '192.168.1.1',
  deviceId: 'device123456',
  formId: "52f0bb82594dd41a232dbd6a",
  masterFormTimestamp: new Date().toString(),
  timezoneOffset: 120,
  formFields:[ 
  { fieldId: { name: 'greeting', type: 'text'},
    fieldValues: [ "Hello", "World" ] },
  { fieldId: { name: 'TestField0', type: 'text'},
    fieldValues: [ 'TestFieldValue0' ] },
  { fieldId: { name: 'TestField1', type: 'text'},
    fieldValues: [ 'TestFieldValue1' ] },
  { fieldId: { name: 'TestField2', type: 'text'},
    fieldValues: [ 'TestFieldValue2' ] },
  { fieldId: { name: 'TestField3', type: 'text'},
    fieldValues: [ 'TestFieldValue3' ] },
  { fieldId: { name: 'TestField4', type: 'text'},
    fieldValues: [ 'TestFieldValue4' ] },
  { fieldId: { name: 'TestField5', type: 'text'},
    fieldValues: [ 'TestFieldValue5' ] } ],
  comments:
   [ { madeBy: 'somePerson@example.com',
       madeOn: new Date().toString(),
       value: 'This is a comment' },
     { madeBy: 'somePerson@example.com',
       madeOn: new Date().toString(),
       value: 'This is another comment' } ],
  status: 'complete',
  submissionStartedTimestamp: new Date().toString(),
  updatedTimestamp: new Date().toString(),
  submissionCompletedTimestamp: new Date().toString()
};

module.exports.it_should_return_formatted_submission = function(finish) {
  var formName = "test form name";
  var subscribers = "test1@example.com, tset2@example.com";

  var msg = notification.buildSubmissionReceivedMessage(subscribers, formName, submission);

  assert.equal(msg.subscribers, subscribers);
  assert.equal(msg.formId, submission.formId);
  assert.equal(msg.appId, submission.appId);
  assert.equal(msg.formName, formName);
  assert.equal(msg.submissionStatus, submission.status);
  assert.equal(msg.appEnvironment, submission.appEnvironment);
  assert.equal(msg.deviceIPAddress, submission.deviceIPAddress);
  assert.equal(msg.deviceId, submission.deviceId);
  assert.equal(msg.submittedFields.length, 7);
  assert.equal(msg.submittedFields[0], "greeting: Hello, World");
  assert.equal(msg.submittedFields[1], "TestField0: TestFieldValue0");
  assert.equal(msg.submittedFields[2], "TestField1: TestFieldValue1");
  assert.equal(msg.submittedFields[3], "TestField2: TestFieldValue2");
  assert.equal(msg.submittedFields[4], "TestField3: TestFieldValue3");
  assert.equal(msg.submittedFields[5], "TestField4: TestFieldValue4");
  assert.equal(msg.submittedFields[6], "TestField5: TestFieldValue5");

  finish();
}
