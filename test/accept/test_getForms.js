require('./../Fixtures/env.js');
var forms = require('../../lib/forms.js');
var mongoose = require('mongoose');
var models = require('../../lib/common/models.js')();
var async = require('async');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};
var appId = "123456789";

module.exports.setUp = function(finish){
  initDatabase(assert, function(err){
    assert.ok(!err);

    createTestData(assert, function(err){
      assert.ok(!err);
      finish();
    });
  });
}

module.exports.tearDown = function(finish){
  forms.tearDownConnection(options, function(err) {
    assert.ok(!err);
    finish();
  });
};

module.exports.testGetFormsWorks = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": appId}, function(err, result){
    assert.ok(!err);

    assert.ok(result);
    assert.ok(result.forms);
    assert.ok(Array.isArray(result.forms));
    assert.ok(result.forms.length === 2);// Should have 2 forms associated with the appId

    checkForm(result.forms[0], {"name": "Test Form 1", "description" : "This is a test form 1."});
    checkForm(result.forms[1], {"name": "Test Form 2", "description" : "This is a test form 2."});

    finish();
  });
};

module.exports.testGetFormsNoUri = function(finish){
  forms.getForms({}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetFormsNoAppId = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(err); // Should get an error here.
    assert.ok(!result);
    finish();
  });
}

module.exports.testGetFormsNoAppExists = function(finish){
  forms.getForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL, "appId": "theWrongId"}, function(err, result){
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result.forms);
    assert.ok(Array.isArray(result.forms));
    assert.ok(result.forms.length === 0);
    finish();
  });
}

module.exports.testGetFormWorksAllForms = function(finish){
  forms.getAllForms({"uri": process.env.FH_DOMAIN_DB_CONN_URL}, function(err, result){
    assert.ok(!err);
    assert.ok(result);
    assert.ok(result.forms);
    assert.equal(2, result.forms.length);

    checkAllForms(result.forms[0], {"name": "Test Form 1", "description" : "This is a test form 1."});
    checkAllForms(result.forms[1], {"name": "Test Form 2", "description" : "This is a test form 2."});


    finish();
  });
};

//Statistics should be generated
module.exports.testGetFormSubmissionStatistics = function(finish){
  finish();
};

function checkAllForms(formToCheck, options){
  checkForm(formToCheck, options);
  assert.ok(formToCheck.lastUpdated);
  assert.ok(formToCheck.appsUsingForm !== undefined);
  assert.ok(formToCheck.submissionsToday !== undefined);
  assert.ok(formToCheck.submissionsTotal !== undefined);
}

function checkForm(form, options){
  assert.ok(form);
  assert.equal(form.name, options.name, "Expected " + options.name + " got " + form.name);
  assert.ok(form._id);
  assert.equal(form.description, options.description, "Expected " + options.description + " got " + form.description);
  assert.ok(form.lastUpdated);
  assert.ok(form.lastUpdatedTimestamp);
}

function createTestData(assert, cb){

  var connection = mongoose.createConnection(options.uri);

  //Set up the connection
  models.init(connection);

  var Form = models.get(connection, models.MODELNAMES.FORM);
  var AppForm = models.get(connection, models.MODELNAMES.APP_FORMS);

  var form1 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 1", "description": "This is a test form 1."});
  var form2 = new Form({"updatedBy": "test@example.com", "createdBy":"test@example.com", "name": "Test Form 2", "description": "This is a test form 2."});

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