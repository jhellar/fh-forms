var async = require('async');
var models = require('../common/models.js')();
var validation = require('./../common/validate');
var _ = require('underscore');

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
  var pageModel = models.get(conn, models.MODELNAMES.PAGE);

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

  //sorts the forms pagess into updates, deletes and creations
  function sortPages(form, postedPages, cb){
    var dbPageIds = form.pages || [];
    var idSorted = [];
    var toAdd = [];
    var toUpdate = [];
    var toDelete = [];

    async.parallel([
      function mapDBIds (callback){
        async.map(dbPageIds, function (it,cb){
             cb(undefined, it.toString());
        }, callback);
      },
      function mapPostedIds (callback){
        async.map(postedPages,function (f,c){
          var theId = f._id;
          if(theId){
            var strValue = theId.toString();
            idSorted[theId] = f;
            delete idSorted[theId]._id; // remove the _id field so we can update later
            c(undefined, strValue);
          }
          else{
            toAdd.push(f);
            c();
          }
        },callback);
      }
    ], function done(err, oks){
      if(err){
        cb(err);
      }else{
        var inDB = oks[0];
        async.filter(oks[1], function(item, cb) {
          return cb(!!item);
        }, function(toUpdate) {
          toDelete = _.difference(inDB,toUpdate);

          cb(undefined, form, toDelete, toAdd, toUpdate, idSorted);

        });
      }
    });
  }

  function deletePages(form, toDelete, toAdd, toUpdate, idSorted, cb){
    async.each(toDelete, function deletePage (delId, callback){
     pageModel.findByIdAndRemove(delId,function (err){
       if(err){
         callback(err);
       }else{
         var index = form.pages.indexOf(delId);
         if(-1 !== index){
           form.pages.splice(index,1);
           callback();
         }
       }
     });
    }, function (err) {
      return cb(err, form, toAdd, toUpdate, idSorted);
    });
  }

  function createPages(form, toAdd, toUpdate, idSorted, cb){
    async.each(toAdd, function createPage (item, callback){
      var f = new pageModel(item);
      f.save(function (err, ok){
        if(err) callback(err);
        else{
          form.pages.push(ok._id);
          callback();
        }
      });
    }, function (err) {
      return cb(err, form, toUpdate, idSorted);
    });
  }

  function updatePages(form, toUpdate, idSorted, cb) {
    async.each(toUpdate, function updatePage (item, callback){
      pageModel.update({_id: item}, idSorted[item], callback);
    }, function (err) {
      return cb(err, form, idSorted);
    });  
  }

  function doUpdate(formData, cb) {
    formModel.findById(formData._id, function (err, doc) {
      if (err) return cb(err);
      var postedPages = formData.pages || [];

      async.waterfall([
        async.apply(sortPages, doc, postedPages),
        deletePages,
        createPages,
        updatePages
      ],function (err, ok){
        if(err) cb(err);

        doc.updatedBy = options.userEmail;
        doc.name = formData.name;
        doc.description = formData.description;
        form = doc;
        return cb(err, doc);
      });
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
