require('dotenv').config();
const { MongoClient } = require('mongodb');

const connectionString = process.env.DB;
console.log('Testing MongoDB connection with new cluster...');
console.log('Connection string (masked):', connectionString.replace(/:([^:@]+)@/, ':****@'));

const client = new MongoClient(connectionString, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
});

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const admin = client.db().admin();
    const result = await admin.listDatabases();
    console.log('Available databases:');
    result.databases.forEach(db => console.log(`  - ${db.name}`));
    
    await client.close();
    console.log('Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    
    process.exit(1);
  }
}

testConnection();