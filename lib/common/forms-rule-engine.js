
/*
Sample Usage 
var options = {
  "submission" : form-submission
  "definition" : form-definition
};
var engine = formsRulesEngine(options);
engine.validateForms(function(err, res) {});
OR
engine.validateField({"fieldId":123456789}, function(err,res) {});
*/

var formsRulesEngine = function(options) {
  /*
    options.form.submission = form submission data
    options.form.definition = form definition data
  */

  var self = this;

  var submission = options.submission;
  var definition = options.definition;

  var fieldMap;
  var fieldRulePredicateMap;
  var fieldRuleSubjectMap;
  var pageRulePredicateMap;
  var pageRuleSubjectMap;
  
  var init = function() {
    var initCallback = function(err) {
      if( err ) console.error('error init rules engine - ', err);
    };

    async.parallel([
      buildFieldMap(),
      buildFieldRuleMap(),
      buildPageRuleMap()
    ], initCallback);
  }

  var validateForm = function(cb) {
    var res = {"errors":[]};
    // for each field, call validateField
    async.each(submission.fields, function(item, callback) {
      validateField({"fieldId":item._id, function(err, res) {
        if(err) {
          res.errors.push(err);
        }
        callback();
      })

    }, function(err) {
      if( err ) {
        return cb(err);
      }
      cb(null, res);
    });
  };

  var validateField = function(options, cb) {
    /*
      options.fieldId = Id of field to check for reule predeciate references 
    */
  }

  var isFieldRequired = function(option, cb) {
   /*
      options.fieldId = Id of field to check for reule predeciate references 
    */ 
  }

  var isFieldVisable = function(options, cb) {
   /*
      options.fieldId = Id of field to check for reule predeciate references 
    */

    // Fields are visable by default
    var visable = true;
    var ruleResults = [];

    // If the field is the subject of a rul it may hav been hidden
    if( self.isRuleSubject(options) ) {
      // Itterate over each rule that this field is a predicate of
      async.each(self.fieldRuleSubjectMap(options.fieldId), function(rule, cbRule) {
        // For each rule, itterate over the predicate fields and evaluate the rule
        var predicateMapQueries = [];
        var predicateMapPassed = [];
        async.each(rule.predicates, function(predicates, cbPredicates) {
          var field = self.fieldMap[predicates.sourceId];
          var submissionValues = self.submission.fields[field];
          var condition = predicate.condition;
          var testValue = predicate.sourceValue;

          // Validate rule predictes on the first entry only.
          var passed = self.validateFieldValue(field, submissionValues[0], testValue, condition);
          predicateMapQueries.push({"field", field, 
                                    "submissionValues", submissionValues, 
                                    "condition", condition,
                                    "testValue": testValue,
                                    "passed" : passed
                                  });

          if( passed ) {
            predicateMappassed.push(field);
          }
          cbPredicates();
        }, function(err) {
          var isVisable = true;
          if( rule.conjunction === "and" ) {
            if( predicateMappassed.length != predicateMapQueries.length ) {
              if( rule.targetMode === "hide") {
                isVisable = false;
              }
            } 
          } else if rule.conjunction === "or" ) {
            if( rule.targetMode === "hide") {
              if( predicateMappassed.length > 0 ) {
                // At least one of the "or" checks passed, so field is to be hidden
                isVisable = false;
              }
            }
          } else {
            // error
            isVisable = false;
          }
          ruleResults.push(isVisable);
        });
      }, function(err) {
        var isFieldVisable = ruleResults.pop();

        if( isFieldVisable ) {
          var field = self.fieldMap[options.fieldId];
          var pageId = field.pageId;
          if( self.isPageRuleSubject({"pageId":page}) ) {
           // TODO - check if field is hidden because page is hidden
          }
          else {
            return cb(null, isFieldVisable);
          }
        }
      });
    }
  }

  var isRulePredeciate = function(options) {
   /*
      options.fieldId = Id of field to check for reule predeciate references 
    */ 
    return self.rulePredicateMap[options.fieldId] != null;
  }

  var isFieldRuleSubject = function(options) {
   /*
      options.fieldId = Id of field to check for reule subject references 
    */ 
    return self.pageRuleSubjectMap[options.fieldId] != null;
  }

  var isPageRuleSubject = function(options) {
   /*
      options.pageId = Id of page to check for rule subject references 
    */ 
    return self.pageRuleSubjectMap[options.fieldId] != null;
  }

  /* Private functions */

  function buildFieldMap(options, cb) {
    /* 
      options = empty json!
    */

    // Itterate over all fields in form definition & build fieldMao 
    async.each(self.definition.pages, function(pages, cbPages) {
      async.each(pages.fields, function(fields, cbFields) {
        fields.pageId = pages._id;
        self.fieldMap[fields._id] = fields;
        cbFields();
      }, self.genericComplete);
      cbPages();
    }, cb);
  }


  function buildFieldRuleMap(options, cb) {
    /* 
      options = empty json!
    */

    // Itterate over all rules in form definition & build ruleSubjectMap 
    // and rulePredicateMap keyed on field id with array of rule ids - e.g.
    //    ruleSubjectMap[fieldId] = ruleSubjectMap[fieldId] || [];
    //    ruleSubjectMap[fieldId].push(ruleId);

    async.each(self.definition.fieldRules, function(rules, cbRules) {
      async.each(rules.predicates, function(rulePredicates, cbRulePredicates) {
        self.fieldRulePredicateMap[fieldId] = self.fieldRulePredicateMap[fieldId] || [];
        self.fieldRulePredicateMap[fieldId].push(rules._id);
        cbRulePredicates();
      }, self.genericComplete);
      self.fieldRuleSubjectMap[fieldId] = self.fieldRuleSubjectMap[fieldId] || [];
      self.fieldRuleSubjectMap[fieldId].push(rules.id);
      cbRules();
    }, cb);  
  }

  function buildPageRuleMap(options, cb) {
    /* 
      options = empty json!
    */
    // Itterate over all rules in form definition & build ruleSubjectMap 
    // and rulePredicateMap keyed on field id with array of rule ids - e.g.
    //    ruleSubjectMap[fieldId] = ruleSubjectMap[fieldId] || [];
    //    ruleSubjectMap[fieldId].push(ruleId);

    async.each(self.definition.fieldRules, function(rules, cbRules) {
      var rulesId = rules._id;
      async.each(rules.predicates, function(rulePredicate, cbRulePredicates) {
        var fieldId = rulePredicate.sourceId;
        self.pageRulePredicateMap[fieldId] = self.pageRulePredicateMap[fieldId] || [];
        self.pageRulePredicateMap[fieldId].push(rulesId);
        cbRulePredicates();
      }, self.genericComplete);
      self.pageRuleSubjectMap[pageId] = self.pageRuleSubjectMap[pageId] || [];
      self.pageRuleSubjectMap[pageId].push(rulesId);
      cbRules();
    }, cb);
  }

  var genericComplete = function(){};

  init();

  return {
    validateForm: this.validateForm
  };
}

