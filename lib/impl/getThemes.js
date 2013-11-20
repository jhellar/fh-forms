var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var util = require('util');

module.exports = function (connections, options, cb) {
  async.waterfall([
    async.apply(validateParams, options),
    getThemes
  ], cb);

  function validateParams(options, cb) {
    var val = validate(options);
    return cb();
  }

  function getThemes(cb){
    var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

    themeModel.find().exec(function(err, themes){
      if(err) return cb(err);
      return cb(undefined, JSON.stringify({themes: themes}));
    });
  }
};
