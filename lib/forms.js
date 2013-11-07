var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var Db = require('mongodb').Db;
var validate = require('./common/validate.js');

var forms = {
  mongooseConnections : {},
  databaseConnections : {},

  initConnection : function(options, cb) {
    var self = this;
    var uri = options.uri;
    var key = options.key || uri;

    var paramValidation = validate(options);

    paramValidation.has("uri", function(failed){
      if(failed) return cb(new Error("Invalid Params: " + JSON.stringify(failed)));

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
    } else  {
      cb(null);
    }
  },

  getForms: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;

      return require('./impl/getForms.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  },

  getForm: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/getForm.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  },

  getTheme: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/getTheme.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  },

  submitFormData: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/submitFormData.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  },

  submitFormFile: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/submitFormFile.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  },

  completeFormSubmission: function(options, cb) {
    var self = this;

    self.initConnection(options, function(err) {
      if(err) return cb(err);

      var key = options.key || options.uri;
      return require('./impl/completeFormSubmission.js')({"mongooseConnection": self.mongooseConnections[key], "databaseConnection": self.databaseConnections[key]}, options, cb);
    });
  }
};

module.exports = forms;