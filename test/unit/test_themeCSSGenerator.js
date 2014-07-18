var exampleThemeJSON = require('../Fixtures/theme.json');
var themeCSSGenerator = require('../../lib/common/themeCSSGenerator.js').themeCSSGenerator;
var util = require('util');

var assert = require('assert');


module.exports.setUp = function (finished) {
  finished();
};

module.exports.tearDown = function (finished) {
  finished();
};

module.exports.testFindSection = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "testVal": 10
          }
        ]
      }
    ]
  };

  var foundSection = themeCSSGenerator(testJSON).generationFunctions.findSection("test_section", "test_subsection");
  assert.ok(foundSection);
  assert.ok(foundSection.testVal);
  assert.equal(foundSection.testVal, 10);
  finished();
};

module.exports.testFindSectionDoesNotExist = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "testVal": 10
          }
        ]
      }
    ]
  };

  var foundSection = themeCSSGenerator(testJSON).generationFunctions.findSection("test_section", "doesNotExist");
  assert.ok(foundSection == null);
  finished();
};

module.exports.testGenerateCSSBackground = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection1",
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection1",
            "style": {
              "background": true,
              "border": false,
              "typography": false,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": false, "typography": false, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("background-color:#123423;") > -1);
  finished();
};

module.exports.testGenerateCSSBackgroundDoesNotExist = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection"
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": false,
              "typography": false,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": false, "typography": false, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.equal(result, null);
  finished();
};

module.exports.testGenerateCSSBorder = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": true,
              "typography": false,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": true, "typography": false, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("border-style:solid;") > -1);
  assert.ok(result.indexOf("border-width:thin;") > -1);
  assert.ok(result.indexOf("border-color:#123456;") > -1);
  finished();
};

module.exports.testGenerateCSSBorderDoesNotExist = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection"
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": true,
              "typography": false,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": true, "typography": false, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.equal(result, null);
  finished();
};

module.exports.testGenerateCSSTypography = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": true, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(typeof result == "string");
  console.log(result);
  assert.ok(result.indexOf("font-family:times;") > -1);
  assert.ok(result.indexOf("font-style:italic;") > -1);
  assert.ok(result.indexOf("font-size:1.2em;") > -1);
  assert.ok(result.indexOf("color:#1234321;") > -1);
  assert.ok(result.indexOf("font-weight:normal;") > -1);
  finished();
};

module.exports.testGenerateCSSTypographyDoesNotExist = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection"
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": true, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.equal(result, null);
  finished();
};

module.exports.testGenerateMarginCSS = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "margin": {
              "top" : "5",
              "right": "6",
              "bottom": "7",
              "left": "8"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: true, right: true, bottom: true, left: true},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: true, right: true, bottom: true, left: true}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(result.indexOf("margin") > -1, "Expected 'margin:' to be in the result string but got " + result);
  assert.ok(result.indexOf("5px") > -1, "Expected '5px' to be in the result string but got " + result);
  assert.ok(result.indexOf("6px") > -1, "Expected '6px' to be in the result string but got " + result);
  assert.ok(result.indexOf("7px") > -1, "Expected '7px' to be in the result string but got " + result);
  assert.ok(result.indexOf("8px") > -1, "Expected '8px' to be in the result string but got " + result);

  assert.ok(result.indexOf("5px") < result.indexOf("6px"), "Expected top element to be before right element");
  assert.ok(result.indexOf("6px") < result.indexOf("7px"), "Expected right element to be before left element");
  assert.ok(result.indexOf("7px") < result.indexOf("8px"), "Expected bottom element to be before right element");
  finished();
};

module.exports.testGenerateMarginCSSNumbers = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "margin": {
              "top" : 5,
              "right": 6,
              "bottom": 7,
              "left": 8
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: true, right: true, bottom: true, left: true},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: true, right: true, bottom: true, left: true}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(result.indexOf("margin") > -1, "Expected 'margin:' to be in the result string but got " + result);
  assert.ok(result.indexOf("5px") > -1, "Expected '5px' to be in the result string but got " + result);
  assert.ok(result.indexOf("6px") > -1, "Expected '6px' to be in the result string but got " + result);
  assert.ok(result.indexOf("7px") > -1, "Expected '7px' to be in the result string but got " + result);
  assert.ok(result.indexOf("8px") > -1, "Expected '8px' to be in the result string but got " + result);

  assert.ok(result.indexOf("5px") < result.indexOf("6px"), "Expected top element to be before right element");
  assert.ok(result.indexOf("6px") < result.indexOf("7px"), "Expected right element to be before left element");
  assert.ok(result.indexOf("7px") < result.indexOf("8px"), "Expected bottom element to be before right element");
  finished();
};

module.exports.testGenerateMarginCSSDoesNotExist = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection"
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: true, right: true, bottom: true, left: true},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: true, right: true, bottom: true, left: true}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result === null);
  finished();
};

module.exports.testGenerateMarginCSSElementDoesNotExist = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "margin": {
              "top": "5"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: true, right: true, bottom: true, left: true},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: true, right: true, bottom: true, left: true}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result === null);
  finished();
};

module.exports.testGenerateMarginCSSElementNotAValidNumber = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "margin": {
              "top" : "5dsfd",
              "right": 6,
              "bottom": 7,
              "left": 8
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: true, right: true, bottom: true, left: true},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: true, right: true, bottom: true, left: true}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result === null);
  finished();
};

