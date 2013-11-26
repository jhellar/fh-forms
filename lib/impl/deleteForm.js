var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

var deleteForm = function(connections, options, cb) {

  async.series([validateParams, deleteFormUsingId], cb);

  function validateParams(cb){
    var validateParams = validate(options);

    if(!(options.getAllForms === true)){
      validateParams.has("_id", function(failure){
        if(failure){
          return cb(new Error("Invalid params to deleteForm: " + JSON.stringify(options)));
        } else {
          return cb();
        }
      });
    } else {
      return cb();
    }
  };

  function deleteFormUsingId(cb){
    var formModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
    var formId = options._id;

    formModel.findById(formId).remove().exec(function(err, data){
      if (err) return cb(err);

      // remove any App Forms
      var appFormsModel = models.get(connections.mongooseConnection, models.MODELNAMES.APP_FORMS);

      // TODO - how exactly to delete a form here??

      return cb(null, data);
    });
  };
};

module.exports = deleteForm;
