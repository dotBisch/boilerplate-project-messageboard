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
  delete_password: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false }
});

// Thread schema
const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  replies: [replySchema]
});

// Board schema
const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  threads: [threadSchema]
});

const Reply = mongoose.model('Reply', replySchema);
const Thread = mongoose.model('Thread', threadSchema);
const Board = mongoose.model('Board', boardSchema);

module.exports = { Reply, Thread, Board };