var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var fakeForms = require('../../Fixtures/mockforms.js');

var fakeMongoString = "mongo://127.0.0.1:27017";

var mocks = {
  '../forms.js': fakeForms
};

var formsHandler = proxyquire('../../../lib/middleware/forms.js', mocks);

module.exports = {
  "setUp": function(done){
    done();
  },
  "tearDown": function(done){
    done();
  },
  "Test It Should List Forms": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      }
    };

    formsHandler.list(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected An Array For A Forms Result");
      assert.ok(req.appformsResultPayload.data[0]._id, "Expected A Form ID");
      done();
    });
  },
  "Test It Should Get A Single Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtoget"
      }
    };

    formsHandler.get(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected An Object For A Forms Result");
      assert.equal(req.appformsResultPayload.data._id, "someformidtoget", "Expected A Form ID");
      done();
    });
  },
  "Test It Should Create A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      body: {
        name: "Some Form To Create"
      }
    };

    formsHandler.create(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected An Object For A Forms Result");
      assert.ok(req.appformsResultPayload.data._id, "Expected A Form ID");
      assert.equal(req.appformsResultPayload.data.name, "Some Form To Create");
      done();
    });
  },
  "Test It Should Update A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformtoupdate"
      },
      body: {
        _id: "someformtoupdate",
        name: "Some Updated Form"
      },
      user: {
        email: "someuser@example.com"
      }
    };

    formsHandler.update(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected An Object For A Forms Result");

      assert.equal(req.appformsResultPayload.data._id, "someformtoupdate");
      assert.equal(req.appformsResultPayload.data.name, "Some Updated Form");
      done();
    });
  },
  "Test It Should Delete A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtoremove"
      }
    };

    formsHandler.remove(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      done();
    });
  },
  "Test It Should Clone A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtoclone"
      },
      body: {
        _id: "someformidtoclone",
        name: "Some Cloned Form",
        updatedBy: "someuser@example.com"
      }
    };

    formsHandler.clone(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(!_.isArray(req.appformsResultPayload.data), "Expected An Object For A Forms Result");
      assert.equal(req.appformsResultPayload.data._id, "someClonedFormId", "Expected A Form ID");

      done();
    });
  },
  "Test It Should Get Subscribers": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtogetsubscribers"
      }
    };

    formsHandler.listSubscribers(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected An Array Of Subscribers");
      done();
    });
  },
  "Test It Should Update Subscribers": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtogetsubscribers"
      },
      body: {
        subscribers: ["somesubscriber@example.com"]
      }
    };

    formsHandler.updateSubscribers(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(req.appformsResultPayload.data._id, "Expected A Form ID");
      assert.ok(_.isArray(req.appformsResultPayload.data.subscribers), "Expected A Forms Result Array");
      done();
    });
  },
  "Test It Should Get Submissions For A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtogetsubmissions"
      }
    };

    formsHandler.submissions(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected A Submissions Result Array");
      done();
    });
  },
  "Test It Should Get Projects Using A Form": function(done){
    var req = {
      connectionOptions: {
        uri: fakeMongoString
      },
      params: {
        id: "someformidtogetprojects"
      }
    };

    formsHandler.projects(req, {}, function(err){
      assert.ok(!err, "Expected No Error");

      assert.ok(_.isArray(req.appformsResultPayload.data), "Expected A Forms Projects Result Array");
      done();
    });
  },
  "It Should Submit Form Data For A Form": function(done){
    var req = {
      params: {
        projectid: "someprojectguid",
        id: "someformid"
      },
      connectionOptions: {
        uri: fakeMongoString
      },
      body: {
        formId: "someformid",
        formFields: [
          {
            fieldId: "somefieldid",
            values: ["sometestvalue"]
          }
        ]
      }
    };

    formsHandler.submitFormData(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);

      //Verifying the submitFormData Response
      assert.equal(req.appformsResultPayload.data.submissionId, "testsubmissionid");
      done();
    });
  },
  "It Should List Forms For A Project": function(done){
    var req = {
      params: {
        projectid: "somelistprojectid"
      },
      connectionOptions: {
        uri: fakeMongoString
      },
      appformsResultPayload: {
        data: ["someformid"],
        type: "formsResult"
      }
    };

    formsHandler.listDeployedForms(req, {}, function(err){
      assert.ok(!err, "Expected No Error " + err);

      done();
    });
  }
};