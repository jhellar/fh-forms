
var exampleThemeJSON = require('../Fixtures/theme.json');
var themeCSSGenerator = require('../../lib/common/themeCSSGenerator.js').themeCSSGenerator;
var themeCSSFunctions = require('../../lib/common/themeCSSGenerator.js').themeCSSFunctions;

var assert = require('assert');


module.exports.setUp = function(finished){
  finished();
};

module.exports.tearDown = function(finished){
  finished();
};

module.exports.testGetButtonCSS = function(finished){
  var testJSON = {
    "colours":{
      "buttons":{
        "navigation":"#FF0002"
      }
    },
    "typography":{
      "buttons":{
        "fontFamily":"arial",
        "fontStyle":"bold",
        "fontSize":"17pt",
        "fontColour":"#FF0000"
      }
    },
    "borders" : {
      "button_navigation": {
        "thickness": "thick",
        "style": "double",
        "colour": "#5363c1"
      }
    }
  };

  var resStr = themeCSSFunctions.get_button_css(testJSON, "navigation", "buttons");
  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0002") > -1);
  assert.ok(resStr.indexOf("border-style:double") > -1);
  assert.ok(resStr.indexOf("border-width:thick") > -1);
  assert.ok(resStr.indexOf("border-color:#5363c1") > -1);
  finished();
};

module.exports.testGenerateLogo = function(finished){
  var testJSON = {"logo" : {
    base64String : "sometestlogostrbase64",
    height: 100,
    width: 200
  }};

  var resStr = themeCSSFunctions.logo(testJSON);

  assert.ok(resStr.indexOf("background-image") > -1);
  assert.ok(resStr.indexOf("sometestlogostrbase64") > -1);
  finished();
};

