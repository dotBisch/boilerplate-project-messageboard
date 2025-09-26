require('dotenv').config();

const originalPassword = 'kHueHprVQRvY0Mtz';
const encodedPassword = encodeURIComponent(originalPassword);

console.log('Original password:', originalPassword);
console.log('URL encoded password:', encodedPassword);
console.log('Are they different?', originalPassword !== encodedPassword);

// Test connection strings
const originalConnectionString = `mongodb+srv://db_user:${originalPassword}@stockchecker.wvw6uy7.mongodb.net/stockchecker?retryWrites=true&w=majority`;
const encodedConnectionString = `mongodb+srv://db_user:${encodedPassword}@stockchecker.wvw6uy7.mongodb.net/stockchecker?retryWrites=true&w=majority`;

console.log('\nOriginal connection string:');
console.log(originalConnectionString);
console.log('\nEncoded connection string:');
console.log(encodedConnectionString);
console.log('\nAre they different?', originalConnectionString !== encodedConnectionString);