var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var getForm = function(connections, options, cb) {
  var populatedForms = undefined;
  var resultJSON = undefined;



  async.series([validateParams, getFormUsingId, constructResultJSON], function(err){
    return cb(err, resultJSON);
  });

  function validateParams(cb){
    var validateParams = validate(options);

    if(!(options.getAllForms === true)){
      validateParams.has("_id", function(failure){
        if(failure){
          return cb(new Error("Invalid params to getForm. FormId Not specified"));
        } else {
          return cb();
        }
      });
    } else {
      return cb();
    }
  }

  function getFormUsingId(cb){
    var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
    var Page = models.get(connections.mongooseConnection, models.MODELNAMES.PAGE);
    var Field = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);
    var query = {};

    if(options.getAllForms === true){
      query = {}
    }else{
      query = {"_id": options._id};
    }

    Form.find(query).populate("pages", "-__v").populate("pageRules", "-__v").populate("fieldRules", "-__v").select("-__v").exec(function(err, formResults){
      if(err) return cb(err);


      if((formResults === null || formResults === undefined) && !(options.getAllForms === true)){
        return cb(new Error("No form exists matching id " + options._id));
      }

      //Now have a form with all pages, pageRules and fieldRules populated
      Form.populate(formResults, {"path": "pages.fields", "model": Field, "select": "-__v"}, function(err, updatedForms){
        if(err) return cb(err);


        populatedForms = updatedForms;

        cb();
      });
    });
  }

  function constructResultJSON(cb){

    if(!(options.getAllForms === true)){
      if (populatedForms.length === 0) return cb(null, null);
      if(populatedForms.length !== 1){
        return cb(new Error("Invalid number of forms returned " + populatedForms.length));
      }
    } else {
      resultJSON = {"forms" : []};
    }



    async.eachSeries(populatedForms, function(formToReturn, cb){
      var pageRef = {};
      var fieldRef = {};


      var fullyPopulatedForm;
      //Generating a handy page ref to use for getting page numbers.
      for(var pageIndex = 0; pageIndex < formToReturn.pages.length; pageIndex++){
        pageRef[formToReturn.pages[pageIndex]._id] = pageIndex;

        for(var fieldIndex = 0; fieldIndex < formToReturn.pages[pageIndex].fields.length; fieldIndex++){
          fieldRef[formToReturn.pages[pageIndex].fields[fieldIndex]._id] = {};
          fieldRef[formToReturn.pages[pageIndex].fields[fieldIndex]._id].page = pageIndex;
          fieldRef[formToReturn.pages[pageIndex].fields[fieldIndex]._id].field = fieldIndex;
        }
      }

      //AppsUsing
      fullyPopulatedForm = formToReturn.toJSON();
      fullyPopulatedForm.pageRef = pageRef;
      fullyPopulatedForm.fieldRef = fieldRef;
      fullyPopulatedForm.appsUsingForm = 123; //TODO THIS IS MOCK DATA. NEEDS SOME LOGIC
      fullyPopulatedForm.submissionsToday = 1234; //TODO, THIS IS MOCK DATA> NEEDS LOGIC
      fullyPopulatedForm.submissionsTotal = 124125; //TODO, THIS IS MOCK DATA> NEEDS LOGIC

      if(!(options.getAllForms === true)){
        resultJSON = fullyPopulatedForm;
      } else {
        resultJSON.forms.push(fullyPopulatedForm);
      }

      return cb();
    }, cb);
  }

};

module.exports = getForm;
