var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var themeCSSGenerator = require('../common/themeCSSGenerator.js').themeCSSGenerator;
var async = require('async');

var THEME_UPDATE_FIELDS = [
  "updatedBy",
  "name",
  "logo",
  "colours",
  "typography",
  "borders"
];

module.exports = function (connections, options, themeData, cb) {
  async.waterfall([
    function(cb) {
      validateParams(themeData, cb);
    },
    doCreateOrUpdate,
    generateThemeCSS
  ], function (err, theme) {
    if (err) return cb(err);
    return cb(undefined, theme.toJSON());
  });

  function validateParams(themeData, cb) {
    var val = validate(themeData);
    val.has("name", "colours", "typography", "borders", function (failed) {
      if (failed) {
        return cb(new Error("Invalid parameters " + JSON.stringify(failed)));
      } else {
        return cb(undefined, themeData);
      }
    });
  }

  function doCreateOrUpdate(themeData, cb) {
    if(themeData._id) {
      doUpdate(themeData._id, themeData, cb);
    } else {
      doCreate(themeData, cb);
    }
  }

  function doCreate(themeData, cb) {
    var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);
    var theme = new themeModel(themeData);
    theme.save(function(err, savedTheme){
      return cb(err, savedTheme);
    });
  }

  function doUpdate(themeId, themeData, cb) {
    async.waterfall([
      function (cb) {
        getTheme(themeId, themeData, cb);
      },
      doUpdateTheme
    ], cb);
  } 

  function getTheme(themeId, themeData, cb){
    var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

    themeModel.findById(themeId, function(err, theme){
      if(err) return cb(err);

      if(theme !== null){
        return cb(undefined, theme, themeData);
      } else {
        return cb(new Error("No theme matches id " + themeId));
      }
    });
  }

  function doUpdateTheme(theme, themeData, cb){
    // need to iterate, model.update() doesn't run validation!
    async.eachSeries(THEME_UPDATE_FIELDS, function (fieldName, cb) {
      if(fieldName !== "_id") {  // don't update the _id field;
        theme[fieldName] = themeData[fieldName];
      }
      return cb();
    }, function (err) {
      if(err) return cb(err);
      theme.save(function(err, savedTheme){
        return cb(err, savedTheme);
      });
    });
  }

  function generateThemeCSS(updatedTheme, cb){
    var themeJSON = updatedTheme.toJSON();

    var themeCSSDefinition = themeCSSGenerator(themeJSON)();

    if(themeCSSDefinition != null){
      updatedTheme.css = themeCSSDefinition;

      updatedTheme.save(function(err, savedTheme){
        return cb(err, savedTheme);
      });
    } else {
      return cb(undefined, updatedTheme);
    }
  }
};
