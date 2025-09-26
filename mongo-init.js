// MongoDB initialization script for official MongoDB container
db = db.getSiblingDB('okteto');

// Create the user with read/write access to the okteto database
db.createUser({
  user: 'okteto',
  pwd: 'mongodb123',
  roles: [
    {
      role: 'readWrite',
      db: 'okteto'
    }
  ]
});

console.log('MongoDB user created successfully');