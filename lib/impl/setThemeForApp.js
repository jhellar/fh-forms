var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var setThemeForApp = function(connections, options, cb) {

  var foundAppTheme = undefined;

  async.series([validateParams, setThemeForAppId], function(err){
    if(err) {
      return cb(err);
    } else {
      cb(undefined, foundAppTheme);
    }
  });

  function validateParams(cb){
    var val = validate(options);
    val.has("appId", 'theme', function(failed){
      if(failed){
        return cb(new Error("Invalid parameters " + JSON.stringify(failed)));
      } else {
        return cb();
      }
    });
  };

  function setThemeForAppId(cb){
    var AppThemes = models.get(connections.mongooseConnection, models.MODELNAMES.APP_THEMES);

    AppThemes.findOne({"appId" : options.appId}).populate("theme", "-__v").select("-__v -_id").exec(function(err, appTheme){
      if(err) return cb(err);

      if(appTheme){
        appTheme.theme = options.theme;
        appTheme.save(cb);
      } else {
        var at = {
          appId: options.appId,
          theme: options.theme
        };
        var atm = new AppThemes(at);
        atm.save(cb);
      }
    });
  };
};

module.exports = setThemeForApp;