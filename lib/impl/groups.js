var async = require('async');
var _ = require('underscore');
var util = require('util');
var models = require('../common/models.js')();
var validation = require('./../common/validate');

exports.getAllGroups = getAllGroups;
exports.getGroup = getGroup;
exports.updateGroup = updateGroup;
exports.createGroup = createGroup;
exports.deleteGroup = deleteGroup;

exports.getFormsForUser = getFormsForUser;
exports.getAppsForUser = getAppsForUser;
exports.getThemesForUser = getThemesForUser;

exports.validateAppAllowedForUser = validateAppAllowedForUser;
exports.validateFormAllowedForUser = validateFormAllowedForUser;
exports.validateThemeAllowedForUser = validateThemeAllowedForUser;

function getFormsForUser(connections, userToRestrictTo, cb) {
  return getDataForUser(connections, "forms", userToRestrictTo, cb);
}

function getAppsForUser(connections, userToRestrictTo, cb) {
  return getDataForUser(connections, "apps", userToRestrictTo, cb);
}

function getThemesForUser(connections, userToRestrictTo, cb) {
  return getDataForUser(connections, "themes", userToRestrictTo, cb);
}

function getDataForUser(connections, data, userToRestrictTo, cb) {
  if(!userToRestrictTo) {
    return cb(undefined, null);   // return no restrictions
  }

  var conn = connections.mongooseConnection;
  var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
  var query = {users: userToRestrictTo};
  groupsModel.find(query).select(data).exec(function (err, dataList) {
    if (err) return cb(err);
    // we'll have an array of {_id:XXX, data: [] } at this point
    async.map(dataList, function (item, cb) {
      return cb(undefined, item[data]);    // extract the data array (data is one of: users, apps, themes, forms)
    }, function (err, results) {
      if (err) return cb(err);
      var forms = _.flatten(results);      // flatten it.
      async.map(forms, function(form, cb) {
        return cb(undefined, form.toString());
      }, function (err, stringifiedFormIds) {
        if (err) return cb(err);
        return cb(null, stringifiedFormIds);
      });
    });
  });
}

function validateAppAllowedForUser(connections, restrictToUser, appId, cb) {
  return validateDataAllowedForUser(connections, "apps", restrictToUser, appId, cb);
}

function validateFormAllowedForUser(connections, restrictToUser, formId, cb) {
  return validateDataAllowedForUser(connections, "forms", restrictToUser, formId, cb);
}

function validateThemeAllowedForUser(connections, restrictToUser, themeId, cb) {
  return validateDataAllowedForUser(connections, "themes", restrictToUser, themeId, cb);
}

function validateDataAllowedForUser(connections, data, restrictToUser, valueToCheck, cb) {
  if(!restrictToUser) {
    return cb();   // return valid - no restrictions
  }

  var conn = connections.mongooseConnection;
  var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
  var query = {users: restrictToUser};
  query[data] = valueToCheck;
  groupsModel.find(query).select("name").exec(function (err, dataList) {
    if (err) return cb(err);
    // we'll have an array of {_id:XXX, name: "AAAA" } at this point if valid
    if (dataList && dataList.length > 0) {
      return cb(); // return valid - found user and valueToCheck in a group
    } else {
      return cb(new Error("Not allowed access due to group permissions"));
    }
  });
}

/*
 * getAllGroups(connections, options, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    cb  - callback function (err)
 *
 */

function getAllGroups(connections, options, cb) {
  var conn = connections.mongooseConnection;
  var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
  groupsModel.find().exec(function (err, groupsList) {
    if (err) return cb(err);
    return cb(null, groupsList || []); // Note: purposely returning empty array here for now, maybe this should be null instead?
  });
}

/*
 * updateGroup(connections, options, group, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    group: {
 *      _id: id of the group
 *      name: string
 *      users: ['userid1', 'userid2', ...]
 *      forms: ['formid1', 'formid2', ...]
 *      apps: ['appid1', 'appid2', ...]
 *      themes: ['themeid1', 'themeid2', ...]
 *    }
 *
 *    cb  - callback function (err)
 *
 */
function updateGroup(connections, options, groupParams, cb) {
  var validate = validation(groupParams);
  function validateParams(cb) {
    validate.has("_id", "name", "users", "forms", "apps", "themes", cb);
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);

    groupsModel.findOne({_id:groupParams._id}).exec(function (err, group) {
      if (err) return cb(err);
      if (!group) {
        return cb(new Error('group not found'));
      } else {
        group.name = groupParams.name;
        group.users = groupParams.users;
        group.forms = groupParams.forms;
        group.apps = groupParams.apps;
        group.themes = groupParams.themes;
        group.save(function (err, group) {
          if (err) return cb(err);
          return cb(undefined, group.toJSON());
        });
      }
    });
  });
}

/*
 * createGroup(connections, options, group, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    group: {
 *      name: string
 *      users: ['userid1', 'userid2', ...]
 *      forms: ['formid1', 'formid2', ...]
 *      apps: ['appid1', 'appid2', ...]
 *      themes: ['themeid1', 'themeid2', ...]
 *    }
 *
 *    cb  - callback function (err)
 *
 */
function createGroup(connections, options, groupParams, cb) {
  var validate = validation(groupParams);
  function validateParams(cb) {
    validate.has("name", "users", "forms", "apps", "themes", function (err) {
      if (err) return cb(err);
      validate.hasno("_id", cb);
    });
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
    var newGroup = new groupsModel(groupParams);
    newGroup.save(function (err, group) {
      if (err) return cb(err);
      return cb(undefined, group.toJSON());
    });
  });
}

/*
 * getGroup(connections, options, groupParams, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    groupParams: {
 *      _id: id of the group
 *    }
 *
 *    cb  - callback function (err)
 *
 */
function getGroup(connections, options, groupParams, cb) {
  var validate = validation(groupParams);
  function validateParams(cb) {
    validate.has("_id", cb);
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
    groupsModel.findById(groupParams._id, cb);
  });
}

/*
 * deleteGroup(connections, options, group, cb)
 *
 *    connections: {
 *       mongooseConnection: ...
 *    }
 *
 *    options: {
 *       uri:       db connection string,
 *       userEmail: user email address string
 *    }
 *
 *    group: {
 *      _id: id of the group
 *    }
 *
 *    cb  - callback function (err)
 *
 */
function deleteGroup(connections, options, groupParams, cb) {
  var validate = validation(groupParams);
  function validateParams(cb) {
    validate.has("_id", cb);
  }
  validateParams(function(err) {
    if (err) return cb(err);
    var conn = connections.mongooseConnection;
    var groupsModel = models.get(conn, models.MODELNAMES.GROUPS);
    groupsModel.findById(groupParams._id).remove(cb);
  });
}
