var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

var ruleConditionalStatementsSchema = require('./ruleConditionalStatement');

module.exports = function(){
  // All fields in a fieldRule are required
  return new Schema({
    "type": {type: String, required: true, enum: ["show", "hide"]},
    "relationType" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
    "ruleConditionalOperator" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
    "ruleConditionalStatements" : [ruleConditionalStatementsSchema()],
    "targetField": [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.FIELD, required: true }]
  }, CONSTANTS.SCHEMA_OPTIONS);
};