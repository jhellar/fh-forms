var async = require('async');
var util = require('util');
var models = require('../common/models.js')();
var validation = require('./../common/validate');

exports.updateAppForms = updateAppForms;
exports.getAppForms = getAppForms;

/*
 * updateAppForms(connections, options, appForms, cb)
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
 *    appForms: {
 *      appId: id of the App
 *      forms: array of formIds
 *    }
 *
 *    cb  - callback function (err)
 *
 */

function updateAppForms(connections, options, appForms, cb) {
  var validate = validation(appForms);
  function validateParams(cb) {
    validate.has("appId","forms",cb);
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var formModel = models.get(conn, models.MODELNAMES.FORM);
    var appFormsModel = models.get(conn, models.MODELNAMES.APP_FORMS);
    var appId = appForms.appId;
    var forms = appForms.forms;

    appFormsModel.findOne({appId:appId}).exec(function (err, af) {
      if (err) return cb(err);
      if (af) {
        af.forms = appForms.forms;
        var afClone = JSON.parse(JSON.stringify(af));
        delete afClone._id;
        appFormsModel.update({_id: af._id}, afClone, function(err){
          if (err) return cb(err);
          appFormsModel.findOne({appId:appId}).exec(cb);
        });
      }else {
        var afm = new appFormsModel(appForms);
        afm.save(function(err, doc) {
          if (err) return cb(err);
          return cb(null, doc);
        });
      }
    });
  });
};

/*
 * getAppForms(connections, options, cb)
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
 *    appId: the App Id
 * 
 *    cb  - callback function (err)
 *
 */

function getAppForms(connections, options, appId, cb) {
  var conn = connections.mongooseConnection;
  var appFormsModel = models.get(conn, models.MODELNAMES.APP_FORMS);
  appFormsModel.findOne({appId:appId}).exec(function (err, af) {
    if (err) return cb(err);
    return cb(null, af);
  });

};
