var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var Db = require('mongodb').Db;

var forms = {
  mongooseConnections : {},
  databaseConnections : {},

  initConnection : function(options, cb) {
    var self = this;
    var uri = options.uri;
    var key = options.key || uri;


    if( self.mongooseConnections[key] ) {
      return cb();
    }

    Db.connect(uri, function(err, databaseConn){
      if(err) return cb(err);

      self.databaseConnections[key] = databaseConn;
      self.mongooseConnections[key] = mongoose.createConnection(uri);

      models.init(self.mongooseConnections[key]);//Initialise the models on the created mongoose connection.

      return cb();//Successfull completion of connection, no error returned.
    });
  },

  tearDownConnection : function(options, cb) {
    var self = this;
    var uri = options.uri;
    var key = options.key || uri;


    if( self.mongooseConnections[key] ) {
      self.mongooseConnections[key].close(function(err, ok){
        if(err) console.log(err);

        self.databaseConnections[key].close(function(err, ok){
          if(err) console.log(err);

          delete self.databaseConnections[key];
          delete self.mongooseConnections[key];

          return cb(err);
        });
      });
    }
  },

  getForms: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      return require('./impl/getForms.js')(self, options, cb);
    });
  },

  getForm: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      return require('./impl/getForm.js')(self, options, cb);
    });
  },

  submitFormData: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      return require('./impl/submitFormData.js')(self, options, cb);
    });
  },

  submitFormFile: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      return require('./impl/submitFormFile.js')(self, options, cb);
    });
  },

  completeFormSubmission: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      return require('./impl/completeFormSubmission.js')(self, options, cb);
    });
  }
};

module.exports = forms;