var models = require('./lib/common/models.js')();

models.init();
//main

module.exports = {
  "getForms":require('./getForms.js'),
  "getForm":require('./getForm.js'),
  "getTheme":require('./getTheme.js'),
  "submitFormData":require('./submitFormData.js'),
  "submitFormFile":require('./submitFormFile.js'),
  "completeSubmission":require('./completeSubmission.js')
};