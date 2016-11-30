var cluster = require('cluster');
var logger = require('../../common/logger.js').getLogger();

var basePhantomPort;
var phantomPortCounter = 0;

module.exports = function getNextPhantomPort() {
  // start at 10100 for first worker
  //          10200 for second worker etc...
  // and increment up to xxx99, then reset back to zero
  //
  // set base port for this worker
  if (!basePhantomPort) {
    var workerId = cluster.worker ? cluster.worker.id : 1;

    logger.debug("Worker ID used to generate a phantom port", {workerId: workerId});
    basePhantomPort = 10000 + (100 * workerId);
    phantomPortCounter = 0;
  }

  // Get port within range for this worker e.g.
  // for worker 1, range is 10100 <= x <= 10199
  // 10100 + (0 % 100)   = 10100
  // 10100 + (22 % 100)  = 10122
  // 10100 + (100 % 100) = 10100
  // 10100 + (153 % 100) = 10153
  var port = basePhantomPort + (phantomPortCounter % 100);
  logger.debug('getNextPhantomPort ' + basePhantomPort + " + (" + phantomPortCounter + "%100) = ", {port: port, basePhantomPort: basePhantomPort, phantomPortCounter: phantomPortCounter});

  //Incrementing the port to avoid conflicts.
  phantomPortCounter++;
  return port;
};