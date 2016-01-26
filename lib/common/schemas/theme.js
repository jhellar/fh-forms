var allowedFontStyles = ["normal", "bold", "italic"];
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');
var allowedBorderThicknesses = ["none", "thin", "medium", "thick"];
var allowedBorderStyles = ["solid", "dotted", "dashed", "double"];

module.exports = function(){
  var styleSubSectionSchema = new Schema({
    "label": {type: String, requried: true},
    "id": {type: String, required: true},
    "typography": {
      "fontFamily": {type: String, required: false},
      "fontStyle": {type: String, required: false, enum: allowedFontStyles},
      "fontSize": {type: String, required: false},
      "fontColour": {type: String, required: false}
    },
    "border": {
      "thickness": {type: String, required: false, enum: allowedBorderThicknesses},
      "style": {type: String, required: false, enum: allowedBorderStyles},
      "colour": {type: String, required: false}
    },
    "background": {
      "background_color": {type: String, required: false}
    },
    "margin":{
      "top": {type: String, required: false},
      "right": {type: String, required: false},
      "bottom": {type: String, required: false},
      "left": {type: String, required: false}
    },
    "padding":{
      "top": {type: String, required: false},
      "right": {type: String, required: false},
      "bottom": {type: String, required: false},
      "left": {type: String, required: false}
    }
  }, {_id : false});

  var styleSectionSchema = new Schema({
    "label": {type: String, required: true},
    "id": {type: String, required: true},
    "sub_sections": [styleSubSectionSchema]
  }, {_id : false});

  var staticCSSSchema = new Schema({
    "key": {type: String, required:true},
    "value": {type: String, required:true}
  }, {_id: false});

  var themeStructureSubSections = new Schema({
    "label": {type: String, requried: true},
    "id": {type: String, required: true},
    "style": {
      "typography": {type: Boolean, required: true},
      "border": {type: Boolean, required: true},
      "background": {type: Boolean, required: true},
      "margin": {
        "top": {type: Boolean, required: false},
        "right": {type: Boolean, required: false},
        "bottom": {type: Boolean, required: false},
        "left": {type: Boolean, required: false}
      },
      "padding": {
        "top": {type: Boolean, required: false},
        "right": {type: Boolean, required: false},
        "bottom": {type: Boolean, required: false},
        "left": {type: Boolean, required: false}
      }
    },
    "staticCSS": [staticCSSSchema],
    "classAdditions": [{
      "classNameAddition": {type: String, required:true},
      "cssAdditions": [staticCSSSchema]
    }]
  }, {_id : false});

  var themeStructureSchema = new Schema({
    "label": {type: String, required: true},
    "id": {type: String, required: true},
    "sub_sections": [themeStructureSubSections]
  }, {_id : false});

  var themeSchema = new Schema({
    "lastUpdated": {type : Date, default : Date.now},
    "updatedBy" : {type: String, required: true},
    "createdBy" : {type: String, required: true},
    "name": {type: String, required: true},
    "css" : {type : String, required:true, default: "/*Error Generating Appforms CSS*/"},
    // When definining a theme, all fields are required except logo...
    "logo": {
      "base64String": {type: String, required: true},
      "height": {type: Number, required: true},
      "width": {type: Number, required: true}
    },
    "sections": [styleSectionSchema],
    "structure": {
      "sections": [themeStructureSchema],
      "logo": {
        "staticCSS": [staticCSSSchema]
      }
    }
  }, CONSTANTS.SCHEMA_OPTIONS);

  themeSchema.pre('validate', function (next){
    if(! this.createdBy){
      this.createdBy = this.updatedBy;
    }
    next();
  });

  return themeSchema;
};