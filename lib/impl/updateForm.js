var async = require('async');
var models = require('../common/models.js')();
var validation = require('./../common/validate');
var _ = require('underscore');
var groups = require('./groups.js');

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
module.exports = function updateForm(connections, options, formData, cb) {
  var validate = validation(formData);
  var conn = connections.mongooseConnection;
  var formModel = models.get(conn, models.MODELNAMES.FORM);
  var pageModel = models.get(conn, models.MODELNAMES.PAGE);
  var fieldModel = models.get(conn, models.MODELNAMES.FIELD);
  var fieldRuleModel = models.get(conn, models.MODELNAMES.FIELD_RULE);
  var pageRuleModel = models.get(conn, models.MODELNAMES.PAGE_RULE);
  var form;

  function validateParams(cb) {
    validate.has("name","description",cb);
  }

  function updateField(fieldToUpdate, cb) {
    var fieldToUpdateClone = JSON.parse(JSON.stringify(fieldToUpdate));
    var idToUpdate = fieldToUpdateClone._id;
    delete fieldToUpdateClone._id; // remove the _id field so we can update


    fieldModel.findOne({_id: idToUpdate}, function(err, foundField){
      if(err) return cb(err);

      if(foundField === null){
        return cb(new Error("No Field Matches id " + idToUpdate));
      }

      for(var key in fieldToUpdateClone){
        foundField[key] = fieldToUpdateClone[key];
      }


      foundField.save(function(err){
        if(err) return cb(err);

        return cb(err, idToUpdate);
      });
    });
  }

  function createField(fieldToCreate, cb) {
    var field = new fieldModel(fieldToCreate);
    field.save(function(err, doc) {
      if(err) return cb(err);
      return cb(undefined, doc._id);
    });
  }

  function updateOrCreateField(fieldToUpdateOrCreate, cb) {


    if(fieldToUpdateOrCreate._id) {
      updateField(fieldToUpdateOrCreate, cb);
    } else {
      createField(fieldToUpdateOrCreate, cb);
    }
  }

  function updateCreateFields(fields, cb) {
    var inFields = fields || [];
    var fieldsToAdd = [];
    async.eachSeries(inFields, function (fieldToUpdateOrCreate, cb) {
      updateOrCreateField(fieldToUpdateOrCreate, function (err, id) {
        if(err) return cb(err);
        fieldsToAdd.push(id);
        return cb();
      });
    }, function(err) {
      return cb(err, fieldsToAdd);
    });
  }

  function doCreatePage(trackPageIds, pageToCreate, cb) {
    var pageModel = models.get(conn, models.MODELNAMES.PAGE);
    async.waterfall([
      function(cb) {
        var err;
        if(pageToCreate._id) {
          err = {"code": 400, "message": "New page should not have _id field"};
        }
        return cb(err, pageToCreate.fields);
      },
      updateCreateFields,
      function(fieldsToAdd, cb) {
        var cloneOfPage = JSON.parse(JSON.stringify(pageToCreate));
        cloneOfPage.fields = fieldsToAdd;
        var page = new pageModel(cloneOfPage);
        page.save(function(err, doc) {
          if(err) return cb(err);
          trackPageIds.push(doc._id); 
          return cb();
        });
      }
    ], function (err) {
      return cb(err);
    });
  }

  function doCreate(formData, cb) {
    var pageIds = [];
    var pages = formData.pages || [];
    async.eachSeries(
      pages,
      async.apply(doCreatePage, pageIds),
      function(err){
        if(err) return cb(err);
        form = new formModel({
          "updatedBy": options.userEmail,
          "name": formData.name,
          "description": formData.description,
          "pages": pageIds,
          "subscribers": formData.subscribers
        });
        return cb(undefined, form);
      }
    );
  }

  //sorts the forms pagess into updates, deletes and creations
  function sortPages(form, postedPages, cb){
    var dbPageIds = form.pages || [];
    var idSorted = [];
    var toAdd = [];
    var toDelete = [];

    async.parallel([
      function mapDBIds (callback){
        async.map(dbPageIds, function (it,cb){
             cb(undefined, it.toString());
        }, callback);
      },
      function mapPostedIds (callback){
        async.map(postedPages,function (f,c){
          var theId = f._id;
          if(theId){
            var strValue = theId.toString();
            idSorted[theId] = f;
            delete idSorted[theId]._id; // remove the _id field so we can update later
            c(undefined, strValue);
          }
          else{
            toAdd.push(f);
            c();
          }
        },callback);
      }
    ], function done(err, oks){
      if(err){
        cb(err);
      }else{
        var inDB = oks[0];
        async.filter(oks[1], function(item, cb) {
          return cb(!!item);
        }, function(toUpdate) {
          toDelete = _.difference(inDB,toUpdate);
          cb(undefined, form, toDelete, toAdd, toUpdate, idSorted);
        });
      }
    });
  }

  function deletePages(form, toDelete, toAdd, toUpdate, idSorted, cb){
    async.each(toDelete, function deletePage (delId, callback){
     pageModel.findByIdAndRemove(delId,function (err){
       if(err){
         callback(err);
       }else{
         var index = form.pages.indexOf(delId);
         if(-1 !== index){
           form.pages.splice(index,1);
           callback();
         }
       }
     });
    }, function (err) {
      return cb(err, form, toAdd, toUpdate, idSorted);
    });
  }

  function createPages(form, toAdd, toUpdate, idSorted, cb){
    async.eachSeries(toAdd, function createPage (item, callback){
      var localItem = JSON.parse(JSON.stringify(item));
      updateCreateFields(localItem.fields, function (err, fieldIds) {
        if(err) return callback(err);
        localItem.fields = fieldIds; // replace field objects with field ids
        var f = new pageModel(localItem);
        f.save(function (err, ok){
          if(err) callback(err);
          else{
            form.pages.push(ok._id);
            callback();
          }
        });
      });
    }, function (err) {
      return cb(err, form, toUpdate, idSorted);
    });
  }

  function updatePages(form, toUpdate, idSorted, cb) {
    async.each(toUpdate, function updatePage (item, callback){
      var localItem = JSON.parse(JSON.stringify(idSorted[item]));
      updateCreateFields(localItem.fields, function (err, fieldIds) {
        if(err) return callback(err);
        localItem.fields = fieldIds; // replace field objects with field ids

        pageModel.findOne({_id: item}, function(err, foundPage){
          if(err) return cb(err);

          if(foundPage === null){
            return cb(new Error("No page matches id " + item));
          }

          for(var key in localItem){
            foundPage[key] = localItem[key];
          }

          foundPage.save(callback);
        });
      });
    }, function (err) {
      return cb(err);
    });  
  }

  /*
   Checking rule targets are still valid -- if not, rule is deleted
   */
  function updateRules(form, cb) {
    //Compiling a list of field and page ids to check for
    var fieldAndPageIds = [];
    var formPages = form.pages;
    var fieldRulesToDelete = [];
    var pageRulesToDelete = [];

    formModel.populate(form, {"path": "pages", "model": pageModel, "select": "-__v -fieldOptions._id"}, function(err){
      if(err){
        return cb(err);
      }

      async.each(formPages, function (formPage, callbackPage) {
        fieldAndPageIds.push(formPage._id.toString());
        formPage.fields = formPage.fields ? formPage.fields : [];

        async.each(formPage.fields, function (pageField, callbackField) {
          fieldAndPageIds.push(pageField.toString());
          callbackField();
        }, callbackPage);
      }, function(){
        async.parallel([
          function(fieldRuleCb){
            async.each(form.fieldRules, async.apply(scanForExistingFields, models.MODELNAMES.FIELD_RULE), fieldRuleCb);
          },
          function(pageRuleCb){
            async.each(form.pageRules, async.apply(scanForExistingFields, models.MODELNAMES.PAGE_RULE), pageRuleCb);
          }
        ], function(err){
          if(err){
            return cb(err);
          }

          //Update the form object
          async.parallel([
            updateFormRules,
            async.apply(deleteRules, models.MODELNAMES.FIELD_RULE),
            async.apply(deleteRules, models.MODELNAMES.PAGE_RULE)
          ], cb)
        });
      });

    });


    function scanForExistingFields(type, rule, callback){
      var targetField = rule.targetPage ? rule.targetPage : rule.targetField;
      targetField = targetField ? targetField.toString() : "";
      var targetExists = true;

      if(fieldAndPageIds.indexOf(targetField) === -1){
        if(type === models.MODELNAMES.FIELD_RULE){
          fieldRulesToDelete.push(rule._id);
        } else {
          pageRulesToDelete.push(rule._id);
        }
        return callback();
      } else {
        async.each(rule.ruleConditionalStatements, function(ruleConStatement, ruleCb){

         var sourceId = ruleConStatement.sourceField;
         sourceId = sourceId.toString();
         if(fieldAndPageIds.indexOf(sourceId) === -1){
           targetExists = false;
         }
          ruleCb();
        }, function(){
          if(targetExists === false){
            if(type === models.MODELNAMES.FIELD_RULE){
              fieldRulesToDelete.push(rule._id);
            } else {
              pageRulesToDelete.push(rule._id);
            }
          }

          return callback();
        });
      }
    }

    function deleteRules(type, cb){
      if(type === models.MODELNAMES.FIELD_RULE){
        async.eachSeries(fieldRulesToDelete, function(fieldRuleId, cb){
          fieldRuleModel.findOne({"_id": fieldRuleId}, function(err, fieldRule){
            if(err){
              return cb(err);
            }

            if(fieldRule !== null){
              fieldRule.remove();
            }

            return cb();
          });
        }, cb);
      } else {
        async.eachSeries(pageRulesToDelete, function(pageRuleId, cb){
          pageRuleModel.findOne({"_id": pageRuleId}, function(err, pageRule){
            if(err){
              return cb(err);
            }

            if(pageRule !== null){
              pageRule.remove();
            }

            return cb();
          });
        }, cb);
      }
    }

    //Need to delete any rules that are to be deleted
    function updateFormRules(cb){

      async.series([function(cb){
        async.map(form.fieldRules, function(fieldRule, cb){
          if(fieldRulesToDelete.indexOf(fieldRule._id.toString()) > -1){
            return cb(undefined, null);
          } else {
            return cb(undefined, fieldRule);
          }
        }, function(err, mappedFieldRules){
          form.fieldRules = _.filter(mappedFieldRules, function(elem){
            return elem !== null;
          });
          cb();
        });
      },
      function(cb){
        async.map(form.pageRules, function(pageRule, cb){
          if(fieldRulesToDelete.indexOf(pageRule._id.toString()) > -1){
            return cb(undefined, null);
          } else {
            return cb(undefined, pageRule);
          }
        }, function(err, mappedPageRules){
          form.pageRules = _.filter(mappedPageRules, function(elem){
            return elem !== null;
          });
          cb();
        });
      }], cb);

    }
  }

  function doUpdate(formData, cb) {
    formModel.findById(formData._id).populate("fieldRules pageRules").exec(function (err, doc) {
      if (err) return cb(err);


      var postedPages = formData.pages || [];
      //as this is an update and there is no doc to update bail out
      if (!doc) {
        return cb(new Error("A form id was passed but not form was found for that id"));
      }


      //what to do if no form found
      async.waterfall([
        async.apply(sortPages, doc, postedPages),
        deletePages,
        createPages,
        updatePages,
        async.apply(updateRules, doc)
      ], function (err) {
        if (err) cb(err);

        doc.updatedBy = options.userEmail;
        doc.name = formData.name;
        doc.description = formData.description;
        form = doc;
        return cb(err, doc);
      });
    });

  }

  async.series([
    validateParams,
    function (cb) {
      if(formData._id) {
        groups.validateFormAllowedForUser(connections, options.restrictToUser, formData._id, function (err) {
          if (err) return cb(err);
          doUpdate(formData, cb);
        });
      } else {
        doCreate(formData, function (err, form) {
          if (err) return cb(err);
          groups.addFormToUsersGroups(connections, options.restrictToUser, form._id.toString(), function (err) {
            if (err) return cb(err);
            return cb(undefined, form);
          });
        });
      }
    }
  ], function (err) {
    if (err) return cb(err);

    form.lastUpdated = new Date();
    form.markModified("lastUpdated");
    form.save(cb);
  });
};
