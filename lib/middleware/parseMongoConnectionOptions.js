/**
 * Populating mongo connection options for forms operations.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function parseMongoConnectionOptions(req, res, next){
  var options = {};

  options.uri = req.mongoUrl;

  req.connectionOptions = options;

  return next();
}

module.exports = parseMongoConnectionOptions;