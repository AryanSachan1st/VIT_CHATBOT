const express = require('express');
const { generateAnswer } = require('../services/chat');
const User = require('../models/User');

const router = express.Router();

// Chat query route
router.post('/query', async (req, res) => {
  try {
    const { query, userId, sessionId } = req.body;
    
    // Validate input
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate answer using RAG pipeline
    const result = await generateAnswer(query, userId, sessionId || 'default');
    
    res.json(result);
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json({ 
      message: 'Failed to process query',
      error: error.message 
    });
  }
});

module.exports = router;
