var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var misc = require('../common/misc.js');
var buildErrorResponse = misc.buildErrorResponse;
var async = require('async');
var _ = require('underscore');
var ERROR_CODES = models.CONSTANTS.ERROR_CODES;
var CONSTANTS = {
  "DATA_SOURCE_ID": "_id",
  "DATA_SOURCE_DATA": "data",
  "DATA_SOURCE_CACHE": "cache",
  "FORM_ID": "_id",
  "FORM_NAME": "name"
};

//TODO Logging

function processDataSourceResponse(dataSourceJSON){
  var cacheEntry = dataSourceJSON.cache[0];

  //If there is a cache entry, map the keys to the json, remove the entry
  if(cacheEntry){
    //Moving The Cache Entry To The Top Of The Object For API Consistency.
    delete cacheEntry[CONSTANTS.DATA_SOURCE_ID]; //Not Interested In The Cache Entry _id

    //Remove The _id parameter from option subdocuments.
    cacheEntry.data.options = _.map(cacheEntry.data.options, function(optionEntry){
      delete optionEntry[CONSTANTS.DATA_SOURCE_ID];
      return optionEntry;
    });

    dataSourceJSON = _.extend(dataSourceJSON, cacheEntry);
  }

  delete dataSourceJSON.cache;

  return dataSourceJSON;
}

function updateValidAndInvalidDataSources(dataSourcesToSplit, currentInvalidDataSources){
  currentInvalidDataSources = currentInvalidDataSources || [];
  var validInvalid = _.partition(dataSourcesToSplit, function(dataSourceUpdateData){
    return !dataSourceUpdateData.error;
  });

  var validDataSources = validInvalid[0];

  //Updating any data sources that are no longer valid
  var invalidDataSources = _.union(validInvalid[1], currentInvalidDataSources);

  return {
    valid: validDataSources,
    invalid: invalidDataSources
  }
}

//Helper function to remove any invalid data types from incoming json.
function sanitiseJSON(jsonToSanitise){
  return _.pick(jsonToSanitise, function(val){
    return typeof val !== 'function';
  });
}

function lookUpDataSources(connections, params, cb){
  if(!params){
    return cb(new Error("No Search Parameterss For Finding Data Sources"));
  }

  //Some queries don't want a document, just want a Javascript Object.
  var lean = params.lean ? params.lean : false;

  var DataSource = models.get(connections.mongooseConnection, models.MODELNAMES.DATA_SOURCE);

  //Looking To Find A Data Source -- Using lean if just want an Object instead of a document
  DataSource.find(params.query).lean(lean).exec(function(err, dataSources){
    if(err){
      return cb(err);
    }

    return cb(undefined, dataSources);
  });
}

function checkFormsUsingDataSource(connections, dataSourceJSON, cb){
  //Need To List Any Forms That Are Using The Data Source
  var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);

  var selections = {

  };

  //Only need the form name and id.
  selections[CONSTANTS.FORM_ID] = 1;
  selections[CONSTANTS.FORM_NAME] = 1;

  //Only want the JSON definition of the forms, don't need documents
  Form.find({dataSources: dataSourceJSON[CONSTANTS.DATA_SOURCE_ID]}).lean().select(selections).exec(function(err, formsUsingDataSource){
    if(err){
      return cb(buildErrorResponse({
        error: err,
        code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
      }));
    }

    dataSourceJSON.forms = formsUsingDataSource || [];

    //Have All The Information Needed For The Data Source
    return cb(undefined, dataSourceJSON);
  });
}

/**
 * Update A Singe Data Source Data Entry.
 *
 * @param dataSourceData
 * @param cb
 */
