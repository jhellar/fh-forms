var logger = require('../../common/logger.js').getLogger();

//Common compiled handlebars template for pdf generation. Saves having to compile it every time.
var pdfTemplate;

var createPhantomSession = require('./createPhantomSession');
var renderPdf = require('./renderSinglePDF');
var readAndCompileTemplate = require('./readAndCompileTemplate');

/**
 * Loading The Submission Template From Studio
 * @param params
 *  - location
 *  - pdfTemplateLoc
 * @param cb
 * @returns {*}
 * @private
 */
function loadPdfTemplate(params, cb) {
  logger.debug("renderPDF loadPdfTemplate", params);

  //Already have a compiled template, no need to compile it again.
  if (pdfTemplate) {
    return cb(null, pdfTemplate);
  } else {
    readAndCompileTemplate(function(err, compiledTemplate) {
      pdfTemplate = compiledTemplate;
      return cb(err, pdfTemplate);
    });
  }
}

/**
 * Performing all of the steps required to generate a PDF of a submission
 * @param params
 *  - submission
 *  - location
 *  - pdfTemplateLoc
 * @param cb
 * @returns {*}
 */
module.exports = function doPDFGeneration(params, cb) {
  var submission = params.submission;
  var location = params.options.location;
  var form = submission.formSubmittedAgainst;

  loadPdfTemplate({
    location: location,
    pdfTemplateLoc: params.options.pdfTemplateLoc
  }, function(err, compiledTemplate) {
    if (err) {
      logger.error("renderPDF loadPdfTemplate ", {error: err});
      return cb(err);
    }
    createPhantomSession(function(err, session) {
      if (err) {
        logger.error("renderPDF createPhantomSession ", {error: err});
        return cb(err);
      }
      renderPdf({
        template: compiledTemplate,
        session: session,
        form: form,
        submission: submission,
        location: location,
        pdfExportDir: params.options.pdfExportDir
      }, cb);
    });
  });
};