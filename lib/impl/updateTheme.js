var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var THEME_UPDATE_FIELDS = [
  "updatedBy",
  "name",
  "logo",
  "colours",
  "typeography",
  "borders"
];

module.exports = function (connections, options, themeData, cb) {
  async.waterfall([
    function(cb) {   //async.apply(validateParams, options), 
      validateParams(themeData, cb);
    },
    doCreateOrUpdate
  ], function (err, theme) {
    if (err) return cb(err);
    return cb(undefined, theme.toJSON());
  });

  function validateParams(themeData, cb) {
    var val = validate(themeData);
    val.has("name", "colours", "typeography", "borders", function (failed) {
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
    theme.save(cb);
  }

  function doUpdate(themeId, themeData, cb) {
    async.waterfall([
      function (cb) { //      async.apply(getTheme, themeId, options)
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
      theme.save(cb);
    });
  }
};
