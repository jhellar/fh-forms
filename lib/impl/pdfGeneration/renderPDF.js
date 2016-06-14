var async = require('async');
var logger = require('../../common/logger.js').getLogger();
var config = require('../../config');
var doPDFGeneration = require('./doPdfGeneration');

var pdfGenerationQueue;

function queueWorker(pdfGenerationTask, cb) {
  logger.debug("Queueing PDF Generation ", pdfGenerationTask);
  doPDFGeneration(pdfGenerationTask, cb);
}

function createPDFGenerationQueue(maxConcurrentPhantomPerWorker) {
  var queue = async.queue(queueWorker, maxConcurrentPhantomPerWorker);

  queue.saturated = function() {
    logger.info("PDF Generation Queue Saturated");
  };

  queue.unsaturated = function() {
    logger.info("PDF Generation Queue Unsaturated");
  };

  return queue;
}


/**
 * Converting A Submission To A PDF Document
 *
 * In this implementation, the generation function is added to a concurrent queue. The maxConcurrentPhantomPerWorker parameter controls the number of concurrent PDF
 * generation processes per worker. This is to limit the amount of memory the phantomjs processes consume.
 *
 * @param params
 *  - submission
 *  - location
 *  - pdfTemplateLoc
 *  - maxConcurrentPhantomPerWorker  - The maximum number of concurrent phantom processes per worker. This is to restrict the number of Phantom instances that are active as they consume a lot of memory.
 * @param cb
 * @returns {*}
 */
function submissionToPDF(params, cb) {
  logger.debug("renderPDF submissionToPDF", params);
  params = params || {};

  var maxConcurrentPhantomPerWorker = params.maxConcurrentPhantomPerWorker || config.get().maxConcurrentPhantomPerWorker;

  if (!params.submission || !params.submission.formSubmittedAgainst || !params.options || !params.options.location) {
    return cb("Invalid Submission Data. Expected a submission and location parameter.");
  }

  pdfGenerationQueue = pdfGenerationQueue || createPDFGenerationQueue(maxConcurrentPhantomPerWorker);

  //Adding the export task to the queue
  pdfGenerationQueue.push(params, cb);
}


module.exports = {
  submissionToPDF: submissionToPDF
};
