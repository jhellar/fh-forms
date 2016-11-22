var assert = require('assert');
var util = require('util');
var mockSub = {
  "_id": "533150772dd1cd3e2fa622c6",
  "appCloudName": "testing-n8racbcvtjdcyk0ypy6pb0ud-dev",
  "appEnvironment": "dev",
  "appId": "N8rACBcvTjDCYK_yPY6PB-UD",
  "deviceFormTimestamp": "2014-03-25T09:46:01.031Z",
  "deviceIPAddress": "10.0.2.2,127.0.0.1",
  "deviceId": "DCD8C0D9A65547A6B05514F3FE03450B",
  "formId": "52fe126de542d21b7dc11101",
  "formSubmittedAgainst": {
    "_id": "52fe126de542d21b7dc11101",
    "description": "",
    "name": "fh-forms_beta",
    "updatedBy": "test@example.com",
    "subscribers": [],
    "pageRules": [],
    "fieldRules": [],
    "pages": [
      {
        "_id": "52fe126de542d21b7dc11100",
        "name": "changed 1",
        "fields": [
          {
            "values": [],
            "_id": "5330466e08b0ea8230d9507c",
            "fieldOptions": {"validation": {"min": "4", "max": "10", "validateImmediately": true}},
            "name": "text5",
            "pageData": {"name": "changed 1", "_id": "52fe126de542d21b7dc11100"},
            "required": true,
            "type": "text",
            "repeating": false
          },
          {
            "values": [],
            "_id": "5330466e08b0fss230d9507c",
            "fieldOptions": {},
            "name": "file1",
            "pageData": {"name": "changed 1", "_id": "52fe126de542d21b7dc11100"},
            "required": true,
            "type": "file",
            "repeating": false
          }
        ]
      }
    ],
    "lastUpdated": "2014-03-25T09:46:01.031Z",
    "dateCreated": "2014-02-14T12:56:13.692Z"
  },
  "masterFormTimestamp": "2014-03-25T09:46:01.031Z",
  "timezoneOffset": 0,
  "userId": null,
  "formFields": [
    {
      "fieldId": {
        "_id": "5330466e08b0ea8230d9507c",
        "fieldOptions": {"validation": {"min": "4", "max": "10", "validateImmediately": true}},
        "name": "text5",
        "pageData": {"_id": "52fe126de542d21b7dc11100", "name": "changed 1"},
        "required": true,
        "type": "text",
        "repeating": false
      }, "fieldValues": ["text"]
    },
    {
      "fieldId": {
        "_id": "5330466e08b0fss230d9507c",
        "fieldOptions": {},
        "name": "file1",
        "pageData": {"_id": "52fe126de542d21b7dc11100", "name": "changed 1"},
        "required": true,
        "type": "file",
        "repeating": false
      }, "fieldValues": [
      {groupId: "file12345"}
    ]
    }
  ],
  "comments": [],
  "status": "complete",
  "submissionStartedTimestamp": "2014-03-25T09:46:31.682Z",
  "updatedTimestamp": "2014-03-25T09:46:31.873Z",
  "submissionCompletedTimestamp": "2014-03-25T09:46:31.873Z"
};


var toTest = require('../../lib/common/misc.js').mapSubmissionValsToFormsFields;


exports.testMatchingFieldsToVals = function (finish) {

  toTest(mockSub, mockSub.formSubmittedAgainst, function (err, updated) {
    if (err) assert.fail("failed " + util.inspect(err));
    //the form def only has one page and one field
    var page = updated.formSubmittedAgainst.pages[0];
    var field = page.fields[0];
    var val = field.values[0];
    assert.equal("text" , val, "val should have been matched to sub");

    var fileField = updated.formFields[1];
    var fileVal = fileField.fieldValues[0];

    assert.equal("file12345", fileVal.groupId);

    finish();
  });
};















