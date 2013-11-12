require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var lodash = require('lodash');
var assert = require('assert');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var testBigFormId = undefined;
var bigFieldIds = {};

var requiredFormId = undefined;
var requiredFieldIds = {};

var required2FieldIds = {};
var requiredForm2Id = undefined;




var testSubmitFormBaseInfo = {
  "appId": "appId123456",
  "appCloudName": "appCloudName123456",
  "appEnvironment": "devLive",
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
}

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
}

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};



//////////////////////// Testing all of the field types for valid and invalid parameters

module.exports.testSubmitText = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textField"],
    "fieldValues": ["This was some text added.", "This was some text added."]
  }];

  submission.formFields = testValues;


  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitTextTooShort = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textField"],
    "fieldValues": ["tooshort", "tooshort"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
}

module.exports.testSubmitTextTooLong = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textField"],
    "fieldValues": ["ttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnnggggggg", "ttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnnggggggg"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};





module.exports.testSubmitTextArea = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textAreaField"],
    "fieldValues": ["This is a correct length.This is a correct length.", "This is a correct length.This is a correct length."]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitTextAreaTooLong = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textAreaField"],
    "fieldValues": ["ttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnnggggggg", "ttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnngggggggttttttttttoooooooooollllllllllooooooooonnnnnnggggggg"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testSubmitTextAreaTooShort = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["textAreaField"],
    "fieldValues": ["tooshort", "tooshort"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};




module.exports.testSubmitFile = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["fileField"],
    "fieldValues": ["filePlaceHolderhash123456", "filePlaceHolder124124"]
  }];

  submission.formFields = testValues;


  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitFileWrongPlaceholder = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["fileField"],
    "fieldValues": ["filePlaceHolderhash123456", "wrongGierlsfdsfdsf"]
  }];

  submission.formFields = testValues;


  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};



