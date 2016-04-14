
var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var groups = require('./groups.js');
var async = require('async');

//Exporting all of the themes.
module.exports = function(connections, options, cb) {
  var themeModel = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

  themeModel.find({}).lean().exec(function(err, allThemes) {
    return cb(err, allThemes || []);
  });
};