function updateDataSourceEntry(connections, dataSourceData, currentTime, cb){
  var dataToUpdate = dataSourceData.data;
  var dataSourceDocument = dataSourceData.document;

  //If there is no cache entry, create a new one to validate.
  var cacheElement = dataSourceDocument.cache[0];

  if(!cacheElement){
    dataSourceDocument.cache.push({});
  }

  cacheElement = dataSourceDocument.cache[0];

  //If the hashes are different, need to update the data set and hash
  if(dataSourceData.dataHash !== cacheElement.dataHash){
    cacheElement.data = dataToUpdate;
    cacheElement.dataHash = dataSourceData.dataHash;
    dataSourceData.dataChanged = true;
  }

  //Mark The Submission As Refreshed
  cacheElement.lastRefreshed = currentTime;

  //The Document Should Now Be Valid
  dataSourceDocument.validate(function(err){
    if(err){
      //Not Valid, don't try to save it, mark it as an error state
      dataSourceData.error = buildErrorResponse({
        error: err,
        userDetail: "Invalid Data Cache Update",
        systemDetail: err.message,
        code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
      });

      //Not interested in the document if the data is invalid
      delete dataSourceData.document;

      return cb(undefined, dataSourceData);
    } else {
      //Data Source Data Is Now valid, can save it.
      dataSourceDocument.save(function(err){
        if(err){
          dataSourceData.error = buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Saving Data Source Data",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          });

          //Not interested in the document if the save is invalid
          delete dataSourceData.document;

          return cb(undefined, dataSourceData);
        }

        //Save Was Successful, return updated document
        dataSourceData.document = dataSourceDocument;

        return cb(undefined, dataSourceData);
      });
    }
  });
}

/**
 * Get A Specific Data Source Definition
 * @param connections
 * @param params
 * @param cb
 */
