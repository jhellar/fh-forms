var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var util = require('util');

module.exports = function (connections, options, cb) {
  async.waterfall([
    async.apply(validateParams, options),
    getThemes,
    getAppsUsingTheme,
    generateReturnJSON
  ], cb);

  function validateParams(options, cb) {
    var val = validate(options);
    return cb();
  }

  function getThemes(cb){
    var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

    themeModel.find().exec(function(err, themes){
      if(err) return cb(err);

      if(themes === null){
        themes = [];
      }

      return cb(undefined, {themes: themes});
    });
  }

  function getAppsUsingTheme(themes, cb){

    var appThemeModel = models.get(connections.mongooseConnection, models.MODELNAMES.APP_THEMES);

    appThemeModel.find().select("-_id").exec(function(err, appThemes){
      if(err) return cb(err);

      if(appThemes === null){
        appThemes = [];
      }

      themes.appThemes = appThemes;
      return cb(undefined, themes);
    });
  }


  function generateReturnJSON(themesAndApps, cb){
    var themesArray = [];

    themesAndApps.themes.forEach(function(themeDef){

      themeDef = themeDef.toJSON();

      var appsUsingTheme = themesAndApps.appThemes.filter(function(appTheme){
        return appTheme.theme.toString() === themeDef._id.toString();
      });

      if(appsUsingTheme === null){
        appsUsingTheme = [];
      }

      themeDef.appsUsingTheme = appsUsingTheme.length;
      themeDef.apps = appsUsingTheme;

      themesArray.push(themeDef);
    });

    return cb(undefined, {"themes" :themesArray});
  }
};
