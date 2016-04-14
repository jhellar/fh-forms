var forms = require('../forms.js');
var _ = require('underscore');
var formsResultHandlers = require('./resultHandlers.js');
var constants = require('../common/constants.js').MIDDLEWARE;

/**
 * List All Form Projects
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
  forms.getAllAppForms(req.connectionOptions, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Update Projects Using A Form
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next) {
  var params = {
    appId: req.params.id || req.body._id,
    forms: req.body.forms || []
  };
  forms.updateAppForms(req.connectionOptions, params, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}


/**
 * Middleware For Updating A Theme Associated With A Project
 * @param req
 * @param res
 * @param next
 */
function updateTheme(req, res, next) {

  //No theme sent, no need update the project theme
  if (!req.body.theme) {
    return next();
  }

  var params = {
    appId: req.params.id || req.body._id,
    theme: req.body.theme
  };
  forms.setAppTheme(_.extend(req.connectionOptions, params), formsResultHandlers(constants.resultTypes.formProjects, req, next));
}


/**
 * Middleware To Get A Full Theme Definition
 */
function getFullTheme(req, res, next) {
  req.getFullTheme = true;

  getTheme(req, res, next);
}


/**
 * Middleware To Get A Theme Assocaited With A Project
 * @param req
 * @param res
 * @param next
 */
function getTheme(req, res, next) {
  var params = {
    appId: req.params.projectid || req.params.id
  };
  forms.getAppTheme(_.extend(req.connectionOptions, params), function(err, theme) {
    if (err) {
      return next(err);
    }

    req.appformsResultPayload = req.appformsResultPayload || {};

    if (_.isObject(req.appformsResultPayload.data) && theme && !req.getFullTheme) {
      req.appformsResultPayload.data.theme = theme._id;
    } else {
      //Want the full theme definition
      req.appformsResultPayload = {
        data: theme
      };
    }

    next();
  });
}
/**
 * Removing A Forms Project. This is mainly done when projects are deleted.
 *
 * Cleans up references to the project in the database. AppThemes/AppForms/AppConfig etc.
 * @param req
 * @param res
 * @param next
 */

function remove(req, res, next) {
  var params = {
    appId: req.params.id
  };

  forms.deleteAppReferences(req.connectionOptions, params, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Get Forms Related To A Project Guid
 * @param req
 * @param res
 * @param next
 */
function get(req, res, next) {
  var params = {
    appId: req.params.projectid || req.params.id
  };

  forms.getAppFormsForApp(_.extend(req.connectionOptions, params), formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Getting Form Ids Only Associated With A Project
 * @param req
 * @param res
 * @param next
 */
function getFormIds(req, res, next) {
  var params = {
    appId: req.params.projectid || req.params.id
  };

  forms.getAppFormsForApp(_.extend(req.connectionOptions, params), function(err, appFormResult) {
    if (err) {
      return next(err);
    }

    //Only Want The Form Ids
    req.appformsResultPayload = {
      data: _.map(_.compact(appFormResult.forms), function(form) {return form._id.toString();}),
      type: constants.resultTypes.formProjects
    };

    next();
  });
}


/**
 * Get Config For A Single Project
 * @param req
 * @param res
 * @param next
 */
function getConfig(req, res, next) {
  var params = {
    appId: req.params.projectid || req.params.id
  };

  forms.getAppConfig(req.connectionOptions, params, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}


/**
 * Update Config For A Single Project
 * @param req
 * @param res
 * @param next
 */
function updateConfig(req, res, next) {
  var params = {
    appId: req.params.id
  };

  forms.updateAppConfig(req.connectionOptions, _.extend(req.body, params), formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Exporting All App Forms
 * @param req
 * @param res
 * @param next
 */
function exportProjects(req, res, next) {
  var options = req.connectionOptions;

  forms.exportAppForms(options, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Importing All App Forms
 * @param req
 * @param res
 * @param next
 */
function importProjects(req, res, next) {
  var options = req.connectionOptions;

  var appFormsToImport = req.body || [];

  if (!_.isArray(appFormsToImport)) {
    return next("Expected An Array Of App Form Entries");
  }

  forms.importAppForms(options, appFormsToImport, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Exporting Project Config
 * @param req
 * @param res
 * @param next
 */
function exportProjectConfig(req, res, next) {
  var options = req.connectionOptions;

  forms.exportAppConfig(options, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}

/**
 * Importing Project Config.
 * @param req
 * @param res
 * @param next
 */
function importProjectConfig(req, res, next) {
  var options = req.connectionOptions;

  var projectConfigToImport = req.body || [];

  if (!_.isArray(projectConfigToImport)) {
    return next("Expected An Array Of Project Config Values");
  }

  forms.importAppConfig(options, projectConfigToImport, formsResultHandlers(constants.resultTypes.formProjects, req, next));
}



module.exports = {
  list: list,
  exportProjects: exportProjects,
  importProjects: importProjects,
  exportProjectConfig: exportProjectConfig,
  importProjectConfig: importProjectConfig,
  update: update,
  get: get,
  getFormIds: getFormIds,
  getConfig: getConfig,
  remove: remove,
  updateConfig: updateConfig,
  updateTheme: updateTheme,
  getTheme: getTheme,
  getFullTheme: getFullTheme
};