module.exports = {
  postProcessing: {
    name: "Test Post Processing Data Target",
    description: "Testing Post Processing Data Target",
    createdBy: "someuser@example.com",
    updatedBy: "someotheruser@example.com",
    serviceGuid: "service12345",
    type: "postProcessing",
    endpoints: {
      postProcessing: "/uri/to/call/after/submission"
    }
  },
  realTime: {
    name: "Test Real Time Data Target",
    description: "Testing Real Time Data Target",
    createdBy: "someuser@example.com",
    updatedBy: "someotheruser@example.com",
    serviceGuid: "service12345",
    type: "realTime",
    endpoints: {
      realTimeData: "/uri/to/call/form/submissionJSON",
      realTimeFile: "/uri/to/call/form/file"
    }
  }
};
