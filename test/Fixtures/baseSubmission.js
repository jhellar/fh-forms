

module.exports = function getBaseSubmission() {
  return {
    "appId": "appId123456",
    "appCloudName": "appCloudName123456",
    "appEnvironment": "devLive",
    "userId": "user123456",
    "deviceId": "device123456",
    "deviceIPAddress": "192.168.1.1",
    "deviceFormTimestamp": new Date(Date.now()).toUTCString(),
    "comments": [{
      "madeBy": "somePerson@example.com",
      "madeOn": new Date(Date.now()).toUTCString(),
      "value": "This is a comment"
    },{
      "madeBy": "somePerson@example.com",
      "madeOn": new Date(Date.now()).toUTCString(),
      "value": "This is another comment"
    }]
  };
};