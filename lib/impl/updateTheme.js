var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var themeCSSGenerator = require('../common/themeCSSGenerator.js').themeCSSGenerator;
var async = require('async');
var groups = require('./groups.js');

var THEME_UPDATE_FIELDS = [
  "updatedBy",
  "name",
  "sections",
  "css"
];

module.exports = function (connections, options, themeData, cb) {
  async.waterfall([
    function(cb) {
      validateParams(themeData, cb);
    },
    generateThemeCSS,
    doCreateOrUpdate
  ], function (err, theme) {
    if (err) return cb(err);
    return cb(undefined, theme.toJSON());
  });

  function validateParams(themeData, cb) {
    var val = validate(themeData);
    val.has("name", "sections", function (failed) {
      if (failed) {
        return cb(new Error("Invalid parameters for updateTheme. Params: name, sections are required. "));
      } else {
        return cb(undefined, themeData);
      }
    });
  }

  function doCreateOrUpdate(newThemeDataWithCSS, cb) {
    if(newThemeDataWithCSS._id) {
      groups.validateThemeAllowedForUser(connections, options.restrictToUser, newThemeDataWithCSS._id, function (err) {
        if (err) return cb(err);
        doUpdate(newThemeDataWithCSS._id, newThemeDataWithCSS, cb);
      });
    } else {
      doCreate(newThemeDataWithCSS, function (err, themeData) {
        if (err) return cb(err);
        groups.addThemeToUsersGroups(connections, options.restrictToUser, themeData._id.toString(), function (err) {
          return cb(undefined, themeData);
        });
      });
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

  function generateThemeCSS(newThemeData, cb){
    var themeJSON = newThemeData;

    var themeCSSResult = themeCSSGenerator(themeJSON).generateThemeCSS();
    var themeCSSGenerationResult = themeCSSResult.generationResult;
    var generatedThemeCSS = themeCSSResult.generatedCSS;


    if(themeCSSGenerationResult.failed == false){ //Theme generation sucesfully, therefore theme model is valid.
      newThemeData.css = generatedThemeCSS;
      return cb(undefined, newThemeData);
    } else { //Css Generation Failed. not saving the data.
      return cb(new Error("Error generating theme " + JSON.stringify(themeCSSGenerationResult)));
    }
  }
};
