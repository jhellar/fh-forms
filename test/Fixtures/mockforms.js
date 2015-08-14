var assert = require('assert');
var _ = require('underscore');

var dataSources = {
  "dataSource1234": {
    _id: "dataSource1234",
    name: "Returned Data Source"
  }
};

var dataTargets = {
  "dataTarget1234": {
    _id: "dataTarget1234",
    name: "Returned Data Target"
  }
};

module.exports = {
  dataSources: {
    list: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, [
        {
          _id: "dataSourceId",
          name: "dataSourceType"
        }
      ]);
    },
    create: function (options, dataSource, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      dataSource._id = "createdDataSourceID";
      return cb(undefined, dataSource);
    },
    get: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, dataSources[params._id]);
    },
    update: function (options, dataSourceToUpdate, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      dataSourceToUpdate.name = "Updated Data Source";
      return cb(undefined, dataSourceToUpdate);
    },
    remove: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb();
    },
    search: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      assert.equal("someServiceGuid", params.serviceGuid);
      return cb(undefined, [
        {
          _id: "dataSourceId",
          name: "dataSourceType",
          serviceGuid: "someServiceGuid"
        }
      ]);
    },
    validate: function (options, dataSource, cb) {
      var newDataSourceId = "createdDataSourceID";
      assert.ok(options.uri, "Expected A Mongo URI");
      assert(dataSource.name, "Expected A Data Source Name");
      dataSource._id = newDataSourceId;

      return cb(undefined, {valid: true});
    }
  },
  dataTargets: {
    list: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, [
        {
          _id: "dataTargetId",
          name: "dataTargetType"
        }
      ]);
    },
    create: function (options, dataTarget, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      var newDataTargetId = "createdDataTargetID";
      dataTarget._id = newDataTargetId;
      return cb(undefined, dataTarget);
    },
    get: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, dataTargets[params._id]);
    },
    update: function (options, dataTargetToUpdate, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      dataTargetToUpdate.name = "Updated Data Target";
      return cb(undefined, dataTargetToUpdate);
    },
    remove: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb();
    },
    search: function (options, params, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, [
        {
          _id: "dataTargetId",
          name: "dataTargetType"
        }
      ]);
    },
    validate: function (options, dataTarget, cb) {
      assert.ok(options.uri, "Expected A Mongo URI");
      return cb(undefined, {valid: true});
    }
  },
  getAllAppForms: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    return cb(undefined, [
      {
        appId: "someProjectGuid",
        forms: [
          {
            _id: "someformId",
            name: "Some Form Name"
          }
        ]
      }
    ]);
  },
  getAppFormsForApp: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.appId, "Expeced A Project Guid To Be Set");

    return cb(undefined, {
      _id: "someappid",
      forms: [
        {
          _id: "someformId",
          name: "Some Form Name"
        }
      ]
    });
  },
  updateAppForms: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params.appId, "Expected A Project ID");
    assert.ok(params.forms, "Expected Forms To Update");

    return cb(undefined, {
      appId: "Updated App ID",
      forms: ["updatedFormsId"]
    });
  },
  deleteAppReferences: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params.appId, "Expected A Project ID");

    return cb();
  },
  getAppConfig: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params.appId, "Expected A Project ID");

    return cb(undefined, {
      client: {
        someClientConfigKey: "someClientConfigVal"
      },
      cloud: {
        someCloudConfigKey: "someCloudConfigVal"
      }
    });
  },
  updateAppConfig: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params.appId, "Expected A Project ID");
    assert.ok(params.client, "Expected Client Config");
    assert.ok(params.cloud, "Expected Cloud Config");

    return cb(undefined, {
      client: {
        someClientConfigKey: "someClientConfigVal"
      },
      cloud: {
        someCloudConfigKey: "someCloudConfigVal"
      }
    });
  },
  getAllForms: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");

    return cb(undefined, [
      {
        _id: "someFormID",
        name: "someFormName"
      }
    ]);
  },
  updateForm: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");

    assert.ok(params.name, "Expected A Form Name");

    return cb(undefined, {
      _id: params._id || "someNewFormId",
      name: params.name
    });
  },
  getForm: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Form Id");
    assert.ok(options.showAdminFields, "Expected Show Admin Fields To Be Set");

    return cb(undefined, {
      _id: options._id,
      name: "Some Form From Database"
    });
  },
  deleteForm: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Form ID");

    return cb();
  },
  getNotifications: function (options, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Form ID");

    return cb(undefined, ["somePerson@example.com"]);
  },
  updateNotifications: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Form ID");

    assert.ok(_.isArray(params), "Expected An Array Of Subscribers");

    return cb(undefined, {
      _id: "someFormId",
      subscribers: ["someone@example.com"]
    });
  },
  updateFieldRules: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.formId, "Expected A Form ID");

    assert.ok(_.isArray(params), "Expected An Array Of Rules");

    return cb(undefined, [
      {"_id": "54d9d21d4e6821c12b30ac92", "type": "show", "targetField": ["54cb88f142bfcea1342739c3"], "ruleConditionalStatements": [
        {"sourceField": "54e213be84959ce2338ca0e9", "restriction": "is", "sourceValue": "Option 1"},
        {"sourceField": "54cb88f142bfcea1342739c3", "restriction": "is", "sourceValue": "asd"}
      ], "ruleConditionalOperator": "or", "relationType": "and"},
      {"type": "show", "_id": "550c6cbf7007c0990517fa05", "targetField": ["54e213be84959ce2338ca0ea"], "ruleConditionalStatements": [
        {"sourceField": "54e213be84959ce2338ca0e9", "restriction": "is", "sourceValue": "Option 2"}
      ], "ruleConditionalOperator": "and", "relationType": "and"}
    ]);
  },
  updatePageRules: function (options, params, cb) {
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.formId, "Expected A Form ID");

    assert.ok(_.isArray(params), "Expected An Array Of Rules");

    return cb(undefined, [
      {"_id": "54d9d21d4e6821c12b30ac92", "type": "skip", "targetField": ["54cb88f142bfcea1342739c3"], "ruleConditionalStatements": [
        {"sourceField": "54e213be84959ce2338ca0e9", "restriction": "is", "sourceValue": "Option 1"},
        {"sourceField": "54cb88f142bfcea1342739c3", "restriction": "is", "sourceValue": "asd"}
      ], "ruleConditionalOperator": "or", "relationType": "and"},
      {"type": "show", "_id": "550c6cbf7007c0990517fa05", "targetField": ["54e213be84959ce2338ca0ea"], "ruleConditionalStatements": [
        {"sourceField": "54e213be84959ce2338ca0e9", "restriction": "is", "sourceValue": "Option 2"}
      ], "ruleConditionalOperator": "and", "relationType": "and"}
    ]);
  },
  cloneForm: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Form ID");
    assert.ok(options.name, "Expected A New Form Name");

    return cb(undefined, {
      _id: "someClonedFormId",
      name: options.name
    });
  },
  getFormApps: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.formId, "Expected A Form ID");

    return cb(undefined, [{
      appId: "someProjectGuid",
      forms: ["someFormID"]
    }]);
  },
  getSubmissions: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");

    return cb(undefined, {submissions: [{
      _id: "someSubmissionId",
      formId: "someSubmissionFormId"
    }]});
  },
  getSubmission: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params._id, "Expected A Submission ID");

    return cb(undefined, {
      _id: "someSubmissionId",
      formId: "someSubmissionFormId"
    });
  },
  updateSubmission: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.submission, "Expected A Submission");
    assert.ok(options.skipValidation, "Expected Skip Validation Set");
    assert.ok(options.submission.submissionId, "Expected A Submission ID");

    return cb(undefined, {
      _id: "updatedsubmissionid",
      submissionCompletedTimestamp: 1234,
      status: "complete"
    });
  },
  deleteSubmission: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params._id, "Expected A Submision ID");

    return cb();
  },
  getSubmissionFile: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params._id, "Expected A Submision File ID");

    return cb(undefined, {
      stream: "File Stream",
      type: "application/pdf",
      length: 1234,
      name: "somefile.pdf"
    });

  },
  updateSubmissionFile: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options.fileDetails, "Expected File Details");
    assert.ok(options.submission, "Expected Submission Details");

    return cb();
  },
  submissionSearch: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(params.formId, "Expected A Form Id");
    assert.ok(params.clauseOperator, "Expected A Clause Operator");
    assert.ok(params.queryFields, "Expected Query Fields");


    return cb(undefined, {submissions: [{
      _id: "somesubmissionId"
    }]});
  },
  getThemes: function(options, cb ){
    assert.ok(options.uri, "Expected A Mongo URI");

    return cb(undefined, [
      {
        _id: "somethemeid",
        name: "Some Theme Name"
      }
    ]);
  },
  createTheme: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");

    if(params._id){
      params.name = "Updated Theme Name";
    } else {
      params._id = "somethemeid";
    }

    return cb(undefined, params);
  },
  updateTheme: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");

    if(params._id){
      params.name = "Updated Theme Name";
    } else {
      params._id = "somethemeid";
    }

    return cb(undefined, params);
  },
  getTheme: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Theme Id");

    return cb(undefined, {
      _id: "somethemeid",
      name: "Some Theme Name"
    });
  },
  deleteTheme: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Theme Id");

    return cb();
  },
  cloneTheme: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Theme Id");
    assert.ok(options.name, "Expected A Theme Name");

    return cb(undefined, {
      _id: "someclonedthemeid",
      name: options.name
    });
  },
  generateSubmissionPdf: function(options, cb){
    assert.ok(options.uri, "Expected A Mongo URI");
    assert.ok(options._id, "Expected A Submission Id");

    return cb(undefined, "file://some/path/to/an/exported/submission.pdf");
  },
  exportSubmissions: function(options, params, cb){
    assert.ok(options.uri, "Expected A Mongo URI");

    return cb(undefined, {});
  },
  submitFormData: function(options, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");

    assert.ok(options.submission.appId, "Expected A Project Id");

    return cb(undefined, {
      submissionId: "testsubmissionid",
      submissionStartedTimestamp: new Date(),
      formSubmission: options.submission
    });
  },
  getSubmissionStatus: function(options, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");
    assert.ok(options.submission.submissionId, "Epxected A Submission ID");

    return cb(undefined, {
      status: "complete"
    });
  },
  findForms: function (options, formsList, cb) {
    assert.ok(options.uri, "Epxected A Mongo URI");
    assert.ok(_.isArray(formsList), "Expected A Forms List Array");
    assert.equal(formsList[0], "someformid", "Expected A Form ID String");

    return cb(undefined, [{
      _id: "someformid",
      name: "Some Test Form"
    }]);
  },
  exportThemes: function(options, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");

    return cb(undefined, [
      {
        _id: "somethemeid"
      }
    ]);
  },
  importThemes: function(options, themesToImport, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");
    assert.ok(_.isArray(themesToImport));

    return cb();
  },
  exportAppForms: function(options, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");

    return cb(undefined, [
      {
        _id: "someappformid",
        appId: "someAppId",
        forms: ["someformid"],
        theme: "somethemeid"
      }
    ]);
  },
  importAppForms: function(options, appFormsToImport, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");
    assert.ok(_.isArray(appFormsToImport), "Expeced An Array Of Appforms To Import.");

    return cb();
  },
  exportAppConfig: function(options, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");

    return cb(undefined, [
      {
        _id: "someformconfigid",
        appId: "someAppId",
        client: {

        },
        cloud: {

        }
      }
    ]);
  },
  importAppConfig: function(options, configToImport, cb){
    assert.ok(options.uri, "Epxected A Mongo URI");
    assert.ok(_.isArray(configToImport), "Expeced An Array Of Appforms Config To Import.");

    return cb();
  }
};