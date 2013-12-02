
var exampleThemeJSON = require('../Fixtures/theme.json').json;
var expectedThemeCSS = require('../Fixtures/themeCSS.json').css;
var themeCSSGenerator = require('../../lib/common/themeCSSGenerator.js');

var assert = require('assert');


module.exports.setUp = function(finished){
  finished();
}

module.exports.tearDown = function(finished){
  finished();
}

module.exports.generateCSSFromJSON = function(finished){

  var generatedCSS = themeCSSGenerator(exampleThemeJSON);

  assert(generatedCSS !== null);

  assert(generatedCSS === expectedThemeCSS);

  finished();
}

