var assert = require('assert');
var dsFixtures = require('../../../Fixtures/dataSource');
var _ = require('underscore');
var checkUpdateInterval = require('../../../../lib/impl/dataSources/checkUpdateInterval');
var config = require('../../../../lib/config');

describe('Data Source Update Interval', function(){

  it('No Cache', function(done){
    var mockDataSource = _.clone(dsFixtures);
    var now = Date.now();
    //Data Source was never updated.
    mockDataSource.cache = [];

    var filteredResults = checkUpdateInterval([mockDataSource], now);
    //This data source should be scheduled for update
    assert.equal(mockDataSource, filteredResults[0]);
    done();
  });

  it('No Backoff', function(done){
    var mockDataSource = _.clone(dsFixtures);
    var now = Date.now();
    var aMinAgo = now - 60000;
    //Refreshed every 1 minute
    mockDataSource.refreshInterval = 1;

    //Last refreshed a minute ago
    mockDataSource.lastRefreshed = new Date(aMinAgo);
    mockDataSource.cache = [{
      //No backOffIndex
      backOffIndex: 0
    }];

    var filteredResults = checkUpdateInterval([mockDataSource], now);
    //This data source should be scheduled for update
    assert.equal(mockDataSource, filteredResults[0]);
    done();
  });

  describe('Single Backoff 2 minutes. Data Source Updated a Minute Ago', function(){
    var mockDataSource = _.clone(dsFixtures);
    var now = Date.now();
    var aMinAgo = now - 60000;
    //Refreshed every 1 minute
    mockDataSource.refreshInterval = 1;

    //Last refreshed a minute ago
    mockDataSource.cache = [{
      lastRefreshed: new Date(aMinAgo),
      backOffIndex: 1
    }];

    //Setting the backoff to be 2 mins per backoff interval
    before(function(done){
      config.set({
        minsPerBackOffIndex: 2
      });
      done();
    });

    it('Not scheduled for update BEFORE 1 minute from now', function(done){
      var beforeAMinFromNow = now + 59999;
      var filteredResults = checkUpdateInterval([mockDataSource], beforeAMinFromNow);
      //This data source should not be scheduled for update
      assert.equal(undefined, filteredResults[0]);

      done();
    });

    it('Scheduled AT 1 minute from now', function(done){
      var aMinFromNow = now + 60000;
      var filteredResults = checkUpdateInterval([mockDataSource], aMinFromNow);
      //This data source should not be scheduled for update
      assert.equal(mockDataSource, filteredResults[0]);
      done();
    });

    it('Scheduled AFTER 1 minute from now', function(done){
      var afterAMinFromNow = now + 60001;
      var filteredResults = checkUpdateInterval([mockDataSource], afterAMinFromNow);
      //This data source should not be scheduled for update
      assert.equal(mockDataSource, filteredResults[0]);
      done();
    });
  });

  describe('Multiple Backoffs of 1 minute.', function(){
    var mockDataSource = _.clone(dsFixtures);
    var now = Date.now();
    var aMinAgo = now - 60000;
    //Refreshed every 1 minute
    mockDataSource.refreshInterval = 1;

    //Last refreshed a minute ago
    mockDataSource.cache = [{
      lastRefreshed: new Date(aMinAgo),
      backOffIndex: 5
    }];

    before(function(done){
      config.set({
        minsPerBackOffIndex: 1
      });
      done();
    });

    it('Scheduled BEFORE 5 mins after update.', function(done){
      //Update was a minute ago so it should not be scheduled for update 14 mins 59 seconds from the last update.
      var before15MinsAfterUpdate = (now + (4 * 60000)) - 1;
      var filteredResults = checkUpdateInterval([mockDataSource], before15MinsAfterUpdate);
      //This data source should not be scheduled for update
      assert.equal(undefined, filteredResults[0]);
      done();
    });

    it('Scheduled AT 5 mins after update.', function(done){
      //Update was a minute ago so it should be secheduled for update 15 seconds from the last update.
      var at15MinsAfterUpdate = (now + (4 * 60000));
      var filteredResults = checkUpdateInterval([mockDataSource], at15MinsAfterUpdate);
      //This data source should not be scheduled for update
      assert.equal(mockDataSource, filteredResults[0]);
      done();
    });

    it('Scheduled AFTER 5 mins after update.', function(done){
      //Update was a minute ago so it should  be scheduled for update after 15 mins after the last update.
      var after15MinsAfterUpdate = (now + (4 * 60000)) + 1;
      var filteredResults = checkUpdateInterval([mockDataSource], after15MinsAfterUpdate);
      //This data source should not be scheduled for update
      assert.equal(mockDataSource, filteredResults[0]);
      done();
    });
  });

  describe('Exceeding Maximum Timeout Allowed', function(){
    var mockDataSource = _.clone(dsFixtures);
    var now = Date.now();
    var aMinAgo = now - 60000;
    //Refreshed every 1 minute
    mockDataSource.refreshInterval = 1;

    //Last refreshed a minute ago
    mockDataSource.cache = [{
      lastRefreshed: new Date(aMinAgo),
      backOffIndex: 20
    }];

    before(function(done){
      //Max interval set to 5 minutes
      config.set({
        dsMaxIntervalMs: 5 * 60000,
        minsPerBackOffIndex: 1
      });
      done();
    });

    it('Interval should not exceed max interval', function(done){
      var fourMinsFromNow = now + (4 * 60000);

      // The data source was updated 1 min ago.
      // It should update after 5 mins despite having a backoff index of 20
      var filteredResults = checkUpdateInterval([mockDataSource], fourMinsFromNow);
      //This data source should be scheduled for update
      assert.equal(mockDataSource, filteredResults[0]);
      done();
    });

  });
});
