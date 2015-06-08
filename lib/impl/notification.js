var logger = require('../common/logger.js').getLogger();
var _ = require('underscore');

var HOST_PLACEHOLDER = "--#host#--";

/**
 * Build All Of The Params Needed To Send Submission Email Notifications
 * @param connections
 * @param completeStatus
 * @param cb
 */
exports.buildNotificationParams = function sendNotification(connections, completeStatus, cb) {
  var options = {_id: completeStatus.formSubmission.formId};

  require('./getNotifications.js')(connections, options, function (err, subscribers) {
    if (err) return cb(err);

    var msg = {};

    logger.trace('sendNotification() - subscribers: ', subscribers);
    if(subscribers && subscribers.subscribers && subscribers.subscribers.length > 0) {
      var addresses = subscribers.subscribers.join(',');
      msg = buildSubmissionReceivedMessage(addresses, subscribers.formName, completeStatus.formSubmission);
      logger.debug('sending submission notification message to: ' + addresses + ', for submissionid: ' + msg.formId);
      logger.trace('submission notification for submissionid: ' + msg.formId + ', message: ' + JSON.stringify(msg));
    }

    return cb(undefined, msg);
  });
};

exports.buildSubmissionReceivedMessage = buildSubmissionReceivedMessage; // export for tests
function buildSubmissionReceivedMessage(subscribers, formName, formSubmission) {
  var msg = {};
  msg.subscribers = subscribers;
  msg.formId = formSubmission.formId;
  msg.appId = formSubmission.appId;
  msg.attachmentUrl = getAttachmentUrl(formSubmission);
  msg.formName = formName || "UNKNOWN FORM NAME";
  msg.submissionStatus = formSubmission.status;
  msg.appEnvironment = formSubmission.appEnvironment;
  msg.submissionStarted = formSubmission.submissionStartedTimestamp;
  msg.submissionCompleted = formSubmission.submissionCompletedTimestamp;
  msg.submissionId = formSubmission._id;
  msg.deviceIPAddress = formSubmission.deviceIPAddress;
  msg.deviceId = formSubmission.deviceId;
  msg.submittedFields = [];

  var subFields = formSubmission.formFields;
  for(var i =0; i< subFields.length; i+=1) {
    var subField = "";
    subField = subFields[i].fieldId.name + ": ";
    for (var j=0; j<subFields[i].fieldValues.length; j += 1) {
      if(j!==0) {
        subField += ", ";
      }
      subField += getStringValue(subFields[i].fieldValues[j], subFields[i].fieldId.type);
    }
    msg.submittedFields.push(subField);
  }
  return msg;
}

function getAttachmentUrl(formSubmission) {
  return HOST_PLACEHOLDER + '/api/v2/mbaas/' + formSubmission.appEnvironment + '/appforms/submissions/' + formSubmission._id + '/exportpdf';
}

function getStringValue(valueObj, type) {
  // if photo/file/sig return URL
  if (["photo", "signature", "file"].indexOf(type) >= 0) {
    return HOST_PLACEHOLDER + "/api/v2/forms/submission/file/" + valueObj.groupId;
  }

  if ("checkboxes" === type) {
    if (valueObj.selections) {
      return "(" + valueObj.selections.join(',') + ")";
    }
    else {
      return "()";
    }
  }

  if (["location", "locationMap"].indexOf(type) >= 0) {
    if (valueObj.lat) {
      return "(" + valueObj.lat + ',' + valueObj.long + ")";
    } else if (valueObj.zone) {
      return "(" + valueObj.zone + ' ' + valueObj.eastings + ', ' + valueObj.northings + ")";
    }
    else {
      return JSON.stringify(valueObj);
    }
  }

  if ("object" === typeof valueObj) {  // should only be strings left at this point, leaving thsi here to catch newly added field types in the future
      return JSON.stringify(valueObj);
  }

  // TOTO if checkbox return selections
  return valueObj.toString();
}
