var fs = require('fs');
var path = require('path');
//Requiring Any Handlebar Templates Helpers
var compileTemplate = require('../../templates/helpers.js').compileTemplate;
var templatePath = path.join(__dirname, '..', '..',  'templates', 'submission.pdf.handlebars');
var submissionTemplatePath = path.join(__dirname, '..', '..',  'templates', 'submission_template.handlebars');

/**
 * Utility function to read and compile
 * @param cb
 */
module.exports = function readAndCompileTemplate(cb) {
  fs.readFile(templatePath, function(err, templateFile) {
    if (err) {
      return cb(err);
    }

    fs.readFile(submissionTemplatePath, function(err, body) {
      if (err) {
        return cb(err);
      }
      var html = templateFile.toString('utf-8').replace('#content#',body.toString('utf-8'));
      return cb(null, compileTemplate(html));
    });
  });
};