module.exports.testGeneratebuttonNavigation = function(finished){
  var testJSON = {
    "colours":{
      "buttons":{
        "navigation":"#FF0002"
      }
    },
    "typography":{
      "buttons":{
        "fontFamily":"arial",
        "fontStyle":"bold",
        "fontSize":"17pt",
        "fontColour":"#FF0000"
      }
    },
    "borders" : {
      "button_navigation": {
        "thickness": "thick",
        "style": "double",
        "colour": "#5363c1"
      }
    }
  };

  var resStr = themeCSSFunctions.button_navigation(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0002") > -1);
  assert.ok(resStr.indexOf("font-size:17pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:bold") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  assert.ok(resStr.indexOf("border-style:double") > -1);
  assert.ok(resStr.indexOf("border-width:thick") > -1);
  assert.ok(resStr.indexOf("border-color:#5363c1") > -1);
  finished();
}

module.exports.testGenerateButtonAction = function(finished){
  var testJSON = {
    "colours":{
      "buttons":{
        "action":"#FF0000"
      }
    },
    "typography":{
      "buttons":{
        "fontFamily":"arial",
        "fontStyle":"bold",
        "fontSize":"17pt",
        "fontColour":"#FF0000"
      }
    },
    "borders" : {
      "button_action": {
        "thickness": "thick",
        "style": "double",
        "colour": "#5363c1"
      }
    }
  };

  var resStr = themeCSSFunctions.button_action(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0000") > -1);
  assert.ok(resStr.indexOf("font-size:17pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:bold") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  assert.ok(resStr.indexOf("border-style:double") > -1);
  assert.ok(resStr.indexOf("border-width:thick") > -1);
  assert.ok(resStr.indexOf("border-color:#5363c1") > -1);
  finished();
}

module.exports.testGenerateButtonCancel = function(finished){
  var testJSON = {
    "colours":{
      "buttons":{
        "cancel":"#FF0230"
      }
    },
    "typography":{
      "buttons":{
        "fontFamily":"arial",
        "fontStyle":"bold",
        "fontSize":"17pt",
        "fontColour":"#FF0000"
      }
    },
    "borders" : {
      "button_cancel": {
        "thickness": "thick",
        "style": "double",
        "colour": "#5363c1"
      }
    }
  };

  var resStr = themeCSSFunctions.button_cancel(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0230") > -1);
  assert.ok(resStr.indexOf("font-size:17pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:bold") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  assert.ok(resStr.indexOf("border-style:double") > -1);
  assert.ok(resStr.indexOf("border-width:thick") > -1);
  assert.ok(resStr.indexOf("border-color:#5363c1") > -1);
  finished();
}

module.exports.testGenerateNavigation = function(finished){
  var testJSON = {"colours" : {"backgrounds" : {"navigationBar" : "#FF0000"}}};

  var resStr = themeCSSFunctions.navigation(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0000") > -1);
  finished();
}

module.exports.testGenerateHeader = function(finished){
  var testJSON = {"colours" : {"backgrounds" : {"headerBar" : "#FF7800"}}};

  var resStr = themeCSSFunctions.header(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF7800") > -1);
  finished();
}

module.exports.testGenerateBody = function(finished){
  var testJSON = {"colours" : {"backgrounds" : {"body" : "#FF7800"}}};

  var resStr = themeCSSFunctions.body(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF7800") > -1);
  finished();
}

module.exports.testGenerateForm = function(finished){
  var testJSON = {
    "colours" : {
      "backgrounds" : {
        "form" : "#FF0400"
      }
    },
    "borders" : {
      "forms" : {
        "thickness": "medium",
        "style": "solid",
        "colour": "#FF2000"
      }
    }
  };

  var resStr = themeCSSFunctions.form(testJSON);
  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0400") > -1);
  assert.ok(resStr.indexOf("border-style:solid") > -1);
  assert.ok(resStr.indexOf("border-width:medium") > -1);
  assert.ok(resStr.indexOf("border-color:#FF2000") > -1);
  finished();
}

module.exports.testGenerateFieldTitle = function(finished){
  var testJSON = {
    "typography": {
      "fieldTitle" :{
        "fontFamily": "arial",
        "fontStyle": "bold",
        "fontSize": "14pt",
        "fontColour": "#FF0000"
      }
    }
  };

  var resStr = themeCSSFunctions.field_title(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("font-size:14pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:bold") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  finished();
}

module.exports.testGenerateFieldArea = function(finished){
  var testJSON = {
    "colours" : {
      "backgrounds": {
        "fieldArea" : "#FF0000"
      }
    },
    "borders" : {
      "fieldArea" : {
        "thickness": "thin",
        "style": "dotted",
        "colour": "#4c53dd"
      }
    }
  };

  var resStr = themeCSSFunctions.field_area(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0000") > -1);
  assert.ok(resStr.indexOf("border-style:dotted") > -1);
  assert.ok(resStr.indexOf("border-width:thin") > -1);
  assert.ok(resStr.indexOf("border-color:#4c53dd") > -1);
  finished();
}

module.exports.testGenerateFieldInput = function(finished){

  var testJSON = {
    "colours" : {
      "backgrounds" : {
        "fieldInput" : "#FF0508"
      }
    },
    "borders" : {
      "fieldInput": {
        "thickness": "medium",
        "style": "double",
        "colour": "#FF4200"
      }
    },
    "typography" : {
      "fieldInput": {
        "fontFamily": "arial",
        "fontStyle": "italic",
        "fontSize": "15pt",
        "fontColour": "#FF0000"
      }
    }
  };

  var resStr = themeCSSFunctions.field_input(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0508") > -1);
  assert.ok(resStr.indexOf("border-style:double") > -1);
  assert.ok(resStr.indexOf("border-width:medium") > -1);
  assert.ok(resStr.indexOf("border-color:#FF4200") > -1);
  assert.ok(resStr.indexOf("font-size:15pt") > -1);
  assert.ok(resStr.indexOf("font-style:italic") > -1);
  assert.ok(resStr.indexOf("font-weight:normal") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  finished();
}

module.exports.testGenerateFieldInstructions = function(finished){
  var testJSON = {
    "colours" : {
      "backgrounds" : {
        "fieldInstructions" : "#FF0508"
      }
    },
    "borders" : {
      "instructions": {
        "thickness": "thick",
        "style": "dotted",
        "colour": "#FF0010"
      }
    },
    "typography" : {
      "instructions": {
        "fontFamily": "arial",
        "fontStyle": "normal",
        "fontSize": "16pt",
        "fontColour": "#EF0000"
      }
    }
  };

  var resStr = themeCSSFunctions.field_instructions(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("background-color:#FF0508") > -1);
  assert.ok(resStr.indexOf("border-style:dotted") > -1);
  assert.ok(resStr.indexOf("border-width:thick") > -1);
  assert.ok(resStr.indexOf("border-color:#FF0010") > -1);
  assert.ok(resStr.indexOf("font-size:16pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:normal") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#EF0000") > -1);
  finished();
}

module.exports.testGenerateTitle = function(finished){
  var testJSON = {
    "typography" : {
      "title" : {
        "fontFamily": "arial",
        "fontStyle": "bold",
        "fontSize": "12pt",
        "fontColour": "#FF0000"
      }
    }
  };

  var resStr = themeCSSFunctions.title(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("font-size:12pt") > -1);
  assert.ok(resStr.indexOf("font-style:normal") > -1);
  assert.ok(resStr.indexOf("font-weight:bold") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  finished();
}

module.exports.testGenerateDescription = function(finished){
  var testJSON = {
    "typography" : {
      "description": {
        "fontFamily": "arial",
        "fontStyle": "italic",
        "fontSize": "13pt",
        "fontColour": "#FF0000"
      }
    }
  };

  var resStr = themeCSSFunctions.description(testJSON);

  assert.ok(resStr != null);
  assert.ok(resStr.indexOf("font-size:13pt") > -1);
  assert.ok(resStr.indexOf("font-style:italic") > -1);
  assert.ok(resStr.indexOf("font-weight:normal") > -1);
  assert.ok(resStr.indexOf("font-family:arial") > -1);
  assert.ok(resStr.indexOf("color:#FF0000") > -1);
  finished();
}

module.exports.testGenerateCSSFromJSON = function(finished){

  var generatedCSS = themeCSSGenerator(exampleThemeJSON)();

  assert(generatedCSS != null);
  console.log(generatedCSS);
  finished();
};

