const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');

// Load environment variables
dotenv.config();

// Initialize passport
require('./config/passport');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize passport middleware
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Basic route for health check
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VIT-Chennai Chatbot API is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Blog routes
const blogRoutes = require('./routes/blogs');
app.use('/api/blogs', blogRoutes);

// Chat routes
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Ingestion routes
const ingestRoutes = require('./routes/ingest');
app.use('/api/ingest', ingestRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
