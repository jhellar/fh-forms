var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var getForms = function(connections, options, cb) {

  var foundAppForms = undefined;
  var resJSON = undefined;

  async.series([validateParams, getFormsForAppId, constructResultJSON], function(err){
    if(err) {
      return cb(err);
    } else {
      cb(undefined, resJSON);
    }
  });

  function validateParams(cb){
    var val = validate(options);
    val.has("appId", function(failed){
      if(failed){
        return cb(new Error("Invalid parameters " + JSON.stringify(failed)));
      } else {
        return cb();
      }
    });
  }

  function getFormsForAppId(cb){
    var AppForms = models.get(connections.mongooseConnection, models.MODELNAMES.APP_FORMS);

    AppForms.findOne({"appId" : options.appId}).populate("forms").exec(function(err, appForm){
      if(err) return cb(err);

      if(appForm !== null){
        foundAppForms = appForm.forms;
      }

      return cb();
    });
  }

  function constructResultJSON(cb){
    var res = {"forms": []};

    if(foundAppForms){
      //There is a form associated with the
      async.eachSeries(foundAppForms, function(foundAppForm, cb){
        var formEntry = {"formId": undefined, "formName": undefined};
        formEntry.formId = foundAppForm._id;
        formEntry.formName = foundAppForm.name;

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
