var models = require('../common/models.js')();
var validation = require('./../common/validate');

/*
 * getNotifications(connections, options, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *       _id: form object ID
 *    }
 *
 *    subscribers: [
 *      "some@example.com"
 *    ]
 *
 *    cb  - callback function (err)
 *
 */

module.exports = function(connections, options, cb) {
  var conn = connections.mongooseConnection;
  var formModel = models.get(conn, models.MODELNAMES.FORM);
  formModel.findById(options._id).exec(function (err, form) {
    if (err) {
      return cb(err);
    }
    if (!form){
      return cb("No form with id " + options._id + " found");
    }

    return cb(null, { _id : form._id, subscribers : form.subscribers });
  });
};