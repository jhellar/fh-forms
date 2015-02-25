var forms = require('../forms.js');
var dataTargetsHandler = require('./resultHandlers.js');
var constants = require('../common/constants.js').MIDDLEWARE;

function list(req, res, next){
  var params = {};

  forms.dataTargets.list(req.connectionOptions, params, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function create(req, res, next){
  forms.dataTargets.create(req.connectionOptions, req.body, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function validate(req, res, next){
  forms.dataTargets.validate(req.connectionOptions, req.body, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function get(req, res, next){
  var params = {
    "_id": req.params.id
  };

  forms.dataTargets.get(req.connectionOptions, params, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function update(req, res, next){
  forms.dataTargets.update(req.connectionOptions, req.body, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function remove(req, res, next){
  var params = {
    "_id": req.params.id
  };

  forms.dataTargets.remove(req.connectionOptions, params, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

function getDataTargetsForService(req, res, next){
  var params = {
    "serviceGuid": req.params.id
  };

  forms.dataTargets.search(req.connectionOptions, params, dataTargetsHandler(constants.resultTypes.dataTargets, req, next));
}

module.exports = {
  list: list,
  create: create,
  get: get,
  update: update,
  remove: remove,
  validate: validate,
  getDataTargetsForService: getDataTargetsForService
};