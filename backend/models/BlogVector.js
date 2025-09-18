const mongoose = require('mongoose');

const blogVectorSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  chunkText: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  metadata: {
    title: String,
    authorName: String,
    sourceUrl: String,
    chunkIndex: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
});

// Create index for vector search
// This will be handled through MongoDB Atlas UI or separate index creation script
// The schema field definition is correct for vector search

module.exports = mongoose.model('BlogVector', blogVectorSchema);
