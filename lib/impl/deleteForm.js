var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');
var util = require('util');

var deleteForm = function(connections, options, cb) {

  async.series([validateParams, deleteFormUsingId], cb);

  function validateParams(cb){
    var validateParams = validate(options);
    validateParams.has("_id", function(failure){
      if(failure){
        return cb(new Error("Invalid params to deleteForm. No form Id specified."));
      } else {
        return cb();
      }
    });
  };

  // updates to AppForms sub collection
  function updateAppForms(formId, cb) {
    var appFormsModel = models.get(connections.mongooseConnection, models.MODELNAMES.APP_FORMS);
    appFormsModel.find({forms: formId}).exec(function (err, apps) {
      if (err) return cb(err);

      function removeAppForm(app, callback) {
        var forms = app.forms;
        var newForms = [];
        forms.forEach(function(form) {
          if (!form.equals(formId)) newForms.push(form.toString());
        });
        appFormsModel.findById(app._id).exec(function(err, a) {
          if (err) return callback(err);
          a.forms = newForms;
          a.save(callback);
        });
      };
      async.map(apps, removeAppForm, cb);
    });
  };

  // delete submissions for this form
  function deleteSubmissions(formId, cb) {
    var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);

    formSubmissionModel
    .find({"formId" : formId})
    .remove()
    .exec(cb);
  };

  function deleteFormUsingId(cb){
    var formModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);
    var formId = options._id;

    // first remove the form itself
    formModel.findById(formId).remove().exec(function(err, data){
      if (err) return cb(err);

      // then remove the AppForms
      updateAppForms(formId, function(err){
        if (err) return cb(err);

        // remove submissions
        deleteSubmissions(formId, function(err) {
          if (err) return cb(err);

          return cb(null, data);
        });
      });
    });
  };
};

module.exports = deleteForm;
