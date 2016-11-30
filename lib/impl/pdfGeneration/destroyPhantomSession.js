var _ = require('underscore');
var logger = require('../../common/logger.js').getLogger();

/**
 * Closing The Phantom Session When Complete
 * @param session - An existing phantomjs session
 * @param cb
 * @returns {*}
 * @private
 */
module.exports = function destroyPhantomSession(session, cb) {
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
    session.exit();
    return cb();
  } catch (e) {
    logger.error('Failed exit of phantomjs. It may need to be closed or killed manually', e);
    return cb();
  }
};