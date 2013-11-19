var async = require('async');
var util = require('util');
var models = require('../common/models.js')();
var validation = require('./../common/validate');

var Rules = {
  FIELD_RULE: 'fieldRules',
  PAGE_RULE: 'pageRules'
};

/*
 * updateFieldRules(connections, options, formData, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    fieldRules: {
 *      formId: id of parent form
 *      rules: fieldrules
 *    }
 *
 *    cb  - callback function (err)
 *
 */
module.exports = function updateFieldRules(connections, options, fieldRules, cb) {
  var validate = validation(fieldRules);
  function validateParams(cb) {
    validate.has("formId","rules",cb);
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var formModel = models.get(conn, models.MODELNAMES.FORM);
    var fieldRulesModel = models.get(conn, models.MODELNAMES.FIELD_RULE);
    doUpdate(connections, options, fieldRules, formModel, fieldRulesModel, Rules.FIELD_RULE, cb);
  });
};

function doUpdate(connections, options, rules, formModel, rulesModel, ruleType, cb){
  var form;

  // iterate through the form field rules vs the new rules
  function createRules(rules, cb) {
    function addRule(fieldRule, cb1) {
      if (fieldRule._id) return cb();

      var fr = new rulesModel(fieldRule);
      fr.save(function(err, frdoc) {
        if(err) return cb(err);
        form[ruleType].push(frdoc);
        return cb1(null, frdoc);
      });
    };

    async.mapSeries(rules, addRule, cb);
  };

  // process any updates
  function updateRules(rules, cb) {
    function updateRule(fieldRule, cb1) {
      if (!fieldRule._id) return cb1();

      var id = fieldRule._id;
      var fr = JSON.parse(JSON.stringify(fieldRule));
      delete fr._id;
      rulesModel.update({_id: id}, fr, cb1);
    };

    async.mapSeries(rules, updateRule, cb);
  };

  // process any deletes
  function deleteRules(rules, cb) {
    var idsToRemove = [];
    form[ruleType].forEach(function(frId) {
      var found = false;
      for (var i=0; i<rules.length; i++) {
        var r = rules[i];
        if (frId.equals(r._id)) {
          found = true;
          break;
        }
      }
      if (found === false) {
        idsToRemove.push(frId);
      }
    });

    function deleteRule(fieldRuleId, cb1) {
      rulesModel.findByIdAndRemove(fieldRuleId, cb1);
    };
    async.mapSeries(idsToRemove, deleteRule, cb);
  };

  function doUpdate(rules, cb) {
    async.series([
      function(cb1) {
        deleteRules(rules.rules, cb1)
      },
      function(cb1) {
        createRules(rules.rules, cb1)
      },
      function(cb1) {
        updateRules(rules.rules, cb1)
      }
    ],function (err, ok){
        if(err) cb(err);
        form.updatedBy = options.userEmail;
        return cb(err);
      });
  };

  formModel.findById(rules.formId).exec(function (err, doc) {
    if (err) return cb(err);
    form = doc;

    async.series([
      function (cb1) {
        doUpdate(rules, cb1);
      }
    ], function (err) {
         if (err) return cb(err);
         form.save(function(err, doc){
           if (err) return cb(err);

           // return the doc fieldrules
           formModel.findById(rules.formId).populate(ruleType).exec(function (err, doc) {
             if (err) return cb(err);
             return cb(null, doc[ruleType]);
           });
         });
       });
  });
};
