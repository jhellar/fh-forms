require('./../Fixtures/env.js');
var mongoose = require('mongoose');
var async = require('async');
var util = require('util');
var models = require('../../lib/common/models.js')();
var forms = require('../../lib/forms.js');
var initDatabase = require('./../setup.js').initDatabase;
var assert = require('assert');

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
var TEST_PAGE_DESCRIPTION1 = 'this is page 1';
var TEST_PAGE_NAME2 = 'page2';
var TEST_PAGE_DESCRIPTION2 = 'this is page 2';
var TEST_PAGE_NAMES = [TEST_PAGE_NAME1, TEST_PAGE_NAME2];
var TEST_FORM_2EMPTY_PAGES = {
    "name": "Simple Form with 2 empty pages",
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [{
      name: TEST_PAGE_NAME1,
      description: TEST_PAGE_DESCRIPTION1
    }, {
      name: TEST_PAGE_NAME2,
      description: TEST_PAGE_DESCRIPTION2
    }],
    "fieldRules": [],
    "pageRules": []
};

var TEST_FORM_UPDATE_2EMPTY_PAGES = {
    "name": "Simple Form with 2 empty pages to be updated",
    "description": "This is my form. It has no fields!",
    "lastUpdated": "2013-10-16 06:13:52",
    "pages": [{
      name: TEST_PAGE_NAME1,
      description: TEST_PAGE_DESCRIPTION1
    }, {
      name: TEST_PAGE_NAME2,
      description: TEST_PAGE_DESCRIPTION2
    }],
    "fieldRules": [],
    "pageRules": []
};

var TEST_UPDATED_PAGE2_DESCRIPTION = 'this is the updated description of page 2';
var TEST_PAGE_NAME3 = 'newPage3';
var TEST_PAGE_DESCRIPTION3 = 'new Page descr 3';
var TEST_UPDATED_PAGE3 = {
  name: TEST_PAGE_NAME3,
  description: TEST_PAGE_DESCRIPTION3
};
var TEST_PAGE_NAMES_AFTER_UPDATE = [TEST_PAGE_NAME2,TEST_PAGE_NAME3];

module.exports.setUp = function(finish){
  initDatabase(assert, function(err) {
    assert.ok(!err);
    connection = mongoose.createConnection(options.uri);
    models.init(connection);
    formModel = models.get(connection, models.MODELNAMES.FORM);
    finish();
  });
};

module.exports.tearDown = function(finish){
  connection.close(function(err) {
    assert.ok(!err);
    forms.tearDownConnection(options, function (err) {
      assert.ok(!err);
      finish();
    });
  });
};

function assertFormNamedNotFound(assert, name, msg, cb) {
  formModel.remove({name: name}, function(err){
    assert.ok(!err, "Unexpected Error: " + util.inspect(err));
    formModel.findOne({name: name}, function (err, data) {
      assert.ok(!err, 'should not return error: ' + util.inspect(err));
      assert.equal(data, null, msg + util.inspect(data));
      cb();
    });
  });
}

function assertFormNamedFound(assert, name, msg, cb) {
  formModel.findOne({name: name}, function (err, data) {
    assert.ok(!err, 'should not return error: ' + util.inspect(err));
    assert.ok(data, msg + util.inspect(data));
    cb();
  });
}

module.exports.testUpdateForm = function(finish){
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
    finish();
  });
};

module.exports.testAddForm = function(finish) {
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
    finish();
  });
};

/**
 * Testing Adding a form with a duplicate name.
 *
 */
