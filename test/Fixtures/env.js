var testConfig = {
  "dbUser":     "appformsuser", 
  "dbPassword": "appformspass", 
  "dbAddress" : "localhost", 
  "dbPort":     27017, 
  "dbForTests": "testAppFormsDb"
};

process.env.FH_DOMAIN_DB_CONN_URL = "mongodb://testing:jOhIjy9VtcQqX@10.0.2.15:27017/testing";

module.exports = testConfig;