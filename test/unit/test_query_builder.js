var queryBuilder = require('../../lib/impl/searchSubmissions').queryBuilder;
var util = require('util');
var assert = require('assert');

exports.testBasicQuery = function (finish){
  var queryParams = {
    formId: "529362a4acdffbcf17000001",
    "clauseOperator": "or",
    "queryFields": {
    "clauses": [
      {
        "fieldId": "529362a4acdffbcf17000003",
        "restriction": "contains",
        "value": ".test"
      }
    ]
    },
    "queryMeta":{
      "clauses":[
        {
          "metaName":"deviceIPAddress",
          "restriction":"does not contain",
          "value":"10.0.2.2"
        }
      ]
    }
  };
  console.log("test basic query");
  queryBuilder(queryParams, function (err, query){
    assert.ok(! err, "error should not be set ", util.inspect(err));
    console.log("query returned ", query);
    assert.ok(query, " there should be a query returned");
    assert.ok(query["$and"][0]);
    assert.ok(query["$and"][1].formId === queryParams.formId);
    var fieldValue = query["$and"][2]["$or"][0].formFields["$elemMatch"].fieldValues;
    console.log(query["$and"][2]["$or"][0].formFields["$elemMatch"].fieldValues);
    assert.ok(fieldValue.toString() === /.*\.test.*$/.toString());
    finish();
  });

};


