var getTheme = require('./getTheme.js');
var updateTheme = require('./updateTheme.js');
var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var misc = require('../common/misc.js');
var async = require('async');
var _ = require('underscore');

module.exports = function(connections, options, cb) {
  var invalid = validate(options).has("name");
  if (invalid) {
    return cb(misc.buildErrorResponse({
      error: new Error("Invalid Arguments To Clone A Theme."),
      code: models.CONSTANTS.ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
    }));
  }
  //First get a form

  async.waterfall([
    function(cb) {
      //If the form is supplied as an argument, it does not exist in the database. Useful for importing for temlates.
      if (_.isObject(options.theme)) {
        return cb(undefined, options.theme);
      }

      getTheme(connections, options, cb);
    },
    function(themeToClone, cb) {
      //Updating the theme

      themeToClone = _.omit(themeToClone, "_id");
      themeToClone.name = options.name;
      themeToClone.description = options.description || themeToClone.description;

      updateTheme(connections, _.extend(options, {
        createIfNotFound: true
      }), themeToClone, cb);
    }
  ], cb);
};
