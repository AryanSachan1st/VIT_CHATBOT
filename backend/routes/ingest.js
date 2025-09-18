const express = require('express');
const { ingestBlogs } = require('../services/ingestion');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Ingest blogs route (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    // Ingest blogs
    const result = await ingestBlogs();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Ingestion error:', error);
    res.status(500).json({ 
      message: 'Failed to ingest blogs',
      error: error.message 
    });
  }
});

module.exports = router;
