var testConfig = {"dbUser": "appformsuser", "dbPassword": "appformspass", "dbAddress" : "localhost", "dbPort": 27017, "dbForTests": "testAppFormsDb"};
process.env.FH_DOMAIN_DB_CONN_URL = "mongodb://" + testConfig.dbUser + ":" + testConfig.dbPassword + "@" + testConfig.dbAddress + ":" + testConfig.dbPort + "/" + testConfig.dbForTests;

module.exports = testConfig;