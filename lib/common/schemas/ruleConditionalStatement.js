var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

module.exports = function() {
  return new Schema({
    "sourceField": { type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.FIELD, required: true},
    "restriction": {type: String, required: true, enum: ["is not","is equal to","is greater than","is less than","is at","is before","is after","is", "contains", "does not contain", "begins with", "ends with"]},
    "sourceValue": {type: String, required: true}
  }, CONSTANTS.SCHEMA_OPTIONS);
};