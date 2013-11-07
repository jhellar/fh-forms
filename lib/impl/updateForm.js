var async = require('async');
var models = require('../common/models.js')();
var validation = require('./../common/validate');

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
  var validate = validation(formData);

  var conn = connections.mongooseConnection;
  var formModel = models.get(conn, models.MODELNAMES.FORM);
  var form;

  function validateParams(cb) {
    validate.has("name","description",cb);
  }

  function doCreatePage(trackPageIds, pageToCreate, cb) {
    var pageModel = models.get(conn, models.MODELNAMES.PAGE);

    async.series([
      function(cb) {
        var err;
        if(pageToCreate._id) {
          err = {"code": 400, "message": "New page should not have _id field"};
        }
        return cb(err);
      },
      function(cb) {
        var page = new pageModel(pageToCreate);
        page.save(function(err, doc) {
          if(err) return cb(err);
          trackPageIds.push(doc._id); 
          return cb();
        });
      }
    ], function (err) {
      return cb(err);
    });
  }

  function doCreate(formData, cb) {
    var pageIds = [];
    var pages = formData.pages;
    async.each(
      pages,
      async.apply(doCreatePage, pageIds),
      function(err){
        form = new formModel({
          "updatedBy": options.userEmail,
          "name": formData.name,
          "description": formData.description,
          "pages": pageIds
        });
        return cb(undefined, form);
      }
    );
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
    validateParams,
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
