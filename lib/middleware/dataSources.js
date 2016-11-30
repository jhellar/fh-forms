var forms = require('../forms.js');
var dataSourcesHandler = require('./resultHandlers.js');
var constants = require('../common/constants.js').MIDDLEWARE;

function list(req, res, next) {
  var params = {};

  forms.dataSources.list(req.connectionOptions, params, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function create(req, res, next) {
  forms.dataSources.create(req.connectionOptions, req.body, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function validate(req, res, next) {
  forms.dataSources.validate(req.connectionOptions, req.body, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function get(req, res, next) {
  var params = {
    "_id": req.params.id
  };

  forms.dataSources.get(req.connectionOptions, params, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function update(req, res, next) {
  forms.dataSources.update(req.connectionOptions, req.body, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function remove(req, res, next) {
  var params = {
    "_id": req.params.id
  };

  forms.dataSources.remove(req.connectionOptions, params, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

function getDataSourcesForService(req, res, next) {
  var params = {
    "serviceGuid": req.params.id
  };

  forms.dataSources.search(req.connectionOptions, params, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

/**
 * Deploying A Data Source. This will update if already exists or create one if not.
 * @param req
 * @param res
 * @param next
 */
function deploy(req, res, next) {
  var dataSource = req.body;

  dataSource._id = req.params.id;

  forms.dataSources.deploy(req.connectionOptions, dataSource, dataSourcesHandler(constants.resultTypes.dataSources, req, next));
}

module.exports = {
  list: list,
  create: create,
  get: get,
  update: update,
  remove: remove,
  validate: validate,
  deploy: deploy,
  getDataSourcesForService: getDataSourcesForService
};