module.exports.testAddFormDuplicateName = function(finish){
  async.series([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_SIMPLE.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      //No form yet, so this form addition should succeed.
      forms.updateForm(options, TEST_FORM_SIMPLE, function(err, doc){
        assert.ok(!err, 'testAddFormDuplicateName() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      //Form already exists, should not save again.
      forms.updateForm(options, TEST_FORM_SIMPLE, function(err, doc){
        assert.ok(err, 'testAddFormDuplicateName() - expected an error but got nothing ');
        assert.ok(err.userDetail.toLowerCase().indexOf("already exists") > -1, "Expected duplicate error but got " + util.inspect(err.userDetail));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};

/**
 * Testing Adding a form with a duplicate name but it is the same form. This is a legal update.
 *
 */
module.exports.testAddFormDuplicateNameSameForm = function(finish){
  var formId = null;
  async.series([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_SIMPLE.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      //No form yet, so this form addition should succeed.
      forms.updateForm(options, TEST_FORM_SIMPLE, function(err, doc){
        //Need to assign the form _id to test data.
        formId = doc._id;
        assert.ok(formId, "Expected a form id but got " + util.inspect(formId));
        assert.ok(!err, 'testAddFormDuplicateNameSameForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      var updatedFormDef = JSON.parse(JSON.stringify(TEST_FORM_SIMPLE));

      updatedFormDef._id = formId;
      updatedFormDef.description = "Updated Description";
      //No form yet, so this form addition should succeed.
      forms.updateForm(options, updatedFormDef, function(err, doc){
        assert.ok(!err, 'testAddFormDuplicateNameSameForm() - unexpected error ' + util.inspect(err));
        assert.ok(doc.description === "Updated Description", "Expected an updated description but got " + util.inspect(doc));
        cb();
      });
    },
    function(cb) {//Checking that there is only one form with the same name in the database.
      formModel.count({name: TEST_FORM_SIMPLE.name}, function(err, count){
        assert.ok(!err, "Unexpected error " + util.inspect(err));

        assert.ok(count === 1);
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};

module.exports.testAddFormWith2EmptyPages = function(finish) {
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
      
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form');
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form');
      
      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');
      return cb();
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.testUpdateFormWith2EmptyPages = function(finish) {
  async.waterfall([
    async.apply(assertFormNamedNotFound, assert, TEST_FORM_UPDATE_2EMPTY_PAGES.name, 'should not have found form - not added yet - found: '),
    function(cb) {
      forms.updateForm(options, TEST_FORM_UPDATE_2EMPTY_PAGES, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error fom updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_UPDATE_2EMPTY_PAGES.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assert.strictEqual(data.formDescription, TEST_FORM_UPDATE_2EMPTY_PAGES.formDescription, "new description should ahve been added");
        cb(undefined, data);
      });
    },
    function(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assert.strictEqual(populatedFormDoc.pages.length, TEST_FORM_UPDATE_2EMPTY_PAGES.pages.length, 'Incorrect number of pages in created form');

      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form');
      assert.ok(TEST_PAGE_NAMES.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form');

      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');

      return cb(undefined, populatedFormDoc.toJSON());
    },
    function(populatedFormDoc, cb) {
      var indexOfPage1=-1;
      for(var i = 0; i < populatedFormDoc.pages.length; i += 1) {
        if (populatedFormDoc.pages[i].name === TEST_PAGE_NAME1) {
          indexOfPage1 = i;
        }
      }
      assert.ok(indexOfPage1 >= 0, "did not find page 1 in test data");
      populatedFormDoc.pages.splice(indexOfPage1, 1);  // delete page1
      populatedFormDoc.pages[0].description = TEST_UPDATED_PAGE2_DESCRIPTION;  // page2 now at index 0
      populatedFormDoc.pages.push(TEST_UPDATED_PAGE3);

      forms.updateForm(options, populatedFormDoc, function(err, doc){
        assert.ok(!err, 'testUpdateForm() - error from updateForm: ' + util.inspect(err));
        cb();
      });
    },
    function(cb) {
      formModel.findOne({name: TEST_FORM_UPDATE_2EMPTY_PAGES.name}).populate('pages').exec(function (err, data) {
        assert.ok(!err, 'should have found form');
        assert.strictEqual(data.formDescription, TEST_FORM_UPDATE_2EMPTY_PAGES.formDescription, "new description should ahve been added");
        cb(undefined, data);
      });
    },
    function(populatedFormDoc, cb) {
      assert.ok(populatedFormDoc, 'should have data');
      assert.strictEqual(populatedFormDoc.pages.length, TEST_FORM_UPDATE_2EMPTY_PAGES.pages.length, 'Incorrect number of pages in updated form, expected: ' + TEST_FORM_UPDATE_2EMPTY_PAGES.pages.length + ", actual: " + populatedFormDoc.pages.length);
      assert.ok(TEST_PAGE_NAMES_AFTER_UPDATE.indexOf(populatedFormDoc.pages[0].name) >= 0, 'Unexpected page name in created form: ' + util.inspect(populatedFormDoc.pages[0].name));
      assert.ok(TEST_PAGE_NAMES_AFTER_UPDATE.indexOf(populatedFormDoc.pages[1].name) >= 0, 'Unexpected page name in created form: ' + util.inspect(populatedFormDoc.pages[1].name));
      assert.notEqual(populatedFormDoc.pages[0].name, populatedFormDoc.pages[1].name, 'page names in created form should be different');

      return cb(undefined, populatedFormDoc);
    }
  ], function(err){
    assert.ok(!err, "received error: " + util.inspect(err));
    finish();
  });
};

module.exports.testInValidForm1 = function(finish){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_EMPTY_OBJ, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};

module.exports.testInValidForm2 = function(finish){
  async.series([
    function(cb) {
      forms.updateForm(options, null, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};

module.exports.testInValidForm3 = function(finish){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_NO_DESCR, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};


module.exports.testInValidForm4 = function(finish){
  async.series([
    function(cb) {
      forms.updateForm(options, TEST_FORM_NO_NAME, function(err, doc){
        assert.ok(err, 'testUpdateForm() - updateForm should have returned error: ' + util.inspect(err));
        cb();
      });
    }
  ], function(err){
    assert.ok(!err);
    finish();
  });
};
