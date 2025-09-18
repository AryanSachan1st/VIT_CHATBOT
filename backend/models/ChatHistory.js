const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  sources: [{
    title: String,
    url: String,
    excerpt: String,
    sourceType: {
      type: String,
      enum: ['blog', 'web'],
      required: true
    }
  }],
  rawModelOutput: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
chatHistorySchema.index({ userId: 1, sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
