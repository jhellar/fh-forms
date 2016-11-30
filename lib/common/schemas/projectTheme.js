var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function() {
  return new Schema({
    "appId": {type: String, required: true},
    "theme": { type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.THEME, required: true }
  }, CONSTANTS.SCHEMA_OPTIONS);
};