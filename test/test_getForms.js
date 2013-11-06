require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.setUp = function(test, assert){

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

  var form1 = new Form({"updatedBy": "test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  var appId = "123456789";

  //Save the forms
  async.series([function(cb){
    form1.save(function(err){
      assert.isNull(err);

      cb(err);
    });
  }, function(cb){
    form2.save(function(err){
      assert.isNull(err);

      cb(err);
    });
  }], function(err){
    assert.isNull(err);

    console.log("Forms Saved");
    //Now save the forms with the appId
    var appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.isNull(err);

        cb(err);
      });
    }], function(err){
      assert.isNull(err);

      connection.close(function(err){
        if(err) console.log(err);
        test.finish();
      });
    });
  });
};

module.exports.tearDown = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.isNull(err);
    test.finish();
  });
};

module.exports.testGetFormsWorks = function(test, assert){
  test.finish();
}