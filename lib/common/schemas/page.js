var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function(){

  return new Schema({
    "name" : String,
    "description": String,
    "fields" : [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.FIELD }]
  }, CONSTANTS.SCHEMA_OPTIONS);
};