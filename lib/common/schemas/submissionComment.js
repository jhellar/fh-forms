var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function(){
  return new Schema({
    "madeBy": {type: String, required: true},
    "madeOn": {type: Date, required: true},
    "value": {type: String, required: true}
  }, CONSTANTS.SCHEMA_OPTIONS_NO_ID);
};