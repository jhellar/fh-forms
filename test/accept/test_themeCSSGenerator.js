var exampleThemeJSON = require('../Fixtures/theme.json');
var themeCSSGenerator = require('../../lib/common/themeCSSGenerator.js').themeCSSGenerator;

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
            "label": "Some Test SubSection",
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
              "border": false,
              "typography": false
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": false, "typography": false});
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
              "typography": false
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": false, "typography": false});
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
              "typography": false
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": true, "typography": false});
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
              "typography": false
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": true, "typography": false});
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": true});
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("font-family:times;") > -1);
  assert.ok(result.indexOf("font-style:italic;") > -1);
  assert.ok(result.indexOf("font-size:12px;") > -1);
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": false, "border": false, "typography": true});
  assert.equal(result, null);
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSS("test_section", "test_subsection", {"background": true, "border": true, "typography": true});
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf("font-family:times;") > -1);
  assert.ok(result.indexOf("font-style:italic;") > -1);
  assert.ok(result.indexOf("font-size:12px;") > -1);
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSSClassName("test_section", "test_subsection");
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, ".fh_appform_container .fh_appform_test_section_test_subsection");
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateCSSClassName("test_section", "test_subsection", "someClass");
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.equal(result, ".fh_appform_container .fh_appform_someClass");
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateStaticCSS({"someCssKey": "someCSSVAL"});
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
              "fontSize": "12px",
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
              "typography": true
            }
          }
        ]
      }
    ]
  };

  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateClassAdditions("fullCSSClassName", {" someNewCSSClass": {"staticCSSKey": "staticCSSVal"}});
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
      "staticCSS": {
        "background-position": "center",
        "background-repeat": "no-repeat",
        "width": "100%"
      }
    }
  };


  var result = themeCSSGenerator(testJSON, testStructure).generationFunctions.generateLogoCSS();
  assert.ok(result);
  assert.ok(typeof result == "string");
  assert.ok(result.indexOf(".fh_appform_container .fh_appform_logo") > -1);
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
              "border": true
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
//  console.log(resultCSS);
  finished();
};


module.exports.testFullThemeGeneration = function (finished) {
  var testJSON = exampleThemeJSON;

  var result = themeCSSGenerator(testJSON).generateThemeCSS();

  assert.ok(result);
  assert.equal(result.generationResult.failed, false);

  var resultCSS = result.generatedCSS;
  assert.ok(resultCSS);
  assert.ok(typeof resultCSS == "string");
  console.log(resultCSS);
  finished();
};




