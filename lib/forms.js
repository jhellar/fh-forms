var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var Db = require('mongodb').Db;
var validate = require('./common/validate.js');

var forms = {
  connections: {},

  initConnection : function(options, cb) {
    var self = this;
    var uri = options.uri;
    var key = options.key || uri;

    if( self.connections[key] ) {
      return cb(undefined, self.connections[key]);
    }
    var paramValidation = validate(options);

    paramValidation.has("uri", function(failed){
      if(failed) return cb(new Error("Invalid Params: " + JSON.stringify(failed)));

      Db.connect(uri, function(err, databaseConn){
        if(err) return cb(err);

        var connections =  {
          "databaseConnection": databaseConn,
          "mongooseConnection": mongoose.createConnection(uri)
        };

        self.connections[key] = connections;

        models.init(connections.mongooseConnection); //Initialise the models on the created mongoose connection.

        return cb(undefined, connections); //Successfull completion of connection, no error returned.
      });
    });
  },

  tearDownConnection : function(options, cb) {
    var self = this;
    var uri = options.uri;
    var key = options.key || uri;


    if( self.connections[key] ) {
      self.connections[key].mongooseConnection.close(function(err, ok){
        if(err) console.log(err);

        self.connections[key].databaseConnection.close(function(err, ok){
          if(err) console.log(err);

          delete self.connections[key];

          return cb(err);
        });
      });
    } else  {
      cb(null);
    }
  },

  getForms: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;

      return require('./impl/getForms.js')(connections, options, cb);
    });
  },

  getForm: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/getForm.js')(connections, options, cb);
      });
  },

  getAllForms: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      options.getAllForms = true;
      return require('./impl/getForm.js')(connections, options, cb);
    });
  },

  deleteForm : function(options, cb){
    var self = this;
    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);
      return require('./impl/deleteForm.js')(connections, options, cb);
    });
  },

  getTheme: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;

      if(options.appId){
        return require('./impl/getThemeForApp.js')(connections, options, cb);
      } else {
        return require('./impl/getTheme.js')(connections, options, cb);
      }
    });
  },

  updateTheme : function(options, themeData, cb){
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/updateTheme.js')(connections, options, themeData, cb);
    });
  },

  deleteTheme : function(options, cb){
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);
      return require('./impl/deleteTheme.js')(connections, options, cb);
    });
  },

  getThemes : function(options, cb){
    var self = this;
    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/getThemes.js')(connections, options, cb);
    });
  },

  updateForm: function(options, formData, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/updateForm.js')(connections, options, formData, cb);
    });
  },

  submitFormData: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/submitFormData.js')(connections, options, cb);
    });
  },

  submitFormFile: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/submitFormFile.js')(connections, options, cb);
    });
  },

  completeFormSubmission: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/completeFormSubmission.js')(connections, options, cb);
    });
  },

  getSubmissionStatus: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/getSubmissionStatus.js')(connections, options, cb);
    });
  },

  updateSubmission : function(options, cb){
    var self = this;
    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return cb(new Error("Not Implemented Yet"));  //TODO Implemenet updateSubmission
    });
  },

  updateSubmissionFile : function(options, cb){
    var self = this;
    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return cb(new Error("Not Implemented Yet"));  //TODO Implemenet updateSubmissionFile
    });
  },

  updateFieldRules: function(options, fieldRules, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/updateRules.js').updateFieldRules(connections, options, fieldRules, cb);
    });
  },

  updatePageRules: function(options, pageRules, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/updateRules.js').updatePageRules(connections, options, pageRules, cb);
    });
  },

  getFormApps: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/formapps.js').getFormApps(connections, options, cb);
    });
  },

  updateAppForms: function(options, appForms, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/appforms.js').updateAppForms(connections, options, appForms, cb);
    });
  },

  getAppFormsForApp: function(options, appId, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/appforms.js').getAppFormsForApp(connections, options, appId, cb);
    });
  },

  getAllAppForms: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err, connections) {
      if(err) return cb(err);

      return require('./impl/appforms.js').getAllAppForms(connections, options, cb);
    });
  },
};

module.exports = forms;