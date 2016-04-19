var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

var ruleConditionalStatementsSchema = require('./ruleConditionalStatement');

module.exports = function() {
  // All fields in a page rule are required
  return new Schema({
    "type": {type: String, required: true, enum: ["skip", "show"]},
    "relationType" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
    "ruleConditionalOperator" : {"type": String, "required" : true, "default": "and", "enum": ["and", "or"]},
    "ruleConditionalStatements" : [ruleConditionalStatementsSchema()],
    "targetPage": [{ type: Schema.Types.ObjectId, ref: CONSTANTS.MODELNAMES.PAGE, required: true }]
  }, CONSTANTS.SCHEMA_OPTIONS);
};