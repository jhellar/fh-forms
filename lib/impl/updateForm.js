var async = require('async');
var models = require('../common/models.js')();
var validation = require('./../common/validate');
var _ = require('underscore');
var misc = require('../common/misc.js');
var buildErrorResponse = misc.buildErrorResponse;
var getForm = require('./getForm.js');
var rulesUpdate = require('./updateRules.js');
var mongoose = require('mongoose');
var ERROR_CODES = models.CONSTANTS.ERROR_CODES;
var logger = require('../common/logger.js').getLogger();

/*
 * updateForm(connections, options, formData, cb)
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
 *    formData: {
 *       name: name of form string
 *       description: description of form string
 *    }
 *
 *    cb  - callback function (err, newDataDocument)
 *
 */
module.exports = function updateForm(connections, options, formToUpdate, cb) {
  logger.debug("Updating Form", options, formToUpdate);
  formToUpdate = formToUpdate || {};
  var formData = _.clone(formToUpdate);
  formData.pages = _.map(formData.pages, function(page) {
    var clPage = _.clone(page);

    clPage.fields = _.map(clPage.fields, function(field) {
      return _.clone(field);
    });

    return clPage;
  });
  var ruleDeletionFlags = formData.ruleDeletionFlags || {};
  var validate = validation(formData);
  var conn = connections.mongooseConnection;
  var formModel = models.get(conn, models.MODELNAMES.FORM);
  var pageModel = models.get(conn, models.MODELNAMES.PAGE);
  var fieldModel = models.get(conn, models.MODELNAMES.FIELD);
  var fieldRuleModel = models.get(conn, models.MODELNAMES.FIELD_RULE);
  var pageRuleModel = models.get(conn, models.MODELNAMES.PAGE_RULE);
  var dataSourceModel = models.get(conn, models.MODELNAMES.DATA_SOURCE);
  var dataTargetModel = models.get(conn, models.MODELNAMES.DATA_TARGET);

  function validateParams(cb) {
    //Validating basic parameters.
    validate.has("name","description",function(err) {
      if (err) {
        return cb(err);
      }

      //Validating field codes -- not async.
      var fieldCodeError = validatefieldCodes();

      if (fieldCodeError) {
        return cb(fieldCodeError);
      }

      validateDuplicateName(cb);
    });
  }

  /**
   * User Field codes must be unique within a form.
   *
   * All field codes must have a length > 0, otherwise don't save the form.
   *
   * No asynchronous functionality in this function.
   * @param cb
   */
  function validatefieldCodes() {
    //Flag for finding a duplicate field code
    var duplicateFieldCode = false;
    var invalidFieldCode = false;
    var fieldCodes = {};

    formData.pages = _.map(formData.pages, function(page) {
      page.fields = _.map(page.fields, function(field) {
        var fieldCode = field.fieldCode;

        //If not set, then just return the field.
        if (fieldCode === null || typeof(fieldCode) === "undefined") {
          return field;
        }

        //Checking for duplicate field code. It must be a string.
        if (typeof(fieldCode) === "string") {
          //If the length of the code is 0, then don't save it.
          if (fieldCode.length === 0) {
            delete field.fieldCode;
          } else {
            //Checking for duplicate field code
            if (fieldCodes[fieldCode]) {
              duplicateFieldCode = true;  //Flagging the field as duplicate
            } else {
              fieldCodes[fieldCode] = true;
            }
          }
        } else {
          invalidFieldCode = true; //Field codes must be a string.
        }

        return field;
      });

      return page;
    });

    if (duplicateFieldCode) {
      return new Error("Duplicate Field Codes Detected. Field Codes Must Be Unique In A Form.");
    }

    if (invalidFieldCode) {
      return new Error("Invalid Field Code. Field Codes Must Be A String.");
    }

    //All valid. can proceed to saving the form.
    return undefined;
  }

  /**
   * Validating form duplicate names.
   */
  function validateDuplicateName(cb) {
    var formId = formData._id;
    var formName = formData.name;

    if (!formName) {
      return cb(new Error("No form name passed"));
    }

    var query = {};

    //If there is a form id, then the query to the form model must exclude the current form id that is being updated.
    if (formId) {
      query.name = formName;
      //Excluding the formId that is being updated.
      query["_id"] = {"$nin": [formId]};
    } else { //Just checking that the form name exists as a form is being created
      query.name = formName;
    }

    formModel.count(query, function(err, count) {
      if (err) {
        return cb(err);
      }

      //If the number of found forms is > 0, then there is another form with the same name. Do not save the form.
      if (count > 0) {
        return cb(new Error("Form with name " + formName + " already exists found."));
      } else {//No duplicates, can proceed with saving the form.
        return cb();
      }
    });
  }

  /**
   * Extracting any data sources that are contained in any field in the forms.
   * Will only retrun unique entries
   * @param formJSON -- JSON Definition Of The Form
   */
  function getFormDataSources(formJSON) {
    var dataSources;
    var pages = formJSON.pages || [];
    dataSources = _.map(pages, function(page) {
      var fields = page.fields || [];

      fields = _.map(fields, function(field) {
        //If the field is defined as a Data Source field, and it has a data source, then return that data source.
        if (field.dataSourceType === models.FORM_CONSTANTS.DATA_SOURCE_TYPE_DATA_SOURCE && field.dataSource) {
          return field.dataSource;
        } else {
          return undefined;
        }
      });

      //Removing any undefined values
      return _.compact(fields);
    });

    //Remove all nested arrays
    dataSources = _.flatten(dataSources);

    logger.debug("Got Form Data Sources", dataSources);

    //Only Want One Of Each Data Source
    return _.uniq(dataSources);
  }

  /**
   * Finding Matching Documents
   * @param type - Data Source or Data Target
   * @param documentIDs - Array Of Document IDs
   * @param modelToSearch - Model to search on
   * @param cb
   */
  function findMatchingDocuments(type, documentIDs, modelToSearch, cb) {

    var errorTextDataType = type === models.MODELNAMES.DATA_SOURCE ? "Data Sources" : "Data Targets";

    //If the form contains no data sources, then no need to verify
    if (documentIDs.length === 0) {
      return cb(undefined, []);
    }

    var query = {_id: {
      "$in": documentIDs
    }};

    modelToSearch.find(query).exec(function(err, foundModels) {
      if (err) {
        return cb(buildErrorResponse({
          error: err,
          userDetail: "Unexpected Error Finding " + errorTextDataType
        }));
      }

      //There should be the same number of data source documents
      if (documentIDs.length !== foundModels.length) {

        var missingDocumentId = _.find(documentIDs, function(documentId) {
          return !_.findWhere(foundModels, {_id: documentId});
        });

        //If there is no missing data source, then something is wrong..
        if (!missingDocumentId) {
          return cb(buildErrorResponse({
            error: new Error("Unexpected Error When Finding " + errorTextDataType),
            systemDetail: "Expected A Missing " + errorTextDataType + " But Could Not Find It"
          }));
        }

        return cb(buildErrorResponse({
          userDetail: "A " + errorTextDataType + " Contained In The Form Could Not Be Found",
          systemDetail: "Expected " + errorTextDataType + " With ID " + missingDocumentId + " To Be Found",
          code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
        }));
      }

      //All documents found -- checking for cache if needed
      if (options.expectDataSourceCache && type === models.MODELNAMES.DATA_SOURCE) {
        var missingCache = _.find(foundModels, function(dataSource) {
          return dataSource.cache.length === 0;
        });

        if (missingCache) {
          return cb(buildErrorResponse({
            error: new Error("Expected " + errorTextDataType + " Cached Data To Be Set"),
            systemDetail: "Expected Cache For " + errorTextDataType + " ID " + missingCache._id + " To Be Set",
            code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
          }
                                      ));
        }
      }

      //Checking that only one real time data target is assigned.
      if (type === models.MODELNAMES.DATA_TARGET) {
        var realTimeDataTargets = _.filter(foundModels, function(foundModel) {
          return foundModel.type === models.CONSTANTS.DATA_TARGET_TYPE_REAL_TIME;
        });

        if (realTimeDataTargets.length > 1) {
          return cb(buildErrorResponse({
            error: new Error("Only One Real Time Data Target Can Be Assigned To A Form"),
            code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
          }
                                      ));
        }
      }

      return cb(undefined, foundModels);
    });
  }

  /**
   * Function To Verify All Data Sources Attached To A Form.
   * @param formDataSourceIds -- Array Of Data Source IDs Attached To Verify
   */
  function verifyDataSources(formDataSourceIds, cb) {
    findMatchingDocuments(models.MODELNAMES.DATA_SOURCE, formDataSourceIds, dataSourceModel, cb);
  }

  /**
   * Verifying All Data Targets Associated With A Form
   * @param dataTargetIds
   * @param cb
   */
  function verifyDataTargets(dataTargetIds, cb) {
    findMatchingDocuments(models.MODELNAMES.DATA_TARGET, dataTargetIds, dataTargetModel, cb);
  }

  //Verifying the presence of all Data Sources and Data Targets associated with the form.
  function verifyFormDataSourcesAndTargets(formData, cb) {
    var formDataSourceIds = getFormDataSources(formData);
    var dataTargets = formData.dataTargets || [];

    async.series({
      dataSources : function(cb) {
        verifyDataSources(formDataSourceIds, cb);
      },
      dataTargets: function(cb) {
        verifyDataTargets(dataTargets, cb);
      }
    }, cb);
  }
  /*
    Checking rule targets are still valid -- if not, rule is deleted
  */
  function refactorRules(form, cb) {
    //Compiling a list of field and page ids to check for
    var formPages = [];
    var fieldRulesToDelete = [];
    var pageRulesToDelete = [];

    /**
     * Object of invalid fields that is built up by scanning the rules.
     * @type {{
     *   fieldId: true
     * }}
     */
    var invalidFields = {

    };

    formModel.findById(form._id.toString()).populate("pages", "-__v")
      .populate("pageRules", "-__v")
      .populate("fieldRules", "-__v")
      .populate("dataSources.formDataSources", "_id name")//Populating Data Sources
      .populate("dataTargets", "_id name")//Populating Data Targets
      .select("-__v").exec(function(err, formResult) {
        if (err) {
          return cb(err);
        }

        //Now have a form with all pages, pageRules and fieldRules populated
        formModel.populate(formResult, {
          "path": "pages.fields",
          "model": fieldModel,
          "select": "-__v"
        }, function(err, updatedFormResult) {
          if (err) {
            return cb(err);
          }

          form = updatedFormResult;

          formPages = updatedFormResult.pages;

          async.parallel([
            function(fieldRuleCb) {
              async.each(formResult.fieldRules, async.apply(scanForInvalidFields, models.MODELNAMES.FIELD_RULE), fieldRuleCb);
            },
            function(pageRuleCb) {
              async.each(formResult.pageRules, async.apply(scanForInvalidFields, models.MODELNAMES.PAGE_RULE), pageRuleCb);
            }
          ], function(err) {
            if (err) {
              return cb(err);
            }

            //Update the form object
            async.series([
              updateFormRules,
              updateOrDeleteRules
            ], cb);
          });
        });
      });


    function scanForInvalidFields(type, rule, callback) {
      var targetField = rule.targetPage ? rule.targetPage : rule.targetField;
      /**
       * A field target is not valid if it does not exist in the form or it is an adminOnly field.
       * @param fieldOrPageIdToCheck
       * @param pages
       * @returns {boolean}
       */
      function isFieldStillValidTarget(fieldOrPageIdToCheck, pages, cb) {
        var fieldExistsInForm = false;
        var invalidPages = _.filter(pages, function(page) {
          var currentPageId = page._id.toString();

          if (currentPageId === fieldOrPageIdToCheck) {
            fieldExistsInForm = true;
          }
          var invalidFieldList = _.filter(page.fields, function(field) {
            var currentFieldId = field._id.toString();
            if (currentFieldId === fieldOrPageIdToCheck) {
              //Current field exists
              fieldExistsInForm = true;

              //Field is admin only, therefore it is an invalid target for a rule.
              if (field.adminOnly) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          });

          //If the invalidFieldList is > 0, it means that one of the fields was invalid.
          return invalidFieldList.length > 0;
        });

        var invalidField = invalidPages.length > 0;

        //Invalid if either the field is invalid, or it does not exist in the form.
        if (invalidField === true || !fieldExistsInForm) {
          return cb(true);
        } else {
          return cb();
        }
      }

      async.each(targetField, function(targetField, cb) {
        targetField = targetField.toString();

        //Checking if the field target field is invalid
        isFieldStillValidTarget(targetField, formPages, function(invalidField) {
          if (invalidField) {
            invalidFields[targetField] = true;
          }
          return cb();
        });
      }, function() {
        async.each(rule.ruleConditionalStatements, function(ruleConStatement, ruleCb) {
          var sourceId = ruleConStatement.sourceField;
          sourceId = sourceId.toString();

          isFieldStillValidTarget(sourceId, formPages, function(invalidField) {
            if (invalidField) {
              invalidFields[sourceId] = true;
            }
            ruleCb();
          });
        }, callback);
      });
    }

    function updateOrDeleteRules(cb) {
      //Updating each of the rules to account for any fields removed. Can't just simply delete them.

      async.parallel([
        function updateFieldRulesInDb(cb) {
          async.each(form.fieldRules, function(formFieldRule, cb) {
            var fieldRuleId = formFieldRule._id.toString();
            fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, fieldRule) {
              if (err) {
                return cb(err);
              }

              if (fieldRule === null) {
                return cb(new Error("No field rule with id " + fieldRuleId + " found."));
              }

              //Update the ruleConditionalStatements and targets of the rule.
              fieldRule.ruleConditionalStatements = formFieldRule.ruleConditionalStatements;
              fieldRule.targetField = formFieldRule.targetField;
              fieldRule.save(cb);
            });
          }, cb);
        },
        function updatePageRulesInDb(cb) {
          async.each(form.pageRules, function(formPageRule, cb) {
            var pageRuleId = formPageRule._id.toString();
            pageRuleModel.findOne({"_id": pageRuleId}, function(err, pageRule) {
              if (err) {
                return cb(err);
              }

              if (pageRule === null) {
                return cb(new Error("No page rule with id " + pageRuleId + " found."));
              }

              //Update the ruleConditionalStatements and targets of the rule.
              pageRule.ruleConditionalStatements = formPageRule.ruleConditionalStatements;
              pageRule.save(cb);
            });
          }, cb);
        },
        function deleteFieldRules(cb) {
          async.eachSeries(fieldRulesToDelete, function(fieldRuleId, cb) {
            fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, fieldRule) {
              if (err) {
                return cb(err);
              }

              if (fieldRule !== null) {
                fieldRule.remove(cb);
              } else {
                return cb();
              }
            });
          }, cb);
        },
        function deletePageRules(cb) {
          async.eachSeries(pageRulesToDelete, function(pageRuleId, cb) {
            pageRuleModel.findOne({"_id": pageRuleId}, function(err, pageRule) {
              if (err) {
                return cb(err);
              }

              if (pageRule !== null) {
                pageRule.remove(cb);
              } else {
                return cb();
              }
            });
          }, cb);
        }
      ], cb);
    }

    //Need to delete any rules that are to be deleted
    function updateFormRules(cb) {

      //If a rule contains a field that is flagged for rule deletion, it is added to this list.
      var rulesFlaggedForDeletion = {};

      //Filters out any conditional statements that are no longer valid.
      function filterConditionalStatements(rule) {
        return _.filter(rule.ruleConditionalStatements, function(ruleCondStatement) {
          var sourceField = ruleCondStatement.sourceField.toString();

          if (invalidFields[sourceField]) {
            /**
             * If the user flagged the field in this rule for deletion, flag the rule for deletion.
             */
            if (ruleDeletionFlags[sourceField]) {
              rulesFlaggedForDeletion[rule._id.toString()] = true;
            }
            return false;
          } else {
            return true;
          }
        });
      }

      var updatedFieldRules = _.map(form.fieldRules, function(fieldRule) {
        var filteredConditionalStatements = filterConditionalStatements(fieldRule);
        var filteredTargets = _.filter(fieldRule.targetField, function(targetField) {
          if (invalidFields[targetField]) {
            return false;
          } else {
            return true;
          }
        });

        fieldRule.ruleConditionalStatements = filteredConditionalStatements;
        fieldRule.targetField = filteredTargets;
        return fieldRule;
      });

      var updatedPageRules = _.map(form.pageRules, function(pageRule) {
        pageRule.ruleConditionalStatements = filterConditionalStatements(pageRule);
        return pageRule;
      });

      fieldRulesToDelete = _.filter(updatedFieldRules, function(fieldRule) {
        var targetFields = fieldRule.targetField;
        var conditionalStatements = fieldRule.ruleConditionalStatements;
        var fieldRuleId = fieldRule._id.toString();

        return targetFields.length === 0 || conditionalStatements.length === 0 || rulesFlaggedForDeletion[fieldRuleId];
      });

      pageRulesToDelete = _.filter(updatedPageRules, function(pageRule) {
        var conditionalStatements = pageRule.ruleConditionalStatements;
        var pageRuleId = pageRule._id.toString();

        return conditionalStatements.length === 0 || rulesFlaggedForDeletion[pageRuleId];
      });

      fieldRulesToDelete = _.map(fieldRulesToDelete, function(fieldRule) {
        return fieldRule._id.toString();
      });

      pageRulesToDelete = _.map(pageRulesToDelete, function(pageRule) {
        return pageRule._id.toString();
      });

      //Now have all the rules that need to be deleted, these rules need to be removed from the field and page rules
      updatedFieldRules = _.filter(updatedFieldRules, function(updatedFieldRule) {
        return fieldRulesToDelete.indexOf(updatedFieldRule._id.toString()) === -1;
      });


      updatedPageRules = _.filter(updatedPageRules, function(updatedPageRule) {
        return pageRulesToDelete.indexOf(updatedPageRule._id.toString()) === -1;
      });

      form.fieldRules = updatedFieldRules;
      form.pageRules = updatedPageRules;

      form.save(function(err) {
        return cb(err);
      });
    }
  }

  function createNewForm(formData) {
    return new formModel({
      "_id": formData._id,
      "updatedBy": formData.updatedBy || options.userEmail,
      "name": formData.name,
      "createdBy": formData.createdBy || options.userEmail,
      "createdOn": new Date(),
      "description": formData.description,
      "subscribers": formData.subscribers,
      "pages" : [],
      "dataSources": {
        "formDataSources": [],
        "lastRefresh": new Date()
      }
    });
  }

  function verifyModelsToUpdate(modelToSearch, idsToFind, type, cb) {
    modelToSearch.find({_id: {"$in": idsToFind}}).exec(function(err, foundModels) {
      if (err) {
        return cb(err);
      }

      if (foundModels.length < idsToFind && !options.createIfNotFound) {
        var fieldNotFound = _.find(idsToFind, function(fieldId) {
          return !_.find(foundModels, function(foundModel) {
            return foundModel._id.toString === fieldId.toString();
          });
        });
        return cb(new Error(type + " With ID: " + fieldNotFound + " Not Found"));
      } else {
        return cb(undefined, foundModels);
      }
    });
  }

  function checkCreation(fieldsOrPages, savedFieldsOrPages) {
    return _.filter(fieldsOrPages, function(fieldOrPage) {
      return fieldOrPage._toBeCreated || !_.find(savedFieldsOrPages, function(savedFieldOrPage) {
        return savedFieldOrPage._id.toString() === fieldOrPage._id.toString();
      });
    });
  }

  function checkUpdate(fieldsOrPages, savedFieldsOrPages) {
    return _.filter(fieldsOrPages, function(fieldOrPage) {
      return !fieldOrPage._toBeCreated && _.find(savedFieldsOrPages, function(savedFieldOrPage) {
        return _.isEqual(savedFieldOrPage._id.toString(), fieldOrPage._id.toString());
      });
    });
  }

  function createAndUpdatePagesAndFields(modelToUpdate, fieldsToCreate, fieldsToUpdate, savedFields, cb) {
    async.parallel([
      function(cb) {
        async.each(fieldsToCreate, function(field, cb) {
          var newModel = new modelToUpdate(field);

          newModel.save(function(err, updatedModel) {
            return cb(err, updatedModel);
          });
        }, cb);
      },
      function(cb) {
        async.each(fieldsToUpdate, function(fieldToUpdate, cb) {
          var savedFieldToUpdate = _.find(savedFields, function(savedField) {
            return savedField._id.toString() === fieldToUpdate._id.toString();
          });

          _.extendOwn(savedFieldToUpdate, fieldToUpdate);

          savedFieldToUpdate.save(function(err, updatedModel) {
            return cb(err, updatedModel);
          });
        }, cb);
      }
    ], cb);
  }

  async.waterfall([
    validateParams,
    function checkingDataSourcesAndTargets(cb) {
      //Checking for all Data Sources and Data Targets Associated With The Form
      verifyFormDataSourcesAndTargets(formData, cb);
    },
    function getOrCreateForm(dataSourcesAndTargets, cb) {
      if (!formData._id) {
        formData._id = new mongoose.Types.ObjectId();
        var form = createNewForm(formData);
        form.dataSources = {
          formDataSources: dataSourcesAndTargets.dataSources
        };
        form.dataTargets = dataSourcesAndTargets.dataTargets;
        return cb(undefined, form);
      } else {
        formModel.findById(formData._id).populate("pages fieldRules pageRules").exec(function(err, savedForm) {
          if (err) {
            return cb(err);
          }

          if (!savedForm && options.createIfNotFound) {
            formData._id = formData._id || new mongoose.Types.ObjectId();

            logger.debug("Deploying Form", formData);

            var newForm = createNewForm(formData);

            newForm.dataSources = {
              formDataSources: dataSourcesAndTargets.dataSources
            };
            newForm.dataTargets = dataSourcesAndTargets.dataTargets;

            return cb(undefined, newForm);
          }

          if (!savedForm) {
            return cb(new Error("No Form Found With ID: " + formData._id));
          }

          savedForm.dataTargets = dataSourcesAndTargets.dataTargets;
          savedForm.dataSources = {
            formDataSources: dataSourcesAndTargets.dataSources
          };

          return cb(undefined, savedForm);
        });
      }
    },
    function updateFieldsAndPages(savedForm, cb) {

      //Handy reference for mapping temporary field/page ids to proper mongo ids.
      //NGui uses this as part of
      var tempFieldPageIdsMap = {

      };

      formData.pages = _.map(formData.pages, function(page) {

        //If the page has no _id field OR if it is flagged as a new page.
        //New pages/fields must send a cid field as a temporay id to flag the field as new.
        if (!page._id || (page.isNewModel && page.cid)) {
          page._id = new mongoose.Types.ObjectId();
          page._toBeCreated = true;

          //If the cid param is set, map the cid to the proper mongo id
          //This is useful for processing field and page rules targeting temp field/page ids
          if (_.isString(page.cid)) {
            tempFieldPageIdsMap[page.cid] = page._id.toString();
          }
        }

        page.fields = _.map(page.fields, function(field) {
          if (!field._id || (field.isNewModel && field.cid)) {
            field._id = new mongoose.Types.ObjectId();
            field._toBeCreated = true;

            //If the cid param is set, map the cid to the proper mongo id
            //This is useful for processing field and page rules targeting temp field/page ids
            if (_.isString(field.cid)) {
              tempFieldPageIdsMap[field.cid] = field._id.toString();
            }
          }

          return field;
        });
        return page;
      });

      //Handy function for replacing any temporary field/page ids with proper mongo ids.
      function reassignConditionalStatementIds(conditionalStatement) {
        conditionalStatement.sourceField = tempFieldPageIdsMap[conditionalStatement.sourceField] || conditionalStatement.sourceField;
        return conditionalStatement;
      }

      //Replacing Any Temp Rule Target Field/Page IDs with the proper objectids
      formData.fieldRules = _.map(formData.fieldRules, function(fieldRule) {
        fieldRule.targetField = _.isArray(fieldRule.targetField) ? fieldRule.targetField : [fieldRule.targetField];
        fieldRule.targetField = _.map(fieldRule.targetField, function(targetFieldId) {
          return tempFieldPageIdsMap[targetFieldId] || targetFieldId;
        });

        fieldRule.ruleConditionalStatements = _.map(fieldRule.ruleConditionalStatements, reassignConditionalStatementIds);

        return fieldRule;
      });

      formData.pageRules = _.map(formData.pageRules, function(pageRule) {
        pageRule.targetPage = _.isArray(pageRule.targetPage) ? pageRule.targetPage : [pageRule.targetPage];
        pageRule.targetPage = _.map(pageRule.targetPage, function(targetId) {
          return tempFieldPageIdsMap[targetId] || targetId;
        });

        pageRule.ruleConditionalStatements = _.map(pageRule.ruleConditionalStatements, reassignConditionalStatementIds);

        return pageRule;
      });

      //Assigning any page IDs To Be Saved To The form
      savedForm.pages = _.map(formData.pages, function(page) {
        return page._id;
      });
      savedForm.markModified('pages');

      var fields = _.map(formData.pages, function(page) {
        return page.fields;
      });

      fields = _.flatten(fields);

      async.series({
        fields: function(cb) {

          var fieldsToFind = _.filter(fields, function(field) {
            return !field._toBeCreated;
          });

          fieldsToFind = _.map(fieldsToFind, function(field) {
            return field._id;
          });

          verifyModelsToUpdate(fieldModel, fieldsToFind, "Field", function(err, savedFields) {
            var fieldsToCreate = checkCreation(fields, savedFields);
            var fieldsToUpdate = checkUpdate(fields, savedFields);

            createAndUpdatePagesAndFields(fieldModel, fieldsToCreate, fieldsToUpdate, savedFields, cb);
          });
        },
        pages: function(cb) {
          var pages = formData.pages;
          var pagesToFind = _.filter(pages, function(page) {
            return !page._toBeCreated;
          });

          pagesToFind = _.map(pagesToFind, function(page) {
            return page._id;
          });

          verifyModelsToUpdate(pageModel, pagesToFind, "Page", function(err, savedPages) {

            var pagesToCreate = checkCreation(pages, savedPages);
            pagesToCreate = _.map(pagesToCreate, function(page) {
              page.fields = _.map(page.fields, function(field) {
                return field._id;
              });
              return page;
            });
            var pagesToUpdate = checkUpdate(pages, savedPages);
            pagesToUpdate = _.map(pagesToUpdate, function(page) {
              page.fields = _.map(page.fields, function(field) {
                return field._id;
              });
              return page;
            });

            createAndUpdatePagesAndFields(pageModel, pagesToCreate, pagesToUpdate, savedPages, cb);
          });
        },
        fieldRules: function(cb) {
          rulesUpdate.updateFieldRules(connections, options, savedForm, {
            formId: savedForm._id,
            rules: formData.fieldRules || []
          }, cb);
        },
        pageRules: function(cb) {
          rulesUpdate.updatePageRules(connections, options, savedForm, {
            formId: savedForm._id,
            rules: formData.pageRules || []
          }, cb);
        },
        saveUpdatedForm: function(cb) {
          savedForm.updatedBy = formData.updatedBy || options.userEmail;
          savedForm.name = formData.name;
          savedForm.description = formData.description;
          savedForm.subscribers = formData.subscribers || savedForm.subscribers || [];
          savedForm.lastUpdated = new Date();
          savedForm.markModified("lastUpdated");
          savedForm.markModified("subscribers");
          savedForm.save(function(err) {
            if (err) {
              return cb(buildErrorResponse({
                error: err,
                userDetails: "Invalid Form Data To Save",
                code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
              }));
            }

            return cb();
          });
        },
        checkValidRules: function(cb) {
          refactorRules(savedForm, cb);
        }
      }, function(err) {
        return cb(err, savedForm);
      });
    }
  ], function(err, savedForm) {
    if (err) {
      return cb(buildErrorResponse({
        error: err
      }));
    }

    //Form is saved, need to load the a full form API response
    getForm(connections, _.extend({_id: savedForm._id, includeDataSources: true}, options), function(err, form) {
      if (err) {
        return cb(buildErrorResponse({
          error: err,
          userDetail: "Error Updating Form",
          systemDetail: "Error Getting Form After Saving"
        }));
      }

      return cb(undefined, form);
    });
  });
};
