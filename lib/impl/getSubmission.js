var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

// forms.getSubmission({"uri": mongoUrl}, {"_id" : req.params.submissionId}, function(err, result){
module.exports = function getSubmission(connections, options, params, cb) {
  var formSubmissionModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  formSubmissionModel
  .findOne({"_id" : params._id, "status": "complete"})
  .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
  .exec(function(err, foundSubmission){
    if(err) return cb(err);

    if(foundSubmission === null){
      return cb(new Error("Completed submission with id " + params._id + " not found"));
    }

    return cb(undefined, JSON.parse(JSON.stringify(foundSubmission.toJSON())));
  });

};
