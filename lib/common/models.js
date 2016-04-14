var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONSTANTS = require('./constants.js');
var FORM_CONSTANTS = CONSTANTS.FORM_CONSTANTS;

var schemas = require('./schemas');

module.exports = function() {
  var MODELNAMES = CONSTANTS.MODELNAMES;

  return {
    "init": function(conn, config) {
      config = config || {};
      var schemaOptions = { strict: true,  versionKey: false  };

      ///GROUPS ARE NOW REDUNDANT, NOT NEEDED ANY MORE
      var groupsSchema = new Schema({
        "name": {type: String, required: true},
        "users" : [{ type: String, required: true}],
        "forms": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.FORM, required: true}],
        "apps" : [{ type: String, required: true}],
        "themes": [{ type: Schema.Types.ObjectId, ref: MODELNAMES.THEME, required: true}]
      }, schemaOptions);

      groupsSchema.pre('save', function(next) {
        if (null === this.users) {
          this.users = [];
        }
        if (null === this.forms) {
          this.forms = [];
        }
        if (null === this.apps) {
          this.apps = [];
        }
        if (null === this.themes) {
          this.themes = [];
        }
        next();
      });

      ///GROUPS ARE NOW REDUNDANT, NOT NEEDED ANY MORE

      conn.model(MODELNAMES.FORM, schemas.form());
      conn.model(MODELNAMES.PAGE, schemas.page());
      conn.model(MODELNAMES.FIELD, schemas.field());
      conn.model(MODELNAMES.FIELD_RULE, schemas.fieldRule());
      conn.model(MODELNAMES.PAGE_RULE, schemas.pageRule());
      conn.model(MODELNAMES.THEME, schemas.theme());
      conn.model(MODELNAMES.APP_FORMS, schemas.projectForms());
      conn.model(MODELNAMES.APP_THEMES, schemas.projectTheme());
      conn.model(MODELNAMES.FORM_SUBMISSION, schemas.submission());
      conn.model(MODELNAMES.GROUPS, groupsSchema);
      conn.model(MODELNAMES.APP_CONFIG, schemas.projectConfig());
      conn.model(MODELNAMES.DATA_SOURCE, schemas.dataSource(config));
      conn.model(MODELNAMES.DATA_TARGET, schemas.dataTarget());
      conn.model(MODELNAMES.DATA_SOURCE_AUDIT_LOG, schemas.dataSourceCache.dataSourceAuditLogEntry());
    },
    "get": function(conn, modelName) {
      return conn.model(modelName);
    },
    "MODELNAMES": MODELNAMES,
    "FORM_CONSTANTS": FORM_CONSTANTS,
    "CONSTANTS": CONSTANTS,
    convertDSCacheToFieldOptions: schemas.dataSourceCache.convertDSCacheToFieldOptions
  };
};
