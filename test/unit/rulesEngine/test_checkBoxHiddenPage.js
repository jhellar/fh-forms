var assert = require('assert');
var formsRulesEngine = require('../../../lib/common/forms-rule-engine.js');


var testForm = {
   "_id":"56c43c1d68aac0fc6f90b745",
   "createdBy":"test@example.com",
   "description":"Blank form with no fields",
   "name":"testform2",
   "updatedBy":"test@example.com",
   "pageRules":[
      {
         "type":"skip",
         "_id":"56d078148977ece111defd47",
         "targetPage":[
            "56d077bef65d7ae31192d6cb"
         ],
         "ruleConditionalStatements":[
            {
               "sourceField":"56cedc1185d349355dfde7bc",
               "restriction":"is",
               "sourceValue":"dddd",
               "_id":"56d078148977ece111defd48"
            }
         ],
         "ruleConditionalOperator":"and",
         "relationType":"and"
      }
   ],
   "fieldRules":[

   ],
   "pages":[
      {
         "_id":"56c43c1d68aac0fc6f90b744",
         "name": "Page 1",
         "fields":[
            {
               "required":true,
               "type":"text",
               "name":"Text Field",
               "fieldCode":null,
               "_id":"56cedc1185d349355dfde7bc",
               "adminOnly":false,
               "fieldOptions":{
                  "validation":{
                     "validateImmediately":true
                  }
               },
               "repeating":false,
               "dataSourceType":"static"
            }
         ]
      },
      {
         "_id":"56d077bef65d7ae31192d6cb",
         "name":"Page 2",
         "fields":[
            {
               "_id":"56d077bef65d7ae31192d6cc",
               "fieldCode":null,
               "name":"Checkbox Field",
               "required":true,
               "type":"checkboxes",
               "adminOnly":false,
               "fieldOptions":{
                  "validation":{
                     "validateImmediately":true,
                     "min":1
                  },
                  "definition":{
                     "options":[
                        {
                           "label":"Option 1",
                           "checked":false
                        },
                        {
                           "label":"Option 2",
                           "checked":false
                        }
                     ]
                  }
               },
               "repeating":false,
               "dataSourceType":"static"
            }
         ]
      }
   ],
   "lastUpdated":"2016-02-26T16:46:47.637Z",
   "dateCreated":"2016-02-25T10:45:54.677Z",
   "lastDataRefresh":"2016-02-26T16:46:47.637Z",
   "pageRef":{
      "56c43c1d68aac0fc6f90b744":0,
      "56d077bef65d7ae31192d6cb":1
   },
   "fieldRef":{
      "56cedc1185d349355dfde7bc":{
         "page":0,
         "field":0
      },
      "56d077bef65d7ae31192d6cc":{
         "page":1,
         "field":0
      }
   }
};

describe('Rules Engine Hidden Page With Required Fields', function(){

  it("Required Checkbox Field With No Entries Hidden Page Should Be Valid", function(done){
    var submission = {
     "_id":null,
     "_type":"submission",
     "_ludid":"56c43c1d68aac0fc6f90b745_submission_1456505217905",
     "_localLastUpdate":"2016-02-26T16:46:57Z",
     "formName":"testform2",
     "formId":"56c43c1d68aac0fc6f90b745",
     "deviceFormTimestamp":1456505207637,
     "createDate":"2016-02-26T16:46:57Z",
     "timezoneOffset":0,
     "appId":"uu3vojkxgmk7wywbwlbv3ci5",
     "appCloudName":"",
     "comments":[

     ],
     "formFields":[
        {
           "fieldId":"56cedc1185d349355dfde7bc",
           "fieldValues":[
              "dddd"
           ]
        },
        {
           "fieldId":"56d077bef65d7ae31192d6cc",
           "fieldValues":[
              {
                 "selections":[

                 ]
              }
           ]
        }
     ],
     "saveDate":null,
     "submitDate":null,
     "uploadStartDate":null,
     "submittedDate":null,
     "userId":null,
     "filesInSubmission":[

     ],
     "deviceId":"",
     "status":"new"
  };


    var engine = formsRulesEngine(testForm);
    engine.validateForm(submission, function (err, result) {
      assert.ok(result.validation.valid, "Expected The Submission To Be Valid " + JSON.stringify(result));
      done();
    });
  });

});
