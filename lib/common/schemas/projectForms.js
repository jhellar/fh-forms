var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function(){
  return new Schema({
    "appId": {type: String, required: true},
    "lastUpdated": {type : Date, default : Date.now, required: true},
    "forms": [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.FORM, required: true}]
  }, CONSTANTS.SCHEMA_OPTIONS);
};