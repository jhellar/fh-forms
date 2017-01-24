var getSubmission = require('./getSubmission');
var notifications = require('./notification');

/**
 *
 *
 * Function to get a single submission in email format.
 *
 *
 * Used to be able to send email notifications when submissions have completed.
 *
 *
 * @param connections
 * @param options
 * @param params
 * @param cb
 */
module.exports = function getSubmissionEmailData(connections, options, params, cb) {

  //Getting the full submission definition.
  getSubmission(connections, options, params, function(err, fullSubmission) {
    if (err) {
      return cb(err);
    }

    //Building the data required for the email
    notifications.buildNotificationParams(connections, {
      formSubmission: fullSubmission
    }, function(err, notificationMessage) {
      return cb(err, {
        formSubmission: fullSubmission,
        notificationMessage: notificationMessage
      });
    });
  });
};