function get(connections, params, cb){
  //validateParams
  //LookUpDataSource
  //CheckFormsThatAre Using The Data Source
  //Return Result.

  async.waterfall([
    function validateParams(cb){
      validate(params).has(CONSTANTS.DATA_SOURCE_ID, function(err){
        if(err){
          return cb(buildErrorResponse({error: new Error("An ID Parameter Is Required To Get A Data Source"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
        }

        return cb(undefined, params[CONSTANTS.DATA_SOURCE_ID]);
      });
    },
    function findDataSources(id, cb){
      var query = {

      };

      //Searching By ID.
      query[CONSTANTS.DATA_SOURCE_ID] = id;

      lookUpDataSources(connections, {
        query: query,
        lean: true
      }, function(err, dataSources){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Searching For A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //Checking if the data source exists. Should be only one
        if(dataSources.length !== 1){
          return cb(buildErrorResponse({
            error: new Error("Data Source Not Found"),
            systemDetail: "Requested ID: "  + params[CONSTANTS.DATA_SOURCE_ID],
            code: ERROR_CODES.FH_FORMS_NOT_FOUND
          }));
        }

        var dataSourceJSON = dataSources[0];
        dataSourceJSON = processDataSourceResponse(dataSourceJSON);

        return cb(undefined, dataSourceJSON);
      });
    },
    function checkForms(dataSourceJSON, cb){
      //Checking For Any Forms Associated With The Data Source
      checkFormsUsingDataSource(connections, dataSourceJSON, cb);
    }
  ], cb);
}

/**
 * Listing All Data Sources. In The Environment, this will include the current cache data.
 * @param connections
 * @param params
 * @param cb
 */
function list(connections, params, cb){
  async.waterfall([
    function findDataSources(cb){
      lookUpDataSources(connections, {
        query: {},
        lean: true
      }, function(err, dataSources){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Searching For A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        dataSources = _.map(dataSources, processDataSourceResponse);

        return cb(undefined, dataSources);
      });
    }
  ], cb);
}

function update(connections, dataSource, cb){
  async.waterfall([
    function validateParams(cb){
      var dataSourceValidator = validate(dataSource);
      //The data source parameter should have an ID property.
      dataSourceValidator.has(CONSTANTS.DATA_SOURCE_ID, function(err){
        if(err){
          return cb(buildErrorResponse({error: new Error("An ID Parameter Is Required To Update A Data Source"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
        }

        //Data Source Cache Should Not Be Updated With This Function
        dataSourceValidator.hasno(CONSTANTS.DATA_SOURCE_DATA, CONSTANTS.DATA_SOURCE_CACHE, function(){
          if(err){
            return cb(buildErrorResponse({error: new Error("Updating A Data Source Should Not Include Cache Data"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
          }

          cb(undefined, dataSource);
        });
      });
    },
    function findDataSource(dataSource, cb){
      var query = {

      };

      //Searching By ID.
      query[CONSTANTS.DATA_SOURCE_ID] = dataSource[CONSTANTS.DATA_SOURCE_ID];

      //Looking up a full data source document as we are updating
      lookUpDataSources(connections, {
        query: query,
        lean: false
      }, function(err, dataSources){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Searching For A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //Should only be one data source
        if(dataSources.length !== 1){
          return cb(buildErrorResponse({
            error: new Error("Data Source Not Found"),
            systemDetail: "Requested ID: "  + dataSource[CONSTANTS.DATA_SOURCE_ID],
            code: ERROR_CODES.FH_FORMS_NOT_FOUND
          }));
        }

        return cb(undefined, dataSource, dataSources[0]);
      });
    },
    function updateDataSource(dataSourceJSON, dataSourceDocument, cb){
      //Updating The Data Source Document.

      //The Data Source shout not contain any functions.
      dataSourceJSON = sanitiseJSON(dataSourceJSON);

      //Can't update the docuemnt ID field.
      delete dataSourceJSON[CONSTANTS.DATA_SOURCE_ID];

      dataSourceDocument = _.extend(dataSourceDocument, dataSourceJSON);

      //Marking The Data Source As Having Been Updated
      dataSourceDocument.lastUpdated = new Date();

      dataSourceDocument.save(function(err){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Invalid Data Source Update Data.",
            systemDetail: err.errors,
            code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
          }));
        }

        dataSourceDocument = processDataSourceResponse(dataSourceDocument.toJSON());

        return cb(undefined, dataSourceDocument);
      });
    },
    function checkForms(dataSourceJSON, cb){
      //Checking For Any Forms Associated With The Data Source
      checkFormsUsingDataSource(connections, dataSourceJSON, cb);
    }
  ], cb);
}

/**
 * Creating A New Data Source
 * @param connections
 * @param dataSource
 * @param cb
 */
function create(connections, dataSource, cb){
  async.waterfall([
    function validateParams(cb){
      validate(dataSource).hasno(CONSTANTS.DATA_SOURCE_ID, function(err){
        if(err){
          return cb(buildErrorResponse({error: new Error("Data Source ID Should Not Be Included When Creating A Data Source"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
        }
      });

      cb(undefined, dataSource);
    },
    function createDataSource(dataSourceJSON, cb){
      dataSourceJSON = sanitiseJSON(dataSourceJSON);

      var DataSource = models.get(connections.mongooseConnection, models.MODELNAMES.DATA_SOURCE);
      var newDataSource = new DataSource(dataSourceJSON);

      newDataSource.save(function(err){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Invalid Data Source Creation Data.",
            systemDetail: err.errors,
            code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
          }));
        }

        newDataSource = processDataSourceResponse(newDataSource.toJSON())

        return cb(undefined, newDataSource);
      });

    }
  ], cb);
}

/**
 * Removing A Data Source
 * @param connections
 * @param params
 * @param cb
 */
function remove(connections, params, cb){
  var failed = validate(params).has(CONSTANTS.DATA_SOURCE_ID);

  if(failed){
    return cb(buildErrorResponse({error: new Error("An ID Parameter Is Required To Remove A Data Source"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
  }

  if(!misc.checkId(params[CONSTANTS.DATA_SOURCE_ID])){
    return cb(buildErrorResponse({error: new Error("Invalid ID Paramter"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
  }

  async.waterfall([
    function findAssociatedForms(cb){
      checkFormsUsingDataSource(connections, params, cb);
    },
    function verifyNoFormsAssociated(updatedDataSource, cb){
      //If there are any forms using this data source, then do not delete it.

      if(updatedDataSource.forms.length > 0){
        return cb(buildErrorResponse({
          error: new Error("Forms Are Associated With This Data Source. Please Disassociate Forms From This Data Source Before Deleting."),
          code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
        }));
      }

      return cb(undefined, updatedDataSource);
    },
    function processResponse(updatedDataSource, cb){
      //Removing The Data Source
      var DataSource = models.get(connections.mongooseConnection, models.MODELNAMES.DATA_SOURCE);

      DataSource.remove({_id: updatedDataSource._id}, function(err){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Removing A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //Data Source Removed Successfully
        return cb();
      });
    }
  ], cb);
}

/**
 * Updating The Data Cache Of A Data Source.
 * @param connections
 * @param params
 * @param cb
 */
function updateCache(connections, dataSources, cb){
  var currentTime = new Date().getTime();
  //Data Sources Should Be An Array
  if(!(_.isArray(dataSources))){
    return cb(buildErrorResponse({error: new Error("Invalid Data Sources Object To Update. Must Be An Array"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
  }

  async.waterfall([
    function validateParams(cb){
      dataSources = _.map(dataSources, function(dataSourceUpdateData){
        var failed = validate(dataSourceUpdateData).has(CONSTANTS.DATA_SOURCE_ID, CONSTANTS.DATA_SOURCE_DATA);

        if(failed){
          dataSourceUpdateData.error = buildErrorResponse({error: new Error("Invalid Parameters For Updating Data Source Data Cache"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS});
        }

        if(!misc.checkId(dataSourceUpdateData._id)){
          dataSourceUpdateData.error = buildErrorResponse({error: new Error("Invalid ID Paramter " + dataSourceUpdateData._id), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS});
        }

        return dataSourceUpdateData;
      });

      //Filter out any data sources with invalid paramters.

      //A Valid Data Source Means That It has the correct fields and the _id field is a valid mongo ObjectID string
      var validInvalidDataSources = updateValidAndInvalidDataSources(dataSources, []);

      cb(undefined, validInvalidDataSources.valid, validInvalidDataSources.invalid);
    },
    function findDataSources(validDataSources, invalidDataSources, cb){
      //Just Want The Data Source IDs.
      var dataSourceIDsToUpdate = _.map(validDataSources, function(dataSourceUpdateData){
        return dataSourceUpdateData._id;
      });

      //No Valid Data Sources To Update. No Need To Search For Data Sources
      if(dataSourceIDsToUpdate.length === 0){
        return cb(undefined, validDataSources, invalidDataSources);
      }

      var query = {

      };

      //Searching By ID. Just one mongo call to get them all. More Efficient
      query[CONSTANTS.DATA_SOURCE_ID] = {
        "$in": dataSourceIDsToUpdate
      };

      lookUpDataSources(connections, {
        query: query
      }, function(err, dataSources){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Searching For A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //Map Found Data Source Documents
        validDataSources = _.map(validDataSources, function(validDataSource){
          var matchingDocument = _.find(dataSources, function(dataSourceDocument){
            return _.isEqual(dataSourceDocument._id.toString(), validDataSource._id.toString());
          });

          //If the document is found, assign it to the object, if not, set an error;
          if(matchingDocument){
            validDataSource.document = matchingDocument;
          } else {
            validDataSource.error = buildErrorResponse({
              error: new Error("Data Source Not Found"),
              userDetail: "Data Source Not Found",
              code: ERROR_CODES.FH_FORMS_NOT_FOUND
            });
          }

          return validDataSource;
        });

        var validInvalidDataSources = updateValidAndInvalidDataSources(validDataSources, invalidDataSources);

        cb(undefined, validInvalidDataSources.valid, validInvalidDataSources.invalid);
      });
    },
    function updateDataSourceCaches(validDataSources, invalidDataSources, cb){
      //Updating All Of The Data Sources
      //Generating Hashes For The Incoming Data Set. Useful for determining if the stored data set has changed.
      validDataSources = _.map(validDataSources, function(dataSourceData){
        dataSourceData.dataHash = misc.generateHash(dataSourceData.data);
        return dataSourceData;
      });

      async.map(validDataSources, function(dataSourceDetails, cb){
         return updateDataSourceEntry(connections, dataSourceDetails, currentTime, cb);
      }, function(err, updatedDocuments){
        //Documents are now either updated or failed
        var validInvalidDataSources = updateValidAndInvalidDataSources(updatedDocuments, invalidDataSources);

        return cb(undefined, validInvalidDataSources.valid, validInvalidDataSources.invalid);
      });
    },
    function updateForms(validDataSources, invalidDataSources, cb){
      //Only interested In Data Sources Where Data Was Actually Updated. If the data set is still the same, the no need to mark the form as updated the form.
      var dataSoucesUpdated = _.filter(validDataSources, function(dataSourceData){
        return dataSourceData.dataChanged === true;
      });

      //Updating Any Forms That Reference Updated Data Sources
      var updatedDataSourceIds = _.map(dataSoucesUpdated, function(validDataSourceData){
        return validDataSourceData._id;
      });

      //Need to find and update any forms associated with the data sources.
      var Form = models.get(connections.mongooseConnection, models.MODELNAMES.FORM);

      //Flagging Any Forms That Are Using The Updated Data Sources As Being Updated. This is useful for client/cloud apps that need to determine if they need to load the entire form again.
      Form.update({
        "dataSources.formDataSources": {"$in": updatedDataSourceIds}
      }, {
        "$set": {
          "dataSources.lastRefresh": currentTime
        }
      }, { multi: true }, function(err, affected){
        if(err){
          return cb(buildErrorResponse({
            error: new Error("Error Updating Forms Refresh Fields"),
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //No error, forms updated, moving on
        cb(undefined, validDataSources, invalidDataSources);
      });
    },
    function prepareResponse(validDataSources, invalidDataSources, cb){
      //There Were Errors Updating Data Sources, should return an error

      //For The Valid Data Sources, Just want the updated Document JSON
      validDataSources = _.map(validDataSources, function(validDataSourceData){
        return processDataSourceResponse(validDataSourceData.document.toJSON());
      });

      var returnError;
      if(invalidDataSources.length > 0){
        returnError = buildErrorResponse({
          error: new Error("Error Updating Data Sources"),
          code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
        });
      }

      return cb(returnError, {
        validDataSourceUpdates: validDataSources,
        invalidDataSourceUpdates: invalidDataSources
      });
    }
  ], cb);
}

/**
 * Validating A Data Source Object.
 * @param connections
 * @param dataSource
 * @param cb
 */
function validateDataSource(connections, dataSource, cb){
  var dataSourceToValidate = _.clone(dataSource);
  var DataSource = models.get(connections.mongooseConnection, models.MODELNAMES.DATA_SOURCE);

  //Expect The Data Source To Have Data
  var failure = validate(dataSourceToValidate).has(CONSTANTS.DATA_SOURCE_DATA);

  if(failure){
    return cb(buildErrorResponse({
      error: new Error("No Data Passed To Validate"),
      code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS
    }));
  }

  //Generate A Hash
  var hash = misc.generateHash(dataSourceToValidate.data);

  //Populate A Cache Object
  //LastRefreshed is populated just for the cache mongoose schema
  var cache = {
    dataHash: hash,
    data: dataSourceToValidate.data,
    lastRefreshed: new Date().getTime()
  };

  dataSourceToValidate.cache = [cache];

  //Create A New Mongoose. Note that this document is never saved. It is useful for consistent validation
  var testDataSource = new DataSource(dataSourceToValidate);
  //Validating Without Saving
  testDataSource.validate(function(err){
    var valid = err ? false : true;
    var dataSourceJSON = testDataSource.toJSON();

    dataSourceJSON = processDataSourceResponse(dataSourceJSON);

    //Not interested in the last update timestamp as the data source is not saved to the database.
    delete dataSourceJSON.lastRefreshed;

    //Not Interested In The Curent Status As It Is Not Stored In The Database.
    delete dataSourceJSON.currentStatus;

    //Not Interested In The _id As It Is Not Stored In The Database.
    delete dataSourceJSON[CONSTANTS.DATA_SOURCE_ID];

    dataSourceJSON.validationResult = {
      valid: valid,
      message: valid ? "Data Source Is Valid" : "Invalid Data Source"
    };

    return cb(undefined, dataSourceJSON);
  });
}

/**
 * Deploying A Data Source. Check If It Exists First, then update, if not create it.
 */
function deploy(connections, dataSource, cb){

  async.waterfall([
    function validateParams(cb){
      var dataSourceValidator = validate(dataSource);
      //The data source parameter should have an ID property.
      dataSourceValidator.has(CONSTANTS.DATA_SOURCE_ID, function(err){
        if(err){
          return cb(buildErrorResponse({error: new Error("An ID Parameter Is Required To Deploy A Data Source"), code: ERROR_CODES.FH_FORMS_INVALID_PARAMETERS}));
        }

        cb(undefined, dataSource);
      });
    },
    function findDataSource(dataSource, cb){
      var query = {

      };

      //Searching By ID.
      query[CONSTANTS.DATA_SOURCE_ID] = dataSource[CONSTANTS.DATA_SOURCE_ID];

      //Looking up a full data source document as we are updating
      lookUpDataSources(connections, {
        query: query,
        lean: false
      }, function(err, dataSources){
        if(err){
          return cb(buildErrorResponse({
            error: err,
            userDetail: "Unexpected Error When Searching For A Data Source",
            code: ERROR_CODES.FH_FORMS_UNEXPECTED_ERROR
          }));
        }

        //If no data sources found create, otherwise update.
        if(dataSources.length === 0){
          create(connections, dataSource, cb);
        } else {
          update(connections, dataSource, cb);
        }
      });
    }
  ], cb);
}

module.exports = {
  get: get,
  list: list,
  update: update,
  create: create,
  updateCache: updateCache,
  validate: validateDataSource,
  deploy: deploy,
  remove: remove
};