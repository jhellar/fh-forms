var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var getForms = function(connections, options, cb) {

  var foundAppForms = undefined;
  var resJSON = undefined;
  var formStatistics = {}; //Form statistics is

  async.series([validateParams, getFormsForAppId, buildFormStatistics, constructResultJSON], function(err){
    if(err) {
      return cb(err);
    } else {
      return cb(undefined, resJSON);
    }
  });

  function buildFormStatistics(cb){

    //If not getting all of the forms, do not populate statistics...
    if(!(options.getAllForms === true)){
      return cb();
    }

    async.eachSeries(foundAppForms, function(appForm, cb){
      formStatistics[appForm._id] = {};
      formStatistics[appForm._id].appsUsingForm = 12; //TODO --THIS IS DUMMY DATA. NEED TO DO ACUTAL STATISTICS
      formStatistics[appForm._id].submissionsToday = 33; //TODO -- THIS IS DUMMY DATA. NEED TO DO ACTUAL STATISTICS
      formStatistics[appForm._id].submissionsTotal = 22; //TODO -- THIS IS DUMMY DATA. NEED TO DO ACTUAL STATISTICS
      cb();
    }, cb);
  }

  function validateParams(cb){
    var val = validate(options);

    //If the getAllForms parameter is set to true, then the appId will not be included.
    if(options.getAllForms === true){
      return cb();
    }

    val.has("appId", function(failed){
      if(failed){
        return cb(new Error("Invalid parameters " + JSON.stringify(failed)));
      } else {
        return cb();
      }
    });
  }

  function getFormsForAppId(cb){

    if(!(options.getAllForms === true)){
      findAppForms(cb);
    } else {
      findAllForms(cb);
    }
  }

  function findAppForms(cb){
    var AppForms = models.get(connections.mongooseConnection, models.MODELNAMES.APP_FORMS);
    var query = {"appId" : options.appId};
    AppForms.findOne(query).populate("forms").exec(function(err, appForm){
      if(err) return cb(err);

      if(appForm !== null){
        foundAppForms = appForm.forms;
      }

      return cb();
    });
  }

  function findAllForms(cb){
    var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
    Form.find({}).exec(function(err, form){
      if(err) return cb(err);

      if(form !== null){
        foundAppForms = form;
      }

      return cb();
    });
  }

  function constructResultJSON(cb){
    var res = {"forms": []};
    if(foundAppForms){
      //There is a form associated with the
      async.eachSeries(foundAppForms, function(foundAppForm, cb){
        var formEntry = {"_id": undefined, "formName": undefined, "lastUpdated" : undefined, "description" : ""};
        formEntry._id = foundAppForm._id;
        formEntry.formName = foundAppForm.name;
        formEntry.lastUpdated = foundAppForm.lastUpdated.toUTCString();
        formEntry.lastUpdatedTimestamp = foundAppForm.lastUpdated.getTime();

        if(foundAppForm.description){
          formEntry.description = foundAppForm.description;
        }

        //If getting all the forms, need to submit statistics... TODO currently dummy data.
        if(options.getAllForms === true){
          formEntry.appsUsingForm = formStatistics[foundAppForm._id].appsUsingForm;
          formEntry.submissionsToday = formStatistics[foundAppForm._id].submissionsToday;
          formEntry.submissionsTotal = formStatistics[foundAppForm._id].submissionsTotal;
        }

        res.forms.push(formEntry);

        return cb();
      }, function(err){
        resJSON = res;
        return cb(err);
      });
    } else {
      resJSON = res;
      return cb();
    }
  }
};

module.exports = getForms;
