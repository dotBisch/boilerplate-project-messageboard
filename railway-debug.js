require('dotenv').config();
const mongoose = require('mongoose');

console.log('🚄 Railway Database Connection Debug');
console.log('====================================');

// Check environment variables
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT || 'Not set (will use 3000)');
console.log('- DB:', process.env.DB ? 'Set ✅' : 'NOT SET ❌');

if (process.env.DB) {
  const dbUrl = process.env.DB;
  // Mask password for security
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('- DB URL (masked):', maskedUrl);
  
  // Check if it's MongoDB Atlas
  if (dbUrl.includes('mongodb+srv://')) {
    console.log('- Connection type: MongoDB Atlas ✅');
  } else if (dbUrl.includes('mongodb://')) {
    console.log('- Connection type: MongoDB (non-Atlas)');
  } else {
    console.log('- Connection type: Invalid format ❌');
  }
}

console.log('\n🔌 Testing Database Connection...');

const connectionString = process.env.DB || 'mongodb://localhost:27017/messageboard';

mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Database connection successful!');
  console.log('- Database name:', mongoose.connection.db.databaseName);
  console.log('- Host:', mongoose.connection.host);
  console.log('- Port:', mongoose.connection.port);
  
  // Test a simple database operation
  return mongoose.connection.db.admin().listDatabases();
})
.then((result) => {
  console.log('\n📊 Available databases:');
  result.databases.forEach(db => {
    console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)}MB)`);
  });
  
  console.log('\n🎉 Database connection fully verified for Railway!');
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ Database connection failed:');
  console.error('- Error name:', error.name);
  console.error('- Error message:', error.message);
  
  if (error.code) {
    console.error('- Error code:', error.code);
  }
  
  if (error.cause) {
    console.error('- Cause:', error.cause.message || error.cause);
  }
  
  // Railway-specific troubleshooting
  console.log('\n🔧 Railway Troubleshooting:');
  console.log('1. Make sure DB environment variable is set in Railway dashboard');
  console.log('2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for Railway)');
  console.log('3. Verify MongoDB Atlas user credentials');
  console.log('4. Ensure Railway has internet access to MongoDB Atlas');
  
  process.exit(1);
});

// Add timeout for Railway deployment debugging
setTimeout(() => {
  console.error('\n⏰ Connection timeout after 15 seconds');
  console.log('This might indicate:');
  console.log('- Network connectivity issues in Railway');
  console.log('- MongoDB Atlas IP whitelist blocking Railway servers');
  console.log('- DNS resolution problems');
  process.exit(1);
}, 15000);