function validateFieldValue(field, fieldValue, testValue, condition) {

  var fieldType = field.type

  var valid = true;
  // Possible conditions:
  // "is not","is equal to","is greater than","is less than","is at",
  // "is before","is after","is", "contains", "does not contain", 
  // "begins with", "ends with"

  if( "is equal to" === condition) {
    valid = fieldValue === testValue;
  }
  else if( "is not" === condition) {
    valid = fieldValue === testValue;
  }
  else if( "is greater than" === condition) {
    // TODO - do numeric checking
    valid = fieldValue > testValue;
  }
  else if( "is less than" === condition) {
    // TODO - do numeric checking
    valid = fieldValue < testValue;
  }
  else if( "is at" === condition) {
    var valid = false;
    if( fieldType === "datestamp" ) {
      // TODO Do date comparison between fieldValue and testValue
    }
    valid =  valid;
  }
  else if( "is before" === condition) {
    var valid = false;
    if( fieldType === "datestamp" ) {
      // TODO Do date comparison between fieldValue and testValue
    }
    valid =  valid;
  }
  else if( "is after" === condition) {
    var valid = false;
    if( fieldType === "datestamp" ) {
      // TODO Do date comparison between fieldValue and testValue
    }
    valid =  valid;
  }
  else if( "is" === condition) {
    // TODO
    valid = fieldValue === testValue;
  }
  else if( "contains" === condition) {
    valid = fieldValue.indexOf(testValue) !== -1;
  }
  else if( "does not contain" === condition) {
      valid = fieldValue.indexOf(testValue) === -1;
  }
  else if( "begins with" === condition) {
    valid = fieldValue.substring(0, testValue.length) === testValue;
  }
  else if( "ends with" === condition) {
    valid = fieldValue.substring(fieldValue.length - testValue.length, fieldValue.length) === testValue;
  }
  else {
    valid = false;
  }
  return valid;
}

modules.exports = formsRulesEngine;