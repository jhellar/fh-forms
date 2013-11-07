var async = require('async');
var models = require('../common/models.js')();

/*
 * updateForm(connections, options, formData, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    formData: {
 *       name: name of form string
 *       description: description of form string
 *    }
 *
 *    cb  - callback function (err, newDataDocument)
 *
 */
module.exports = function updateForm(connections, options, formData, cb) {
  var conn = connections.mongooseConnection;
  var formModel =  models.get(conn, models.MODELNAMES.FORM);
  var form;

  function validate(formData, cb) {
    return cb();
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
