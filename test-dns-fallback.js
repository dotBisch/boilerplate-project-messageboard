require('dotenv').config();
const { MongoClient } = require('mongodb');

// Try using a different DNS resolver approach
const connectionString = 'mongodb+srv://db_user:G8ijHCO6J9MRsVCI@cluster0.yie1irr.mongodb.net/messageboard?retryWrites=true&w=majority&dns=google';

console.log('Testing MongoDB connection with DNS fallback...');
console.log('Connection string (masked):', connectionString.replace(/:([^:@]+)@/, ':****@'));

const client = new MongoClient(connectionString, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 15000,
  family: 4, // Force IPv4
});

async function testConnection() {
  try {
    console.log('Attempting to connect with DNS fallback...');
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
    console.error('❌ Connection failed with DNS fallback:');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Try without SRV (direct connection)
    console.log('\n🔄 Trying without SRV...');
    tryDirectConnection();
  }
}

async function tryDirectConnection() {
  // Try direct connection without SRV
  const directConnectionString = 'mongodb://db_user:G8ijHCO6J9MRsVCI@cluster0-shard-00-00.yie1irr.mongodb.net:27017,cluster0-shard-00-01.yie1irr.mongodb.net:27017,cluster0-shard-00-02.yie1irr.mongodb.net:27017/messageboard?ssl=true&replicaSet=atlas-default-0&authSource=admin&retryWrites=true&w=majority';
  
  const directClient = new MongoClient(directConnectionString, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
  });
  
  try {
    await directClient.connect();
    console.log('✅ Direct connection successful!');
    await directClient.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Direct connection also failed:');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();