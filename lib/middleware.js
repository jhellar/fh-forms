module.exports = {
  forms: require('./middleware/forms.js'),
  themes: require('./middleware/themes.js'),
  dataSources: require('./middleware/dataSources.js'),
  dataTargets: require('./middleware/dataTargets.js'),
  formProjects: require('./middleware/formProjects.js'),
  submissions: require('./middleware/submissions.js'),
  parseMongoConnectionOptions: require('./middleware/parseMongoConnectionOptions.js')
};