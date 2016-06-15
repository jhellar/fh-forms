var logger = require('../../common/logger.js').getLogger();
var phantom = require('phantom');
var getNextPhantomPort = require('./getNextPhantomPort');

/**
 * Getting/Creating A new phantom session
 * @param cb
 * @returns {*}
 * @private
 */
module.exports = function createPhantomSession(cb) {

  try {
    var port = getNextPhantomPort();
    logger.info('Creating new phantom session on port ', {port: port});
    phantom.create({
      port: port,
      format: 'a4',
      onExit: function(code) {
        logger.info('renderPDF createPhantomSession phantom session exited with code', {code: code});
        if (code !== 0) {
          var err = 'Unexpected exit code from phantom (' + code + ').\n' +
            'Please verify phantomjs is installed and is the right version (phantomjs -v)';
          logger.error(err);
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
};