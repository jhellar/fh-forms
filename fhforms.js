var forms = require('./lib/forms.js');
var formsMiddleware = require('./lib/middleware.js');


module.exports.core = forms;
module.exports.middleware = formsMiddleware;
module.exports.CONSTANTS = require('./lib/common/constants');