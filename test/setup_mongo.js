// Adds 'admin' user to a default test Mongo database
// for running acceptance tests if no admin user is found

// The check is very basic and can be misleading 
// if other admin users exist 

db = connect("localhost:27020");
db = db.getSiblingDB('admin');

var adminUsers = db.system.users.find({user: 'admin'});

if (adminUsers.length() > 0) {
    print('Admin user already exists.');
    print('[If there is a problem with running accept. tests, check that the ' +
          'existing admin user is the correct one]');
} else {
    print('Creating admin user in MongoDb...');
    db.addUser({
        user: "admin",
        pwd: "admin",
        roles: ["userAdminAnyDatabase"]
    });
}