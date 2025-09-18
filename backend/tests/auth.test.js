const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Auth Routes', () => {
  let testUser;
  
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vit-chatbot-test');
  });

  afterAll(async () => {
    // Clean up test user and close database connection
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
    await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should signup a new user with valid college email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@vit.ac.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      
      // Save user for cleanup
      testUser = response.body.user;
    });

    it('should not signup a user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('VIT-Chennai college email address');
    });

    it('should not signup a user with missing fields', async () => {
      const userData = {
        email: 'test@vit.ac.in'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('Internal server error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // Skip if no test user was created
      if (!testUser) {
        return;
      }

      const loginData = {
        email: testUser.email,
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@vit.ac.in',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with invalid email', async () => {
      const loginData = {
        email: 'test@gmail.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain('VIT-Chennai college email address');
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should verify a valid token', async () => {
      // Skip if no test user was created
      if (!testUser) {
        return;
      }

      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${testUser.token}`)
        .expect(200);

      expect(response.body.message).toBe('Token verified successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not verify an invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should not verify without token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
    });
  });
});
