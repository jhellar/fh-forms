var fhLogger = require('fh-logger');

var logger;

function setLogger(newLogger) {
  logger = newLogger;
  return logger;
}

function getLogger() {

  if (!logger) {
    setLogger(fhLogger.createLogger({
      name: 'test-fh-forms',
      streams: [
        {
          "type": "stream",
          "src": true,
          "level": "error",
          "stream": "process.stdout"
        }
      ]
    }));
  }

  return logger;
}

module.exports = {
  setLogger: setLogger,
  getLogger: getLogger
};
