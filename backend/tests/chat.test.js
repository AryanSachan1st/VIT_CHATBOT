const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Chat Routes', () => {
  let testUser;
  let testToken;
  
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vit-chatbot-test');
    
    // Create a test user
    testUser = new User({
      email: 'chat-test@vit.ac.in',
      passwordHash: 'password123',
      name: 'Chat Test User'
    });
    
    await testUser.save();
    
    // Generate a test token
    testToken = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    // Clean up test user and close database connection
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
    await mongoose.connection.close();
  });

  describe('POST /api/chat/query', () => {
    it('should process a chat query with valid token', async () => {
      const queryData = {
        query: 'What is VIT Chennai?',
        userId: testUser._id.toString(),
        sessionId: 'test-session'
      };

      const response = await request(app)
        .post('/api/chat/query')
        .set('Authorization', `Bearer ${testToken}`)
        .send(queryData)
        .expect(200);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('sources');
    });

    it('should not process a chat query without token', async () => {
      const queryData = {
        query: 'What is VIT Chennai?',
        userId: testUser._id.toString(),
        sessionId: 'test-session'
      };

      const response = await request(app)
        .post('/api/chat/query')
        .send(queryData)
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
    });

    it('should not process a chat query with invalid token', async () => {
      const queryData = {
        query: 'What is VIT Chennai?',
        userId: testUser._id.toString(),
        sessionId: 'test-session'
      };

      const response = await request(app)
        .post('/api/chat/query')
        .set('Authorization', 'Bearer invalidtoken')
        .send(queryData)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should not process a chat query without query text', async () => {
      const queryData = {
        userId: testUser._id.toString(),
        sessionId: 'test-session'
      };

      const response = await request(app)
        .post('/api/chat/query')
        .set('Authorization', `Bearer ${testToken}`)
        .send(queryData)
        .expect(400);

      expect(response.body.message).toBe('Query is required');
    });

    it('should not process a chat query without userId', async () => {
      const queryData = {
        query: 'What is VIT Chennai?',
        sessionId: 'test-session'
      };

      const response = await request(app)
        .post('/api/chat/query')
        .set('Authorization', `Bearer ${testToken}`)
        .send(queryData)
        .expect(400);

      expect(response.body.message).toBe('User ID is required');
    });
  });
});
