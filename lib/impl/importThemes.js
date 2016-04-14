
var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var groups = require('./groups.js');
var async = require('async');
var updateTheme = require('./updateTheme.js');
var _ = require('underscore');

module.exports = function(connections, options, themes, cb) {
  var Theme = models.get(connections.mongooseConnection, models.MODELNAMES.THEME);

  async.each(themes, function(theme, cb) {
    Theme.findOneAndUpdate({_id: theme._id}, _.omit(theme, "_id"), {upsert: true}, cb);
  }, cb);
};