const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://hack-india25-maverick1.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/learners', require('./routes/learnerRoutes'));
app.use('/api/influencers', require('./routes/influencerRoutes'));
app.use('/api/predictions', require('./routes/predictionDataRoutes'));
app.use('/api/dao', require('./routes/daoRoutes'));
app.use('/api/tokens', require('./routes/tokenRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Investra Backend API is running!',
    status: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`⚡ Backend API: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});
