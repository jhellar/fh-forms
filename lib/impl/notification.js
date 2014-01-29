var amqpService = require('./amqpservice.js');
var amqp;
var amqpManager = amqpService();

exports.initNotifications = function (cb) {
  if(amqp) return cb();
  amqpManager.startUp(function (err, pamqp) {
    if(err) return cb(err);
    amqp = pamqp;
    return cb();
  });
};

var FH_EVENT_SUBMISSION_RECEIVED = "fh.appforms.submissions.submission-received";

exports.sendNotification = function sendNotification(connections, completeStatus, cb) {
  console.log('sending notification for submission: ', completeStatus);
  var options = {_id: completeStatus.formSubmission.formId};

  require('./getNotifications.js')(connections, options, function (err, subscribers) {
    if (err) return cb(err);

    if(subscribers && subscribers.subscribers && subscribers.subscribers.length > 0) {
      var addresses = subscribers.subscribers.join(',');
      console.log('sending notifications to: ', addresses);

      var msg = buildSubmissionReceivedMessage(addresses, completeStatus.formSubmission);

  console.log("AMQPMANAGER:", amqpManager, ", AMQP: ", amqp);
      amqp.publishMessage(FH_EVENT_SUBMISSION_RECEIVED, msg);
    }

    return cb();
  });
};

function buildSubmissionReceivedMessage(subscribers, formSubmission) {
  var msg = {};
  msg.subscribers = subscribers;
  msg.formId = formSubmission.formId;
  msg.appId = formSubmission.appId;
  msg.formName = "UNKNOWN FORM NAME";
  msg.appName = "UNKNOWN APP NAME";
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

function getStringValue(valueObj, type) {
  // TODO if photo/file/sig return URL
  // TOTO if checkbox return selections
  return valueObj.toString();
}