var buildQuery = require('../../../../lib/impl/getSubmissions/buildQuery');
var CONSTANTS = require('../../../../lib/common/constants');
var mongoose = require('mongoose');
var assert = require('assert');
var _ = require('underscore');

describe('Get Submissions Build Query', function() {
  var mockFormId = 'someformid';
  var mockProjectId = 'someprojectid';
  var mockSubmissionId = 'somesubmissionid';
  var mockFilterQueryInvalidObject = 'somefilterqueryval';
  var mockFilterQueryValidObject = '56fa8b3b355a09846e641234';

  it('No Params', function(done) {
    var query = buildQuery();

    assert.equal(CONSTANTS.SUBMISSION_STATUS.COMPLETE, query.status);
    done();
  });

  it('Form ID', function(done) {
    var query = buildQuery({
      formId: mockFormId
    });

    //Should be an array of form IDs by default.
    assert.equal(CONSTANTS.SUBMISSION_STATUS.COMPLETE, query.status);
    assert.equal(mockFormId, query.formId.$in[0]);
    done();
  });

  it('Project ID', function(done) {
    var query = buildQuery({
      appId: mockProjectId
    });

    assert.equal(CONSTANTS.SUBMISSION_STATUS.COMPLETE, query.status);
    assert.equal(mockProjectId, query.appId.$in[0]);
    done();
  });

  it('Project And Form IDs', function(done) {
    var query = buildQuery({
      appId: mockProjectId,
      formId: mockFormId
    });

    assert.equal(CONSTANTS.SUBMISSION_STATUS.COMPLETE, query.status);
    assert.equal(mockProjectId, query.appId.$in[0]);
    assert.equal(mockFormId, query.formId.$in[0]);
    done();
  });

  it('Submission ID', function(done) {
    var query = buildQuery({
      subid: mockSubmissionId
    });

    assert.equal(CONSTANTS.SUBMISSION_STATUS.COMPLETE, query.status);
    assert.equal(mockSubmissionId, query._id.$in[0]);
    done();
  });

  describe('Submission Paginate', function() {

    it('Submission Paginate Filter Empty String', function(done) {
      var query = buildQuery({
        paginate: {
          filter: ''
        }
      });

      assert.ok(!query.$or, "Expected no filter values for an empty string");
      done();
    });

    it('Submission Paginate Filter Valid ObjectId', function(done) {
      var query = buildQuery({
        paginate: {
          filter: mockFilterQueryValidObject
        }
      });

      assert.ok(_.isArray(query.$or), "Expected an array of comparison values");

      //Everything but formId and _id should be regex.
      _.each(_.without(CONSTANTS.SUBMISSIONS_FILTER_FIELDS, 'formId', '_id'), function(subFilterFieldName) {
        var foundFilterQuery = _.find(query.$or, function(filterQuery) {
          return filterQuery[subFilterFieldName];
        });
        assert.ok(foundFilterQuery, "Expected to find " + subFilterFieldName + " filter query");
        assert.equal(mockFilterQueryValidObject, foundFilterQuery[subFilterFieldName].$regex);
        //Case insensitive query
        assert.equal(assert.equal('i', foundFilterQuery[subFilterFieldName].$options));
      });

      //formId and _id should be defined.
      var formIdFilter = _.find(query.$or, function(filterQuery) {
        return filterQuery.formId;
      });

      var _idFilter = _.find(query.$or, function(filterQuery) {
        return filterQuery._id;
      });

      assert.ok(formIdFilter, "Expected A formId filter " + formIdFilter);
      assert.ok(formIdFilter.formId instanceof mongoose.Types.ObjectId, "Expected the formId query to be an ObjectId");
      assert.ok(_idFilter, "Expected A _id filter");
      assert.ok(_idFilter._id instanceof mongoose.Types.ObjectId, "Expected the _id query to be an ObjectId");

      done();
    });

    it('Submission Paginate Filter Invalid ObjectId', function(done) {
      var query = buildQuery({
        paginate: {
          filter: mockFilterQueryInvalidObject
        }
      });

      assert.ok(_.isArray(query.$or), "Expected an array of comparison values");

      //Everything but formId and _id should be regex.
      _.each(_.without(CONSTANTS.SUBMISSIONS_FILTER_FIELDS, 'formId', '_id'), function(subFilterFieldName) {
        var foundFilterQuery = _.find(query.$or, function(filterQuery) {
          return filterQuery[subFilterFieldName];
        });
        assert.ok(foundFilterQuery, "Expected to find " + subFilterFieldName + " filter query");
        assert.equal(mockFilterQueryInvalidObject, foundFilterQuery[subFilterFieldName].$regex);
        //Case insensitive query
        assert.equal(assert.equal('i', foundFilterQuery[subFilterFieldName].$options));
      });

      //formId and _id should not be defined at all.
      var formIdFilter = _.find(query.$or, function(filterQuery) {
        return filterQuery.formId;
      });

      var _idFilter = _.find(query.$or, function(filterQuery) {
        return filterQuery._id;
      });

      assert.ok(!formIdFilter, "Expected No formId filter " + formIdFilter);
      assert.ok(!_idFilter, "Expected No _id filter");

      done();
    });
  });
});
