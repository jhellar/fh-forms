var async = require('async');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var logger = require('../../common/logger.js').getLogger();
var phantom = require('phantom');

//Requiring Any Handlebar Templates Helpers
var compileTemplate = require('../../templates/helpers.js').compileTemplate;

var pdfTemplate;
var existingPhantomSession;
var phantomExiting;
var templatePath = path.join(__dirname, '..', '..',  'templates', 'submission.pdf.handlebars');
var submissionTemplatePath = path.join(__dirname, '..', '..',  'templates', 'submission_template.handlebars');


/**
 * Getting/Creating A new phantom session
 *
 * TODO: Reminder that this may be an issue on openshift (https://www.npmjs.com/package/phantom#use-it-in-restricted-enviroments)
 * @param cb
 * @returns {*}
 * @private
 */
function createPhantomSession(cb) {
  // reuse existing phantom session if available
  if (existingPhantomSession) {
    logger.debug("renderPDF createPhantomSession. Using Existing");
    return cb(null, existingPhantomSession);
  }

  try {
    logger.info('renderPDF createPhantomSession Creating new phantom session');
    phantom.create({
      format: 'a4',
      onExit: function(code) {
        logger.info('renderPDF createPhantomSession phantom session exited with code', code);
        phantomExiting = false;
        if (code !== 0) {
          var err = 'Unexpected exit code from phantom (' + code + ').\n' +
              'Please verify phantomjs is installed and is the right version (phantomjs -v)';
          logger.error(err);
          throw new Error(err);
        }
      }
    }, function(_ph) {
      logger.debug('phantom bridge initiated');
      existingPhantomSession = _ph;
      logger.debug('ph', existingPhantomSession);
      return cb(null, existingPhantomSession);
    });
  } catch (e) {
    var msg = 'Error creating phantom session. Please try again later.';
    logger.error(msg, e);
    destroyPhantomSession(function() {
      return cb(msg + e.toString());
    });
  }
}

/**
 * Rendering The HTML Template To A PDF Document
 * @param params
 *  - template
 *  - session
 *  - form
 *  - submission
 *  - location
 * @param cb
 * @returns {*}
 * @private
 */
function renderPdf(params, cb) {
  var template = params.template;
  var session = params.session;
  var form = params.form;
  var submission = params.submission;
  submission.formName = form.name;
  var studioLocation = params.location;
  logger.debug('renderPDF renderPdf ', params);



  var page;

  try {
    session.createPage(function(_page) {
      logger.debug('page created');
      page = _page;
      // A4 aspect ratio
      page.set('paperSize', {
        format: 'A4'
      }, function() {
        logger.debug('page aspect ratio set');
        //Can't load css files over https. Needs to be http.

        if (typeof(studioLocation) === "string") {
          studioLocation = studioLocation.replace("https://", "http://");
        }

        var html = template({
          "form": form,
          "location":studioLocation,
          "subexport":submission
        });

        logger.trace('pdf html', html);

        // inject html as we don't have a server to serve html to phantom
        page.setContent(html, null, function(status) {
          logger.debug('content set. status', status);

          var file = path.join(params.pdfExportDir, form._id + '_' + submission._id + '.pdf');
          page.render(file, function() {
            logger.info('Rendered pdf:', file);
            page.close();
            page = null;
            return cb(null, file);
          });
        });
      });
    });
  } catch (e1) {
    logger.error('Exception rendering pdf', e1);
    try {
      if (page) {
        page.close();
      }
    } catch (e2) {
      // silent
      logger.warn('Error closing page after phantom exception', e2);
    }
    return cb('Exception rendering pdf:' + e1.toString());
  }
}

/**
 * Converting A Submission To A PDF Document
 * @param params
 *  - submission
 *  - location
 *  - pdfTemplateLoc
 * @param cb
 * @returns {*}
 * @private
 */
function submissionToPDF(params, cb) {

  logger.debug("renderPDF submissionToPDF", params);
  params = params || {};

  var submission = params.submission;
  var location = params.options.location;
  if (!submission || !submission.formSubmittedAgainst || !location) {
    return cb("Invalid Submission Data");
  }
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
}

/**
 * Closing The Phantom Session When Complete
 * @param cb
 * @returns {*}
 * @private
 */
function destroyPhantomSession(cb) {
  logger.info('Attempting graceful exit of phantomjs');
  if (!existingPhantomSession) {
    if (_.isFunction(cb)) {
      cb();
    }
    return;
  }

  try {
    // Phantom doesnt have an 'exit' event emitted, or a callback arg for .exit()
    // But it does have an 'onExit()' callback that can be passed into phantom.create()
    // We can use this to asynchronously update a flag (phantomExiting) for when phantom has finished exiting,
    // and check that flag here using async.whilst, up to a max number of tries (5 seconds)
    // If we reach the max number of checks, we assume phantom has exited, but didn't bother
    // to call 'onExit()'. Worst case scenario is phantom is still running. This will throw an
    // exception the next time phantom is used and highlight the underlying problem.
    var count = 0;
    phantomExiting = true;
    existingPhantomSession.exit();

    async.whilst(function() {
      logger.debug('phantomExiting', phantomExiting);
      return phantomExiting && count < 500;
    }, function(wcb) {
      count++;
      return setTimeout(wcb, 10);
    }, function() {
      existingPhantomSession = null;
      if (cb) {
        return cb();
      }
    });
  } catch (e) {
    logger.error('Failed exit of phantomjs. It may need to be closed or killed manually', e);
    if (cb) {
      return cb();
    }
  }
}

//Any phantom sessions should be destroyed when the process exits
process.on('exit', function() {
  // Deliberately pass no callback as we cant do async stuff when exiting a node process.
  // This is a best effort to shutdown phantom when the node process is exiting.
  logger.info("Destroying Phantom Sessions On Process Exit");
  destroyPhantomSession();
});


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
  params = params || {};

  //Already have a compiled template, no need to compile it again.
  if (pdfTemplate) {
    return cb(null, pdfTemplate);
  }

  fs.readFile(templatePath, function(err, templateFile) {
    if (err) {
      return cb(err);
    }

    fs.readFile(submissionTemplatePath, function(err, body) {
      if (err) {
        return cb(err);
      }
      var html = templateFile.toString('utf-8').replace('#content#',body.toString('utf-8'));
      pdfTemplate = compileTemplate(html);
      logger.debug('Compiled handlebars submission pdf template', pdfTemplate);
      return cb(null, pdfTemplate);
    });
  });
}



module.exports = {
  submissionToPDF: submissionToPDF,
  destroyPhantomSession: destroyPhantomSession,
  loadPdfTemplate: loadPdfTemplate,
  renderPdf: renderPdf,
  createPhantomSession: createPhantomSession
};
