var async = require('async');
var models = require('../common/models.js')();

// var Form = models.get(connection, models.MODELNAMES.FORM);
// var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

// var form1 = new Form({
//   "updatedBy": "test@example.com",
//   "name": "Test Form 1",
//   "description": "This is a test form 1."
// });

// var form2 = new Form({"updatedBy": "test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});
// var appId = "123456789";

module.exports = function updateForm(connections, options, formData, cb) {
  var conn = connections.mongooseConnection;
  var formModel =  models.get(conn, models.MODELNAMES.FORM);
  var form;

  function validate(formData, cb) {
    cb();
  }

  function doCreate(formData, cb) {
    form = new formModel({
      "updatedBy": options.userEmail,
      "name": formData.name,
      "description": formData.description
    });
    return cb(undefined, form);
  }

  function doUpdate(formData, cb) {
    formModel.findById(formData._id, function (err, doc) {
      if (err) return cb(err);
      doc.updatedBy =  options.userEmail;
      doc.name = formData.name,
      doc.description = formData.description;
      form = doc;
      return cb(err, doc);
    });
  }

  async.series([
    function (cb) {
      validate(formData, cb);
    },
    function (cb) {
      if(formData._id) {
        doUpdate(formData, cb);
      } else {
        doCreate(formData, cb);
      }
    }
  ], function (err) {
    if (err) return cb(err);

    form.save(cb);
  });
};
