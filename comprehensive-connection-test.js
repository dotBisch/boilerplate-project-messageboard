require('dotenv').config();
const { MongoClient } = require('mongodb');

// Test with the exact format from Atlas
const username = 'db_user';
const password = 'gNjFhwDKCnmN8WMM';
const cluster = 'stockchecker.wvw6uy7.mongodb.net';

// Try different connection string formats
const connectionStrings = [
  // Original format
  `mongodb+srv://${username}:${password}@${cluster}/stockchecker?retryWrites=true&w=majority`,
  
  // Without database name
  `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`,
  
  // With test database
  `mongodb+srv://${username}:${password}@${cluster}/test?retryWrites=true&w=majority`,
  
  // URL encoded password (just in case)
  `mongodb+srv://${username}:${encodeURIComponent(password)}@${cluster}/?retryWrites=true&w=majority`
];

async function testConnection(connectionString, label) {
  console.log(`\n🔍 Testing: ${label}`);
  console.log(`Connection string (masked): ${connectionString.replace(/:([^:@]+)@/, ':****@')}`);
  
  const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Test database operations
    const admin = client.db().admin();
    const databases = await admin.listDatabases();
    
    console.log('📋 Available databases:');
    databases.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    await client.close();
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed');
    console.log(`   Error: ${error.name}: ${error.message}`);
    
    if (error.cause) {
      console.log(`   Cause: ${error.cause.name}: ${error.cause.message}`);
    }
    
    await client.close();
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing MongoDB Atlas Connection...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], `Format ${i + 1}`);
    if (success) {
      console.log('\n🎉 Found working connection string!');
      process.exit(0);
    }
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n💥 All connection attempts failed');
  console.log('\n🔧 Possible solutions:');
  console.log('1. Verify the cluster URL in Atlas Dashboard');
  console.log('2. Check if the user password is correct');
  console.log('3. Ensure IP is whitelisted and ACTIVE');
  console.log('4. Try connecting from Atlas Dashboard directly');
  
  process.exit(1);
}

runTests();