module.exports.testSubmitRadio = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["radioField"],
    "fieldValues": [{
      "values" : [{
        "key" : "radioVal1",
        "value": 20
      }]
    },{
      "values" : [{
        "key" : "radioVal3",
        "value": 130
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitRadioWrongOption = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["radioField"],
    "fieldValues": [{
      "values" : [{
        "key" : "radioVal1",
        "value": 20
      }]
    },{
      "values" : [{
        "key" : "wrongRadioVal",
        "value": 130
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};








module.exports.testSubmitCheckBox = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["checkboxField"],
    "fieldValues": [{
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "blue",
        "value": 2
      },{
        "key" : "purple",
        "value": 4
      }]
    }, {
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "green",
        "value": 3
      },{
        "key" : "blue",
        "value": 2
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitCheckBoxWrongOption = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["checkboxField"],
    "fieldValues": [{
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "blue",
        "value": 2
      },{
        "key" : "purple",
        "value": 4
      }]
    }, {
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "green",
        "value": 3
      },{
        "key" : "wrong",
        "value": 14
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testSubmitCheckBoxTooFewOptions = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["checkboxField"],
    "fieldValues": [{
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "blue",
        "value": 2
      },{
        "key" : "purple",
        "value": 4
      }]
    }, {
      "values" : [{
        "key" : "red",
        "value": 1
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testSubmitCheckBoxTooManyOptions = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["checkboxField"],
    "fieldValues": [{
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "blue",
        "value": 2
      },{
        "key" : "purple",
        "value": 4
      }]
    }, {
      "values" : [{
        "key" : "red",
        "value": 1
      },{
        "key" : "green",
        "value": 3
      },{
        "key" : "purple",
        "value": 4
      },{
        "key" : "black",
        "value": 5
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};







module.exports.testSubmitNumber = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["numberField"],
    "fieldValues": [{
      "values" : 12
    }, {
      "values" : 12
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitNumberNotANumber = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["numberField"],
    "fieldValues": [{
      "values" : [12, "I'm not a number"]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testSubmitNumberTooBig = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["numberField"],
    "fieldValues": [{
      "values" : [12, 1234212332]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testSubmitNumberTooSmall = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["numberField"],
    "fieldValues": [{
      "values" : [12, -34]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};




module.exports.testSubmitLocationLatLong = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["locationLatLongField"],
    "fieldValues": [{
      "values" : [{
        "key" : "lat",
        "value": "5.555848"
      },{
        "key" : "long",
        "value": "-52.031250"
      }]
    },{
      "values" : [{
        "key" : "lat",
        "value": "23.555848"
      },{
        "key" : "long",
        "value": "-54.031250"
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitLocationLatLongInvalid = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["locationLatLongField"],
    "fieldValues": [{
      "values" : [{
        "key" : "lat",
        "value": 5.555848
      },{
        "key" : "long",
        "value": -52.031250
      }]
    },{
      "values" : [{
        "key" : "lat",
        "value": "I am not a lat"
      },{
        "key" : "long",
        "value": "I am not a long"
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};





module.exports.testSubmitLocationNorthEast = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["locationNorthEastField"],
    "fieldValues": [{
      "values" : [{
        "key" : "eastings",
        "value": 355644
      },{
        "key" : "northings",
        "value": 5886712
      }]
    },{
      "values" : [{
        "key" : "eastings",
        "value": 396344
      },{
        "key" : "northings",
        "value": 5862312
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitLocationNorthEastInvalid = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["locationNorthEastField"],
    "fieldValues": [{
      "values" : [{
        "key" : "eastings",
        "value": 355644
      },{
        "key" : "northings",
        "value": 5886712
      }]
    },{
      "values" : [{
        "key" : "eastings",
        "value": "I am not an easting"
      },{
        "key" : "northings",
        "value": "I am not a northing"
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};



module.exports.testSubmitDate = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["dateField"],
    "fieldValues": [Date.now(), Date.now()]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitDateInvalid = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["dateField"],
    "fieldValues": [Date.now(), "14*23452346/235236"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};




module.exports.testSubmitDateTime = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["dateTimeField"],
    "fieldValues": [Date.now(), Date.now()]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitDateTimeInvalid = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["dateTimeField"],
    "fieldValues": [Date.now(), "5/11/13 332523:05:54"]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};







//module.exports.testSubmitMatrix = function(finish){
//  var submission = testSubmitFormBaseInfo;
//  submission.formId = testBigFormId;
//
//  var testValues = [{
//    "fieldId" : bigFieldIds["matrixField"],
//    "fieldValues": [{
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol1"
//      },{
//        "key" : "matrow2",
//        "value": "matCol3"
//      },{
//        "key" : "matrow3",
//        "value": "matCol2"
//      }]
//    }, {
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol2"
//      },{
//        "key" : "matrow2",
//        "value": "matCol4"
//      },{
//        "key" : "matrow3",
//        "value": "matCol5"
//      }]
//    }]
//  }];
//
//  submission.formFields = testValues;
//
//  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
//    finish();
//  });
//};
//
//module.exports.testSubmitMatrixInvalidRow = function(finish){
//  var submission = testSubmitFormBaseInfo;
//  submission.formId = testBigFormId;
//
//  var testValues = [{
//    "fieldId" : bigFieldIds["matrixField"],
//    "fieldValues": [{
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol1"
//      },{
//        "key" : "matrow22",
//        "value": "matCol3"
//      },{
//        "key" : "matrow3",
//        "value": "matCol2"
//      }]
//    }, {
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol2"
//      },{
//        "key" : "matrow2",
//        "value": "matCol4"
//      },{
//        "key" : "matrow3",
//        "value": "matCol5"
//      }]
//    }]
//  }];
//
//  submission.formFields = testValues;
//
//  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
//    finish();
//  });
//};
//
//module.exports.testSubmitMatrixInvalidCol = function(finish){
//  var submission = testSubmitFormBaseInfo;
//  submission.formId = testBigFormId;
//
//  var testValues = [{
//    "fieldId" : bigFieldIds["matrixField"],
//    "fieldValues": [{
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol1"
//      },{
//        "key" : "matrow22",
//        "value": "matCol3"
//      },{
//        "key" : "matrow3",
//        "value": "matCol2"
//      }]
//    }, {
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol2"
//      },{
//        "key" : "matrow2",
//        "value": "matCol4"
//      },{
//        "key" : "matrow3",
//        "value": "matCol54"
//      }]
//    }]
//  }];
//
//  submission.formFields = testValues;
//
//  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
//    finish();
//  });
//};
//
//module.exports.testSubmitMatrixInvalidMissingValue = function(finish){
//  var submission = testSubmitFormBaseInfo;
//  submission.formId = testBigFormId;
//
//  var testValues = [{
//    "fieldId" : bigFieldIds["matrixField"],
//    "fieldValues": [{
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol1"
//      },{
//        "key" : "matrow22",
//        "value": "matCol3"
//      },{
//        "key" : "matrow3",
//        "value": "matCol2"
//      }]
//    }, {
//      "values" : [{
//        "key" : "matrow1",
//        "value": "matCol2"
//      },{
//        "key" : "matrow2",
//        "value": "matCol4"
//      }]
//    }]
//  }];
//
//  submission.formFields = testValues;
//
//  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
//    finish();
//  });
//};




module.exports.testSaveRequiredFields = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = requiredFormId;

  var testValues = [{
    "fieldId" : requiredFieldIds["requiredTextField1"],
    "fieldValues": ["This was some required text added requiredTextField1.", "This was some required text added requiredTextField1."]
  }, {
    "fieldId" : requiredFieldIds["requiredTextField2"],
    "fieldValues": ["This was some required text added requiredTextField2.", "This was some required text added requiredTextField2."]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};


module.exports.testDidNotSaveRequiredField = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = requiredFormId;

  var testValues = [{
    "fieldId" : requiredFieldIds["requiredTextField1"],
    "fieldValues": ["This was some required text added.", "This was some required text added."]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};

module.exports.testDidNotSaveRequiredFieldFormUpdated = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = requiredFormId;



  var testValues = [{
    "fieldId" : requiredFieldIds["requiredTextField1"],
    "fieldValues": ["This was some required text added requiredTextField1.", "This was some required text added requiredTextField1."]
  }, {
    "fieldId" : requiredFieldIds["requiredTextField2"],
    "fieldValues": ["This was some required text added requiredTextField2.", "This was some required text added requiredTextField2."]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){

    //Submission was successfull as it is valid.

    //Adding another required field and try agai
    addNewField(assert, requiredFormId, true, function(err){
      assert.ok(!err);

      //New page is now saved. Try the submission again -- should fail and return the current form definition
      submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true, "newFormDefinition": true}, function(){
        finish();
      });
    });
  });
};

module.exports.testSaveRequiredFieldsFormUpdated = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = requiredForm2Id;

  var testValues = [{
    "fieldId" : required2FieldIds["requiredTextField1"],
    "fieldValues": ["This was some required text added requiredTextField1.", "This was some required text added requiredTextField1."]
  }, {
    "fieldId" : required2FieldIds["requiredTextField2"],
    "fieldValues": ["This was some required text added requiredTextField2.", "This was some required text added requiredTextField2."]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){

    addNewField(assert, requiredForm2Id, false, function(err){
      assert.ok(!err);

      submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
        finish();
      });
    });
  });
};


function addNewField(assert, formId, fieldRequired, cb){
  //Need to create a form that contains every possible field type.
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  //Creating a theme
  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);


  var newRequiredField = new Field({
    "name":"newRequiredField",
    "helpText":"This is a new required text field",
    "type":"text",
    "repeating":true,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      },
      "validation":{
        "min":20,
        "max":100
      }
    },
    "required":fieldRequired
  });

  newRequiredField.save(function(err){
    assert.ok(!err);

    Form.findOne({"_id" : formId}).populate("pages").exec(function(err, result){
      assert.ok(!err);
      assert.ok(result);
      assert.ok(result.pages);
      assert.ok(Array.isArray(result.pages));
      assert.ok(result.pages[0]);

      //Update the page
      Page.findOne({"_id": result.pages[0]._id}, function(err, foundPage){
        assert.ok(!err);

        foundPage.fields.push(newRequiredField._id);
        foundPage.save(function(err){
          assert.ok(!err);

          connection.close(function(err){
            if(err) console.log(err);

            return cb();
          });
        });
      });
    });
  });
}

function verifyFieldExists(assert, formId, newRequiredFieldId, cb){
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  //Creating a theme
  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);

  Form.findOne({"_id" : formId}).populate("pages").exec(function(err, result){
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result.pages);
    assert.ok(Array.isArray(result.pages));
    assert.ok(result.pages[0]);

    Form.populate(result, {"path": "pages.fields", "model": Field, "select": "-__v -fieldOptions._id"}, function(err, updatedResult){
      assert.ok(!err);

      cb();
    });
  });
}

module.exports.testSubmitSelect = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["selectField"],
    "fieldValues": [{
      "values" : [{
        "key" : "selectval1",
        "value": 32
      }]
    },{
      "values" : [{
        "key" : "selectval2",
        "value": 33
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": false}, function(){
    finish();
  });
};

module.exports.testSubmitSelectWrongOption = function(finish){
  var submission = testSubmitFormBaseInfo;
  submission.formId = testBigFormId;

  var testValues = [{
    "fieldId" : bigFieldIds["selectField"],
    "fieldValues": [{
      "values" : [{
        "key" : "selectval1",
        "value": 32
      }]
    },{
      "values" : [{
        "key" : "selectval3",
        "value": 130
      }]
    }]
  }];

  submission.formFields = testValues;

  submitAndCheckForm(assert, submission, {"uri": process.env.FH_DOMAIN_DB_CONN_URL,  "expectedSubmissionJSON" : submission, "errExpected": true}, function(){
    finish();
  });
};


function checkSubmissionExists(assert, submissionId, options, cb){
  //Need to create a form that contains every possible field type.
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var FormSubmission = models.get(connection, models.MODELNAMES.FORM_SUBMISSION);

  FormSubmission.findOne({"_id": submissionId}, function(subErr, result){
    assert.ok(!subErr);
    assert.ok(result);

    //submissionId, timestamp are dynamic, need to check they exist first.
    assert.ok(result.masterFormTimestamp); //Checking for the masterFormTimestamp
    assert.ok(result.deviceFormTimestamp); //Checking for the masterFormTimestamp
    assert.ok(result.submissionStartedTimestamp); //Checking for the masterFormTimestamp

    var submissionJSON = result.toJSON();

    //timestamp, formId, submissionId already checked.
    delete submissionJSON._id;
    delete submissionJSON.masterFormTimestamp;
    delete submissionJSON.submissionStartedTimestamp;

    //Now full comparison with the expected form submission definition.
    var expectedSubmissionJSON = options.expectedSubmissionJSON;
    expectedSubmissionJSON.status = "pending";//Status for these tests will always be pending

    assert.ok(lodash.isEqual(expectedSubmissionJSON, submissionJSON), "Expected " + JSON.stringify(expectedSubmissionJSON) + " but got " + JSON.stringify(submissionJSON));

    connection.close(function(err){
      if(err) console.log("Mongoose Conn Err", err);

      cb(subErr, result);
    });
  });
}


function submitAndCheckForm(assert, submission, options, cb ){
  forms.submitFormData({"uri" : process.env.FH_DOMAIN_DB_CONN_URL, "submission" : submission}, function(err, result){
    if(options.errExpected){
      if(result) console.log(result);
      assert.ok(err);
      assert.ok(!result);
      return cb();
    } else {
      if(err) console.log(err);
      assert.ok(!err);
      assert.ok(result);
      assert.ok(result.submissionId);

      if(options.newFormDefinition){
        assert.ok(result.updatedFormDefinition);
      }

      checkSubmissionExists(assert, result.submissionId, options, function(err){
        assert.ok(!err);
        return cb();
      });
    }
  });
}



function createTestData(assert, cb){

  //Need to create a form that contains every possible field type.
  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  //Creating a theme
  var Form = models.get(connection, models.MODELNAMES.FORM);
  var Field = models.get(connection, models.MODELNAMES.FIELD);
  var Page = models.get(connection, models.MODELNAMES.PAGE);
  var PageRule = models.get(connection, models.MODELNAMES.PAGE_RULE);
  var FieldRule = models.get(connection, models.MODELNAMES.FIELD_RULE);



  async.series([saveBigForm, saveRequiredForm, saveNotRequiredForm], function(err){
    assert.ok(!err);

    connection.close(function(err){
      if (err) console.log(err);
      assert.ok(!err);

      return cb();
    });
  });

  function saveNotRequiredForm(cb){
    var requiredForm = new Form({"updatedBy" : "user2@example.com", "name" : "requiredForm2", "description": "This form2 is for testing required fields."});
    var testRequiredPage = new Page({"name" : "testRequiredPage2", "description": "This is a test page for required fields."});
    var fields = [];

    var requiredField1 = new Field({
      "name":"requiredTextField1",
      "helpText":"This is a required text field",
      "type":"text",
      "repeating":true,
      "fieldOptions":{
        "definition":{
          "maxRepeat":5,
          "minRepeat":2
        },
        "validation":{
          "min":20,
          "max":100
        }
      },
      "required":true
    });
    var requiredField2 = new Field({
      "name":"requiredTextField2",
      "helpText":"This is another required text field",
      "type":"text",
      "repeating":true,
      "fieldOptions":{
        "definition":{
          "maxRepeat":5,
          "minRepeat":2
        },
        "validation":{
          "min":20,
          "max":100
        }
      },
      "required":true
    });
    fields.push(requiredField1);
    fields.push(requiredField2);

    saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
      assert.ok(!err);
      assert.ok(formId);

      required2FieldIds = fieldIds;
      requiredForm2Id = formId;
      cb();
    });
  }

  function saveBigForm(cb){
    var testFieldsForm = new Form({"updatedBy" : "user@example.com", "name" : "testFieldsForm", "description": "This form is for testing fields."});
    var testPage = new Page({"name" : "testPage", "description": "This is a test page for the win."});

    var testData = require("./../Fixtures/formSubmissions.js");

    var textField = new Field(testData.textFieldData);
    var textAreaField = new Field(testData.textAreaFieldData);
    var numberField = new Field(testData.numberFieldData);
    var emailAddressField = new Field(testData.emailAddressFieldData);
    var radioField = new Field(testData.radioFieldData);
    var selectField = new Field(testData.selectFieldData);
    var matrixField = new Field(testData.matrixFieldData);
    var checkboxField = new Field(testData.checkboxFieldData);
    var locationLatLongField = new Field(testData.locationLatLongFieldData);
    var locationNorthEastField = new Field(testData.locationNorthEastFieldData);
    var locationMapField = new Field(testData.locationMapFieldData);
    var dateField = new Field(testData.dateFieldData);
    var timeField = new Field(testData.timeFieldData);
    var dateTimeField = new Field(testData.dateTimeFieldData);
    var sectionBreakField = new Field(testData.sectionBreakFieldData);
    var sectionBreak2Field = new Field(testData.sectionBreak2FieldData);
    var fileField = new Field(testData.fileFieldData);
    var photoField = new Field(testData.photoFieldData);
    var signatureField = new Field(testData.photoFieldData);


    var fields = [];
    fields.push(textField);
    fields.push(textAreaField);
    fields.push(numberField);
    fields.push(sectionBreakField);
    fields.push(emailAddressField);
    fields.push(radioField);
    fields.push(matrixField);
    fields.push(checkboxField);
    fields.push(selectField);
    fields.push(locationLatLongField);
    fields.push(sectionBreak2Field);
    fields.push(locationNorthEastField);
    fields.push(locationMapField);
    fields.push(dateField);
    fields.push(timeField);
    fields.push(dateTimeField);
    fields.push(fileField);
    fields.push(photoField);
    fields.push(signatureField);


    var testPageRule1 = new PageRule({
      "type": "skip",
      "restriction": "contains",
      "sourceValue": "Something"
    });
    var testPageRule2 = new PageRule({
      "type": "skip",
      "restriction": "isNot",
      "sourceValue": "Something Else"
    });
    var testPageRule3 = new PageRule({
      "type": "skip",
      "restriction": "is",
      "sourceValue": "Some Other Thing"
    });


    var testFieldRule1 = new FieldRule({
      "type": "show",
      "restriction": "contains",
      "sourceValue": "Something"
    });
    var testFieldRule2 = new FieldRule({
      "type": "hide",
      "restriction": "contains",
      "sourceValue": "Something"
    });
    var testFieldRule3 = new FieldRule({
      "type": "show",
      "restriction": "contains",
      "sourceValue": "Something"
    });

    saveSingleForm(fields, testPage, testFieldsForm, function(err, formId, fieldIds){
      assert.ok(!err);
      assert.ok(formId);
      assert.ok(fieldIds);

      bigFieldIds = fieldIds;
      testBigFormId = formId;
      cb();
    });
  }

  function saveRequiredForm(cb){
    var requiredForm = new Form({"updatedBy" : "user@example.com", "name" : "requiredForm", "description": "This form is for testing required fields."});
    var testRequiredPage = new Page({"name" : "testRequiredPage", "description": "This is a test page for required fields."});
    var fields = [];

    var requiredField1 = new Field({
      "name":"requiredTextField1",
      "helpText":"This is a required text field",
      "type":"text",
      "repeating":true,
      "fieldOptions":{
        "definition":{
          "maxRepeat":5,
          "minRepeat":2
        },
        "validation":{
          "min":20,
          "max":100
        }
      },
      "required":true
    });
    var requiredField2 = new Field({
      "name":"requiredTextField2",
      "helpText":"This is another required text field",
      "type":"text",
      "repeating":true,
      "fieldOptions":{
        "definition":{
          "maxRepeat":5,
          "minRepeat":2
        },
        "validation":{
          "min":20,
          "max":100
        }
      },
      "required":true
    });
    fields.push(requiredField1);
    fields.push(requiredField2);

    saveSingleForm(fields, testRequiredPage, requiredForm, function(err, formId, fieldIds){
      assert.ok(!err);
      assert.ok(formId);
      assert.ok(fieldIds);

      requiredFieldIds = fieldIds;
      requiredFormId = formId;
      cb();
    });
  }

  function saveSingleForm(fields, testPage, testFieldsForm, cb){
    var globalFormId = undefined;
    var fieldIds = {};
    async.series([saveFields, savePage, saveForm], function(err){
      if(err) console.log(err);
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