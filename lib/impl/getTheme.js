var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

module.exports = function (connections, options, cb) {
  async.waterfall([
    async.apply(validateParams, options), 
    getTheme
  ], cb);

  function validateParams(options, cb) {
    var val = validate(options);
    val.has('_id', function (failed){
      if (failed) {
        return cb(new Error("Invalid parameters " + JSON.stringify(failed)));
      } else {
        return cb(undefined, options._id);
      }
    });
  }

  function getTheme(themeId, cb){
    var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

    themeModel.findById(themeId).select("-__v").exec(function(err, theme){
      if(err) return cb(err);

      if(theme !== null){
        return cb(undefined, theme.toJSON());
      } else {
        return cb(new Error("No theme matches appId " + options.appId));
      }
    });
  }
};
