require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Atlas connection...');
console.log('DB environment variable:', process.env.DB ? 'Set' : 'Not set');

const connectionString = process.env.DB;
if (!connectionString) {
  console.error('No DB connection string found in environment variables');
  process.exit(1);
}

console.log('Connection string (masked):', connectionString.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 10000, // 10 second timeout
})
.then(() => {
  console.log('✅ Connection successful!');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  if (error.reason) {
    console.error('Error reason:', error.reason);
  }
  process.exit(1);
});

// Timeout after 15 seconds
setTimeout(() => {
  console.error('❌ Connection timeout after 15 seconds');
  process.exit(1);
}, 15000);