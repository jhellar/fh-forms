var async = require('async');
var util = require('util');
var models = require('../common/models.js')();
var validation = require('./../common/validate');
var _ = require('underscore');

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
  var conn = connections.mongooseConnection;
  var formModel = models.get(conn, models.MODELNAMES.FORM);
  var pageModel = models.get(conn, models.MODELNAMES.PAGE);
  var fieldModel = models.get(conn, models.MODELNAMES.FIELD);
  var fieldRulesModel = models.get(conn, models.MODELNAMES.FIELD_RULE);
  var form;

  function validateParams(cb) {
    validate.has("formId","rules",cb);
  }

  // iterate through the form field rules vs the new rules
  function createFieldRules(fieldRules, cb) {
    function addFieldRule(fieldRule, cb1) {
      if (fieldRule._id) return cb();

      var fr = new fieldRulesModel(fieldRule);
      fr.save(function(err, frdoc) {
        if(err) return cb(err);
        form.fieldRules.push(frdoc);
        return cb1(null, frdoc);
      });
    };

    async.mapSeries(fieldRules, addFieldRule, cb);
  };

  // process any updates
  function updateFieldRules(fieldRules, cb) {
    function updateFieldRule(fieldRule, cb1) {
      if (!fieldRule._id) return cb1();

      var id = fieldRule._id;
      var fr = JSON.parse(JSON.stringify(fieldRule));
      delete fr._id;
      fieldRulesModel.update({_id: id}, fr, cb1);
    };

    async.mapSeries(fieldRules, updateFieldRule, cb);
  };

  // process any deletes
  function deleteFieldRules(fieldRules, cb) {
    var idsToRemove = [];
    form.fieldRules.forEach(function(frId) {
      var found = false;
      for (var i=0; i<fieldRules.length; i++) {
        var r = fieldRules[i];
        if (frId.equals(r._id)) {
          found = true;
          break;
        }
      }
      if (found === false) {
        idsToRemove.push(frId);
      }
    });

    function deleteFieldRule(fieldRuleId, cb1) {
      fieldRulesModel.findByIdAndRemove(fieldRuleId, cb1);
    };
    async.mapSeries(idsToRemove, deleteFieldRule, cb);
  };

  function doUpdate(fieldRules, cb) {
    async.series([
      function(cb1) {
        deleteFieldRules(fieldRules.rules, cb1)
      },
      function(cb1) {
        createFieldRules(fieldRules.rules, cb1)
      },
      function(cb1) {
        updateFieldRules(fieldRules.rules, cb1)
      }
    ],function (err, ok){
        if(err) cb(err);

        form.updatedBy = options.userEmail;
        return cb(err);
      });
  };

  //formModel.findById(fieldRules.formId).populate('fieldRules').exec(function (err, doc) {
  formModel.findById(fieldRules.formId).exec(function (err, doc) {
    if (err) return cb(err);
    form = doc;

    async.series([
      validateParams,
      function (cb1) {
        doUpdate(fieldRules, cb1);
      }
    ], function (err) {
         if (err) return cb(err);
         form.save(function(err, doc){
           if (err) return cb(err);

           // return the doc fieldrules
           formModel.findById(fieldRules.formId).populate('fieldRules').exec(function (err, doc) {
             return cb(null, doc.fieldRules);
           });
         });
       });
  });
};
