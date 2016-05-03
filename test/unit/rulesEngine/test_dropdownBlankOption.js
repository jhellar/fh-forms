var assert = require('assert');
var formsRulesEngine = require('../../../lib/common/forms-rule-engine.js');


/**
 * getMockDropdownForm - Getting a form definition
 *
 * @param  {boolean} include_blank_option Expecting whether the blank option should available or not
 * @return {object}                      Full form JSON definition
 */
function getMockDropdownForm(include_blank_option){
  return {
    "_id": "57287eb49b71a8c37fda4849",
    "name": "Test Dropdown Form",
    "pageRules": [],
    "fieldRules": [],
    "pages": [{
      "_id": "57287eb49b71a8c37fda4848",
      "fields": [{
        "required": true,
        "type": "dropdown",
        "name": "Dropdown",
        "fieldCode": null,
        "_id": "57287ec59b71a8c37fda484a",
        "adminOnly": false,
        "fieldOptions": {
          "validation": {
            "validateImmediately": true
          },
          "definition": {
            "options": [{
              "label": "Option 1",
              "checked": false
            }, {
              "label": "Option 2",
              "checked": false
            }],
            "include_blank_option": include_blank_option
          }
        },
        "repeating": false,
        "dataSourceType": "static"
      }]
    }],
    "pageRef": {
      "57287eb49b71a8c37fda4848": 0
    },
    "fieldRef": {
      "57287ec59b71a8c37fda484a": {
        "page": 0,
        "field": 0
      }
    }
  };
}



/**
 * getMockSubmission - Getting a submission with the require form fields
 *
 * @param  {type} formFields description
 * @return {type}            description
 */
function getMockSubmission(formFields) {

  return {
    "_id": null,
    "_type": "submission",
    "_ludid": "56c43c1d68aac0fc6f90b745_submission_1456505217905",
    "_localLastUpdate": "2016-02-26T16:46:57Z",
    "formName": "testform2",
    "formId": "56c43c1d68aac0fc6f90b745",
    "deviceFormTimestamp": 1456505207637,
    "createDate": "2016-02-26T16:46:57Z",
    "timezoneOffset": 0,
    "appId": "uu3vojkxgmk7wywbwlbv3ci5",
    "appCloudName": "",
    "comments": [

    ],
    "formFields": formFields,
    "saveDate": null,
    "submitDate": null,
    "uploadStartDate": null,
    "submittedDate": null,
    "userId": null,
    "filesInSubmission": [

    ],
    "deviceId": "",
    "status": "new"
  };
}

describe("Dropdown Fields", function() {

  var dropdownFieldId = "57287ec59b71a8c37fda484a";

  it("Supplying a valid option is valid", function(done) {
    var formFields = [
      {
        fieldId: dropdownFieldId,
        fieldValues:[
          "Option 1"
        ]
      }
    ];
    var mockForm = getMockDropdownForm(true);
    var mockSubmission = getMockSubmission(formFields);

    var engine = formsRulesEngine(mockForm);
    engine.validateForm(mockSubmission, function(err, result) {
      assert.ok(!err, "Expected no error ");
      assert.ok(result.validation.valid, "Epected The Submisison To Be Valid " + JSON.stringify(result));
      done();
    });
  });

  it("Supplying an invalid option is not valid", function(done) {
    var formFields = [
      {
        fieldId: dropdownFieldId,
        fieldValues:[
          "WRONG VALUE"
        ]
      }
    ];
    var mockForm = getMockDropdownForm(true);
    var mockSubmission = getMockSubmission(formFields);

    var engine = formsRulesEngine(mockForm);
    engine.validateForm(mockSubmission, function(err, result) {
      assert.ok(!err, "Expected no error ");
      assert.ok(!result.validation.valid, "Epected The Submisison To Be Invalid " + JSON.stringify(result));
      done();
    });
  });


  describe('Blank Option', function() {

    it("Blank Option Enabled: Supplying an empty string is valid", function(done) {
      var formFields = [
        {
          fieldId: dropdownFieldId,
          fieldValues:[
            ""
          ]
        }
      ];

      var mockForm = getMockDropdownForm(true);
      var mockSubmission = getMockSubmission(formFields);

      var engine = formsRulesEngine(mockForm);
      engine.validateForm(mockSubmission, function(err, result) {
        assert.ok(!err, "Expected no error ");
        assert.ok(result.validation.valid, "Epected The Submisison To Be Valid " + JSON.stringify(result));
        done();
      });
    });

    it("Blank Option Enabled: Supplying no value is valid", function(done) {
      var formFields = [
        {
          fieldId: dropdownFieldId,
          fieldValues:[]
        }
      ];

      var mockForm = getMockDropdownForm(true);
      var mockSubmission = getMockSubmission(formFields);

      var engine = formsRulesEngine(mockForm);
      engine.validateForm(mockSubmission, function(err, result) {
        assert.ok(!err, "Expected no error ");
        assert.ok(result.validation.valid, "Epected The Submisison To Be Valid " + JSON.stringify(result));
        done();
      });
    });

    it("Blank Option Enabled: Supplying no field is valid", function(done) {
      var formFields = [
      ];

      var mockForm = getMockDropdownForm(true);
      var mockSubmission = getMockSubmission(formFields);

      var engine = formsRulesEngine(mockForm);
      engine.validateForm(mockSubmission, function(err, result) {
        assert.ok(!err, "Expected no error ");
        assert.ok(result.validation.valid, "Epected The Submisison To Be Valid " + JSON.stringify(result));
        done();
      });
    });

    it("Blank Option Disabled: Supplying an empty string is Invalid", function(done) {
      var formFields = [
        {
          fieldId: dropdownFieldId,
          fieldValues:[
            ""
          ]
        }
      ];

      var mockForm = getMockDropdownForm(false);
      var mockSubmission = getMockSubmission(formFields);

      var engine = formsRulesEngine(mockForm);
      engine.validateForm(mockSubmission, function(err, result) {
        assert.ok(!err, "Expected no error ");
        assert.ok(!result.validation.valid, "Epected The Submisison To Be Invalid " + JSON.stringify(result));
        done();
      });
    });

    it("Blank Option Disabled: Supplying no value is Invalid", function(done) {
      var formFields = [
        {
          fieldId: dropdownFieldId,
          fieldValues:[]
        }
      ];

      var mockForm = getMockDropdownForm(false);
      var mockSubmission = getMockSubmission(formFields);

      var engine = formsRulesEngine(mockForm);
      engine.validateForm(mockSubmission, function(err, result) {
        assert.ok(!err, "Expected no error ");
        assert.ok(!result.validation.valid, "Epected The Submisison To Be Invalid " + JSON.stringify(result));
        done();
      });
    });

  });

});
