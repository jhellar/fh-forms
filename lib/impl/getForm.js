var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var getForm = function(connections, options, cb) {
  var fullyPopulatedForm = undefined;
  async.series([validateParams, getFormUsingId, constructResultJSON], function(err){
    return cb(err, fullyPopulatedForm);
  });

  function validateParams(cb){
    var validateParams = validate(options);


    validateParams.has("formId", function(failure){
      if(failure){
        return cb(new Error("Invalid params to getForm: " + JSON.stringify(options)));
      } else {
        return cb();
      }
    });
  }

  function getFormUsingId(cb){
    var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
    var Page = models.get(connections.mongooseConnection, models.MODELNAMES.PAGE);
    var Field = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

    Form.findOne({"_id": options.formId}).populate("pages", "-__v").populate("pageRules", "-__v").populate("fieldRules", "-__v").select("-__v").exec(function(err, formResult){
      if(err) return cb(err);

      if(formResult === null || formResult === undefined){
        return cb(new Error("No form exists matching id " + options.formId));
      }

      //Now have a form with all pages, pageRules and fieldRules populated
      Form.populate(formResult, {"path": "pages.fields", "model": Field, "select": "-__v -fieldOptions._id"}, function(err, updatedForm){
        if(err) return cb(err);

        var pageRef = {};
        var fieldRef = {};


        //Generating a handy page ref to use for getting page numbers.
        for(var pageIndex = 0; pageIndex < updatedForm.pages.length; pageIndex++){
          pageRef[updatedForm.pages[pageIndex]._id] = pageIndex;

          for(var fieldIndex = 0; fieldIndex < updatedForm.pages[pageIndex].fields.length; fieldIndex++){
            fieldRef[updatedForm.pages[pageIndex].fields[fieldIndex]._id] = {};
            fieldRef[updatedForm.pages[pageIndex].fields[fieldIndex]._id].page = pageIndex;
            fieldRef[updatedForm.pages[pageIndex].fields[fieldIndex]._id].field = fieldIndex;
          }
        }

        fullyPopulatedForm = updatedForm.toJSON();
        fullyPopulatedForm.pageRef = pageRef;
        fullyPopulatedForm.fieldRef = fieldRef;
        cb();
      });
    });
  }

  function constructResultJSON(cb){
    cb();
  }

};

module.exports = getForm;
