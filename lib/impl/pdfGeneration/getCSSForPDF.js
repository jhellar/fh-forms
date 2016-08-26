var async = require('async');
var fs = require('fs');
var path = require('path');

var CSS_FILES = ['css/bootstrap.css'
  , 'css/bootstrap-datepicker.css'
  , 'css/datetimepicker.css'
  , 'css/font-awesome.css'
  , 'css/formbuilder.css'
  , 'css/forms.css'
  , 'css/select2.css'
  , 'css/spectrum.css'
  , 'css/theme.css'];

var JS_FILES = ['js/bootstrap.js', 'js/jquery.js'];

/**
 * Small function to read the CSS and Javascript required to render a PDF.
 * @param callback
 */
module.exports = function getCSSForPDF(callback) {

  var currentDir = __dirname;

  async.parallel({
    css: function readCSS(cb) {
      async.map(CSS_FILES, function(filePath, cb) {
        fs.readFile(path.join(currentDir, filePath), "utf-8", cb);
      }, cb);
    },
    js: function readCSS(cb) {
      async.map(JS_FILES, function(filePath, cb) {
        fs.readFile(path.join(currentDir, filePath), "utf-8", cb);
      }, cb);
    }
  }, callback);
};