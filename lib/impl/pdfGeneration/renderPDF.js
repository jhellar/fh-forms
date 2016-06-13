var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var logger = require('../../common/logger.js').getLogger();
var phantom = require('phantom');
var cluster = require('cluster');

//Requiring Any Handlebar Templates Helpers
var compileTemplate = require('../../templates/helpers.js').compileTemplate;

var pdfTemplate;
var templatePath = path.join(__dirname, '..', '..',  'templates', 'submission.pdf.handlebars');
var submissionTemplatePath = path.join(__dirname, '..', '..',  'templates', 'submission_template.handlebars');

var basePhantomPort;
var phantomPortCounter = 0;


/**
 * Getting/Creating A new phantom session
 *
 * TODO: Reminder that this may be an issue on openshift (https://www.npmjs.com/package/phantom#use-it-in-restricted-enviroments)
 * @param cb
 * @returns {*}
 * @private
 */
function createPhantomSession(cb) {

  try {
    var port = getNextPhantomPort();
    logger.info('Creating new phantom session on port ' + port);
    phantom.create({
      port: port,
      format: 'a4',
      onExit: function(code) {
        logger.info('renderPDF createPhantomSession phantom session exited with code', code);
        if (code !== 0) {
          var err = 'Unexpected exit code from phantom (' + code + ').\n' +
              'Please verify phantomjs is installed and is the right version (phantomjs -v)';
          logger.error(err);
          throw new Error(err);
        }
      }
    }, function(_ph) {
      logger.debug('phantom bridge initiated');
      return cb(null, _ph);
    });
  } catch (e) {
    var msg = 'Error creating phantom session. Please try again later.';
    logger.error(msg, e);
    return cb(msg + e.toString());
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

            destroyPhantomSession(session, function() {
              return cb(null, file);
            });
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
 * @param session - An existing phantomjs session
 * @param cb
 * @returns {*}
 * @private
 */
function destroyPhantomSession(session, cb) {

  if (_.isFunction(session)) {
    cb = session;
    session = null;
  }

  cb = _.isFunction(cb) ? cb : _.noop;

  if (!session) {
    return cb("Expected a session object");
  }

  logger.info('Attempting graceful exit of phantomjs');

  try {
    //TODO: REMOVE THIS TIMEOUT : ONLY USED FOR TESTING!!
    setTimeout(function() {
      session.exit();
      return cb();
    }, 4000);
  } catch (e) {
    logger.error('Failed exit of phantomjs. It may need to be closed or killed manually', e);
    return cb();
  }
}

function getNextPhantomPort() {
  // start at 10100 for first worker
  //          10200 for second worker etc...
  // and increment up to xxx99, then reset back to zero
  //
  // set base port for this worker
  if (!basePhantomPort) {
    var workerId = cluster.worker ? cluster.worker.id : 1;
    basePhantomPort = 10000 + (100 * workerId);
    phantomPortCounter = 0;
  }
  phantomPortCounter++;

  // Get port within range for this worker e.g.
  // for worker 1, range is 10100 <= x <= 10199
  // 10100 + (0 % 100)   = 10100
  // 10100 + (22 % 100)  = 10122
  // 10100 + (100 % 100) = 10100
  // 10100 + (153 % 100) = 10153
  var port = basePhantomPort + (phantomPortCounter % 100);
  logger.info('getNextPhantomPort ' + basePhantomPort + " + (" + phantomPortCounter + "%100) = " + port);
  return port;
}


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
