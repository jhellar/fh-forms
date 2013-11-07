require('./Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../lib/common/models.js')();
var forms = require('../lib/forms.js');
var initDatabase = require('./setup.js').initDatabase;

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL, userEmail: "testUser@example.com"};

var connection;
var formModel;

var TEST_FORM_SIMPLE = {
    "name": "Simple Empty Form",
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};
var TEST_FORM_SIMPLE_TO_BE_UPDATED = {
    "name": "Simple Empty Form",
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};
var TEST_FORM_NO_NAME = {
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};
var TEST_FORM_NO_DESCR = {
    "name": "Simple Empty Form",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [],
    "fieldRules": [],
    "pageRules": []
};
var TEST_FORM_EMPTY_OBJ = {};

var TEST_PAGE_NAME1 = 'page1';
var TEST_PAGE_NAME2 = 'page2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2];
var TEST_FORM_2EMPTY_PAGES = {
    "name": "Simple Form with 2 empty pages",
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [{
      name: TEST_PAGE_NAME1,
      description: 'this is page 1'
    }, {
      name: TEST_PAGE_NAME2,
      description: 'this is page 2'
    }],
    "fieldRules": [],
    "pageRules": []
};

module.exports.initialize = function(test, assert){
  initDatabase(assert, function(err) {
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    test.finish();
  });
};

module.exports.finalize = function(test, assert){
  connection.close(function(err) {
    assert.ok(!err);
    test.finish();
  });
};

module.exports.setUp = function(test, assert){
  formModel = models.get(connection, models.MODELNAMES.FORM);
  test.finish();
};

module.exports.tearDown = function(test, assert){
  forms.tearDownConnection(options, function (err) {
    assert.ok(!err);
    test.finish();
  });
};

function assertFormNamedNotFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.isNull(data, msg + util.inspect(data));
    cb();
  });
}

function assertFormNamedFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.isNotNull(data, msg + util.inspect(data));
    cb();
  });
}

module.exports.testUpdateForm = function(test, assert){
  var myOrigForm = JSON.parse(JSON.stringify(TEST_FORM_SIMPLE_TO_BE_UPDATED));
  var myUpdForm = JSON.parse(JSON.stringify(TEST_FORM_SIMPLE_TO_BE_UPDATED));
  myOrigForm.name += "Original " + Date.now();
  myUpdForm.name += "Updated " + Date.now();

  async.series([
    async.apply(assertFormNamedNotFound, assert, myOrigForm.name, 'should not have found form - not added yet - found: '),
    async.apply(assertFormNamedNotFound, assert, myUpdForm.name, 'should not have found form - not updated yet - found: '),
    function(cb) {
      forms.updateForm(options, myOrigForm, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        assert.ok(doc._id, 'document should have been returned with an id - doc: ' + util.inspect(doc._id));
        myUpdForm._id = doc._id;
        cb();
      });
    },
    async.apply(assertFormNamedFound, assert, myOrigForm.name, 'should have found form - data: '),
    async.apply(assertFormNamedNotFound, assert, myUpdForm.name, 'should not have found form - not updated yet - found: '),
    function(cb) {
      forms.updateForm(options, myUpdForm, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        assert.ok(doc._id, 'document should have been returned with an id - doc: ' + util.inspect(doc._id));
        cb();
      });
    },
    async.apply(assertFormNamedNotFound, assert, myOrigForm.name, 'should not have found form - has been renamed - found: '),
    async.apply(assertFormNamedFound, assert, myUpdForm.name, 'should have found updated form - data: ')  
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testAddForm = function(test, assert) {
  async.series([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_SIMPLE.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_SIMPLE, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_SIMPLE.name}, function (err, data) {
        assert.ok(!err, 'should have found form');
        assert.strictEqual(data.formDescription, TEST_FORM_SIMPLE.formDescription, "new description should ahve been added");
        assert.strictEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testAddFormWith2EmptyPages = function(test, assert) {
  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_2EMPTY_PAGES.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_2EMPTY_PAGES, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_2EMPTY_PAGES.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assert.strictEqual(data.formDescription, TEST_FORM_2EMPTY_PAGES.formDescription, "new description should ahve been added");
        assert.strictEqual(data.updatedBy, options.userEmail, "updatedBy field should have been set to userEmail");  
        cb(undefined, data);
      });
    },
    function(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assert.strictEqual(populatedFormDoc.pages.length, TEST_PAGE_NAMES.length, 'Incorrect number of pages in created form');
      assert.includes(TEST_PAGE_NAMES, populatedFormDoc.pages[0].name, 'Unexpected page name in created form');
      assert.includes(TEST_PAGE_NAMES, populatedFormDoc.pages[1].name, 'Unexpected page name in created form');
      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');
      return cb();
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    test.finish();
  });
};

module.exports.testInValidForm1 = function(test, assert){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_EMPTY_OBJ, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testInValidForm2 = function(test, assert){
  async.series([
    function(cb) {
      forms.updateForm(options, null, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};

module.exports.testInValidForm3 = function(test, assert){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_NO_DESCR, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};


module.exports.testInValidForm4 = function(test, assert){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_NO_NAME, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    test.finish();
  });
};
