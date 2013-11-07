require('./Fixtures/env.js');
var forms = require('../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "123456789";

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      test.finish();
    });
  });
}

module.exports.finalize = function(test, assert){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testGetFormsWorks = function(test, assert){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);

    assert.isDefined(result);
    assert.isDefined(result.forms);
    assert.ok(Array.isArray(result.forms));
    assert.ok(result.forms.length === 2);// Should have 2 forms associated with the appId

    checkForm(assert, result.forms[0], {"formName": "Test Form 1"});
    checkForm(assert, result.forms[1], {"formName": "Test Form 2"});

    test.finish();
  });
}

module.exports.testGetFormsNoUri = function(test, assert){
  forms.getForms({}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    test.finish();
  });
}

module.exports.testGetFormsNoAppId = function(test, assert){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    test.finish();
  });
}

module.exports.testGetFormsNoAppExists = function(test, assert){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": "theWrongId"}, function(err, result){
    assert.ok(!err);
    assert.isDefined(result);
    assert.isDefined(result.forms);
    assert.ok(Array.isArray(result.forms));
    assert.ok(result.forms.length === 0);
    test.finish();
  });
}

function checkForm(assert, form, options){
  assert.isDefined(form);
  assert.eql(form.formName, options.formName, "Expected form names to be equal");
  assert.isDefined(form.formId);
}

function createTestData(assert, cb){

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

  var form1 = new Form({"updatedBy": "test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

  //Save the forms
  async.series([function(cb){
    form1.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }, function(cb){
    form2.save(function(err){
      assert.ok(!err);

      cb(err);
    });
  }], function(err){
    assert.ok(!err);

    console.log("Forms Saved");
    //Now save the forms with the appId
    var appForm1 = new AppForm({"appId": appId});
    appForm1.forms.push(form1);
    appForm1.forms.push(form2);

    async.series([function(cb){
      appForm1.save(function(err){
        assert.ok(!err);

        cb(err);
      });
    }], function(err){
      assert.ok(!err);

      connection.close(function(err){
        if(err) console.log(err);
        cb();
      });
    });
  });
};