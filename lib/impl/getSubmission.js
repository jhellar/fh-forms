var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

// forms.getSubmission({"uri": mongoUrl}, {"_id" : req.params.submissionId}, function(err, result){
module.exports = function getSubmissions(connections, options, params, cb) {
  var formSubmissionModelModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  formSubmissionModel
    .find({"_id" : params._id, "status": "complete"})
    .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
    .populate({"path": "formFields.fieldValues"})
    .exec(function(err, foundSubmission){
      if(err) return cb(err);

      if(foundSubmission === null){
        return cb(new Error("Completed submission with id " + params._id + " not found"));
      }

      return cb(undefined, result);
    });
  });
};