module.exports.testGeneratePaddingCSS = function(finished){
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "padding": {
              "top" : "5",
              "right": "6",
              "bottom": "7",
              "left": "8"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": false,
              "border": false,
              "typography": false,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: true, right: true, bottom: true, left: true}
            }
          }
        ]
      }
    ]
  };
  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": false, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: true, right: true, bottom: true, left: true}});
  assert.ok(result);
  assert.ok(result.indexOf("padding:") > -1, "Expected 'margin:' to be in the result string but got " + result);
  assert.ok(result.indexOf("5px") > -1, "Expected '5px' to be in the result string but got " + result);
  assert.ok(result.indexOf("6px") > -1, "Expected '6px' to be in the result string but got " + result);
  assert.ok(result.indexOf("7px") > -1, "Expected '7px' to be in the result string but got " + result);
  assert.ok(result.indexOf("8px") > -1, "Expected '8px' to be in the result string but got " + result);

  assert.ok(result.indexOf("5px") < result.indexOf("6px"), "Expected top element to be before right element");
  assert.ok(result.indexOf("6px") < result.indexOf("7px"), "Expected right element to be before left element");
  assert.ok(result.indexOf("7px") < result.indexOf("8px"), "Expected bottom element to be before right element");
  finished();
};

module.exports.testGenerateCSSALL = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            },
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            },
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": true,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": true, "typography": true, "margin": {top: false, right: false, bottom: false, left: false}, "padding": {top: false, right: false, bottom: false, left: false}});
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("font-family:times;") > -1);
  assert.ok(result.indexOf("font-style:italic;") > -1);
  assert.ok(result.indexOf("font-size:1.2em;") > -1);
  assert.ok(result.indexOf("color:#1234321;") > -1);
  assert.ok(result.indexOf("font-weight:normal;") > -1);
  assert.ok(result.indexOf("border-style:solid;") > -1);
  assert.ok(result.indexOf("border-width:thin;") > -1);
  assert.ok(result.indexOf("border-color:#123456;") > -1);
  assert.ok(result.indexOf("background-color:#123423;") > -1);
  finished();
};

module.exports.testGenerateCSSClassName = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            },
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            },
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": true,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSSClassName("test_section", "test_subsection");
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, "#fh_appform_container .fh_appform_test_section_test_subsection");
  finished();
};

module.exports.testGenerateCSSClassNameClassDefined = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            },
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            },
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": true,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSSClassName("test_section", "test_subsection", "someClass");
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, "#fh_appform_container .fh_appform_someClass");
  finished();
};


module.exports.testGenerateStaticCSS = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            },
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            },
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": true,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateStaticCSS([
    {"key": "someCssKey", "value": "someCSSVAL"}
  ]);
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, "someCssKey:someCSSVAL;");
  finished();
};

module.exports.testGenerateClassAdditions = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "typography": {
              "fontFamily": "times",
              "fontStyle": "italic",
              "fontSize": 1.2,
              "fontColour": "#1234321"
            },
            "border": {
              "thickness": "thin",
              "style": "solid",
              "colour": "#123456"
            },
            "background": {
              "background_color": "#123423"
            }
          }
        ]
      }
    ]
  };

  var testStructure = {
    "sections": [
      {
        "id": "test_section",
        "label": "SomeTestSection",
        sub_sections: [
          {
            "id": "test_subsection",
            "label": "Some Test SubSection",
            "style": {
              "background": true,
              "border": true,
              "typography": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateClassAdditions("fullCSSClassName", [
    {"classNameAddition": " someNewCSSClass", "cssAdditions": [
      {"key": "staticCSSKey", "value": "staticCSSVal"}
    ]}
  ]);
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, "fullCSSClassName someNewCSSClass{staticCSSKey:staticCSSVal;}");
  finished();
};


module.exports.testGenerateLogo = function (finished) {
  var testJSON = {
    "logo": {
      "base64String": "SOMEBASE64LOGO",
      "height": 100,
      "width": 150
    }
  };


  var testStructure = {
    "logo": {
      "staticCSS": [
        {"key": "background-position", "value": "center"},
        {"key": "background-repeat", "value": "no-repeat"},
        {"key": "width", "value": "100%"}
      ]
    }
  };


  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateLogoCSS();
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("#fh_appform_container .fh_appform_logo") > -1);
  assert.ok(result.indexOf("background-image:url(\"SOMEBASE64LOGO\");") > -1);
  assert.ok(result.indexOf("height:100px;") > -1);
  assert.ok(result.indexOf("width:150px;") > -1);
  finished();
};

module.exports.testSingleSectionGeneration = function (finished) {
  var testJSON = {
    "sections": [
      {
        "id": "body",
        "label": "Body",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "typography": {
              "fontSize": "11pt",
              "fontFamily": "arial",
              "fontStyle": "bold",
              "fontColour": "#321321"
            },
            "background": {
              "background_color": "#123456"
            },
            "border": {
              "thickness": "thin",
              "style": "double",
              "colour": "#123123"
            }
          }
        ]
      }
    ]};

  var testStructure = {
    "sections": [
      {
        "id": "body",
        "label": "Body",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {top: false, right: false, bottom: false, left: false},
              "padding": {top: false, right: false, bottom: false, left: false}
            }
          }
        ]
      }
    ]};

  var result = themeCSSGenerator(testJSON, testStructure).generateThemeCSS();

  assert.ok(result);
  assert.equal(result.generationResult.failed, false);
  var resultCSS = result.generatedCSS;
  assert.ok(resultCSS);
  finished();
};

module.exports.testFullThemeGeneration = function (finished) {
  var testJSON = exampleThemeJSON;

  var styleStructure = themeCSSGenerator().styleStructure;
  var result = themeCSSGenerator(testJSON, styleStructure).generateThemeCSS();

  assert.ok(result);
  assert.ok(result.generationResult.failed === false, "Expected generation to suceed, but it failed. " + util.inspect(result.generationResult));

  var resultCSS = result.generatedCSS;
  assert.ok(resultCSS);
  assert.ok(typeof resultCSS == "string");
  finished();
};




