require('dotenv').config();
const mongoose = require('mongoose');

// Try connecting to 'test' database instead of 'stockchecker'
const connectionString = 'mongodb+srv://db_user:gNjFhwDKCnmN8WMM@stockchecker.wvw6uy7.mongodb.net/test?retryWrites=true&w=majority';

console.log('Testing connection to "test" database...');
console.log('Connection string (masked):', connectionString.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ Connection successful to test database!');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  
  // Try to list collections
  return mongoose.connection.db.admin().listDatabases();
})
.then((databases) => {
  console.log('Available databases:');
  databases.databases.forEach(db => {
    console.log('  -', db.name);
  });
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  
  if (error.cause) {
    console.error('Underlying cause:', error.cause);
  }
  
  process.exit(1);
});

setTimeout(() => {
  console.error('❌ Connection timeout after 10 seconds');
  process.exit(1);
}, 10000);