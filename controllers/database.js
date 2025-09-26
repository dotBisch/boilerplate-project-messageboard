const mongoose = require('mongoose');

// Connect to MongoDB
const connectionString = process.env.DB || 'mongodb://localhost:27017/messageboard';

mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});

// Reply schema
const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false }
});

// Thread schema
const threadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false },
  replies: [replySchema]
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = { Thread };