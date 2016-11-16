var getForm = require('./getForm.js');
var updateForm = require('./updateForm.js');
var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var misc = require('../common/misc.js');
var async = require('async');
var _ = require('underscore');
var mongoose = require('mongoose');

module.exports = function(connections, options, cb) {
  var invalid = validate(options).has("name");

  if (invalid) {
    return cb(misc.buildErrorResponse({
      error: new Error("Invalid Arguments To Clone/Import A Form."),
      code: models.CONSTANTS.ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
    }));
  }

  //First get a form

  async.waterfall([
    function(cb) {

      //If the form is supplied as an argument, it does not exist in the database. Useful for importing for templates.
      if (_.isObject(options.form)) {
        return cb(undefined, options.form);
      }

      getForm(connections, options, cb);
    },
    function(formToClone, cb) {
      var idMap = [];

      formToClone.name = options.name;
      formToClone.description = options.description || formToClone.description;

      formToClone.pages = _.map(formToClone.pages, function(page) {
        var newObjectId = new mongoose.Types.ObjectId();
        idMap.push({old: page._id, created: newObjectId});
        page._id = newObjectId;

        page.fields = _.map(page.fields, function(field) {
          var newObjectId = new mongoose.Types.ObjectId();

          idMap.push({old: field._id, created: newObjectId});
          field._id = newObjectId;

          return field;
        });

        return page;
      });

      function addNewIds(targetType, rules) {

        return _.map(rules, function(rule) {

          //Dealing with older templates
          if (!_.isArray(rule[targetType])) {
            rule[targetType] = [rule[targetType]];
          }

          rule[targetType] = _.map(rule[targetType], function(targetId) {
            var idMapEntry = _.find(idMap, function(idMapEntry) {
              return idMapEntry.old.toString() === targetId.toString();
            });

            if (!idMapEntry) {
              return null;
            }

            return idMapEntry.created;
          });

          rule[targetType] = _.compact(rule[targetType]);

          rule.ruleConditionalStatements = _.map(rule.ruleConditionalStatements, function(ruleCondStat) {

            var idMapEntry = _.find(idMap, function(idMapEntry) {
              return idMapEntry.old.toString() === ruleCondStat.sourceField.toString();
            });

            if (!idMapEntry) {
              return null;
            }

            ruleCondStat.sourceField = idMapEntry.created;
            return ruleCondStat;
          });

          rule.ruleConditionalStatements = _.compact(rule.ruleConditionalStatements);

          rule = _.omit(rule, "_id");

          return rule;
        });
      }

      //Update Any Field/Page Rules

      formToClone.fieldRules = addNewIds("targetField", formToClone.fieldRules);
      formToClone.pageRules = addNewIds("targetPage", formToClone.pageRules);

      //Assigning A New Form Id
      formToClone._id = new mongoose.Types.ObjectId();

      return cb(undefined, formToClone);
    },
    function(formToClone, cb) {
      //Updating the form

      updateForm(connections, _.extend(options, {
        createIfNotFound: true,
        _id: formToClone._id.toString()
      }), formToClone, cb);
    }
  ], cb);
};