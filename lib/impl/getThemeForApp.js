var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var getTheme = function(connections, options, cb) {

  var foundAppTheme = undefined;

  async.series([validateParams, getThemeForAppId], function(err){
    if(err) {
      return cb(err);
    } else {
      cb(undefined, foundAppTheme);
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

  function getThemeForAppId(cb){
    var AppThemes = models.get(connections.mongooseConnection, models.MODELNAMES.APP_THEMES);

    AppThemes.findOne({"appId" : options.appId}).populate("theme", "-__v").select("-__v -_id").exec(function(err, appTheme){
      if(err) return cb(err);

      if(appTheme !== null){
        foundAppTheme = appTheme.theme.toJSON();
        return cb();
      } else {
        return cb(new Error("No theme matches appId " + options.appId));
      }
    });
  }
};

module.exports = getTheme;