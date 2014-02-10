var amqpService = require('./amqpservice.js');
var amqp;
var amqpManager;

exports.initNotifications = function (cb) {
  if(amqp) return cb();
  if(!amqpManager) {
    amqpManager = amqpService();
  }
  amqpManager.startUp(function (err, pamqp) {
    if(err) return cb(err);
    amqp = pamqp;
    return cb();
  });
};

exports.disconnect = function (cb) {
  if(amqp) {
    amqp.disconnect();
  }
  return cb();
};

var FH_EVENT_SUBMISSION_RECEIVED = "fh.appforms.submissions.submission-received";

exports.sendNotification = function sendNotification(connections, completeStatus, cb) {
  var options = {_id: completeStatus.formSubmission.formId};

  require('./getNotifications.js')(connections, options, function (err, subscribers) {
    if (err) return cb(err);

    if(subscribers && subscribers.subscribers && subscribers.subscribers.length > 0) {
      var addresses = subscribers.subscribers.join(',');
      console.log('sending notifications to: ', addresses);

      var msg = buildSubmissionReceivedMessage(addresses, subscribers.formName, completeStatus.formSubmission);
      amqp.publishMessage(FH_EVENT_SUBMISSION_RECEIVED, msg);
    }

    return cb();
  });
};

exports.buildSubmissionReceivedMessage = buildSubmissionReceivedMessage; // export for tests
function buildSubmissionReceivedMessage(subscribers, formName, formSubmission) {
  var msg = {};
  msg.subscribers = subscribers;
  msg.formId = formSubmission.formId;
  msg.appId = formSubmission.appId;
  msg.attachmentUrl = getAttachmentUrl(formSubmission._id);
  msg.formName = formName || "UNKNOWN FORM NAME";
  msg.submissionStatus = formSubmission.status;
  msg.appEnvironment = formSubmission.appEnvironment;
  msg.submissionStarted = formSubmission.submissionStartedTimestamp;
  msg.submissionCompleted = formSubmission.submissionCompletedTimestamp;
  msg.submissionId = formSubmission._id;
  msg.deviceIPAddress = formSubmission.deviceIPAddress;
  msg.deviceId = formSubmission.deviceId;
  msg.submittedFields = [];

  subFields = formSubmission.formFields;
  for(var i =0; i< subFields.length; i+=1) {
    var subField = "";
    subField = subFields[i].fieldId.name + ": ";
    for (var j=0; j<subFields[i].fieldValues.length; j += 1) {
      if(j!==0) {
        subField += ", ";
      }
      subField += getStringValue(subFields[i].fieldValues[j], subFields[i].type);
    }
    msg.submittedFields.push(subField);
  }
  return msg;
}

function getAttachmentUrl(id) {
  return '<<<host>>>/api/v2/forms/submission/' + id + '.pdf';
}

function getStringValue(valueObj, type) {
  // if photo/file/sig return URL
  if (["photo", "signature", "file"].indexOf(type) >= 0) {
    return "<<<host>>>/api/v2/forms/submission/file/" + valueObj.toString();
  }

  if ("checkboxes" === type) {
    if (valueObj.selections) {
      return "(" + valueObj.selections.join(',') + ")";
    }
    else {
      return "()";
    }
  }

  // TOTO if checkbox return selections
  return valueObj.toString();
}