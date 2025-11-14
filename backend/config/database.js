const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not set - skipping MongoDB connection');
    console.log('💡 Tip: Set MONGODB_URI in .env file for data persistence');
    console.log('💡 Server will continue without MongoDB (DAO functionality will work)');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Tip: Make sure MongoDB is running locally or check your MONGODB_URI');
    console.log('💡 For local development: brew install mongodb-community && brew services start mongodb-community');
    // Don't exit process, just log the error so the server can still run for DAO functionality
    console.log('⚠️  Server will continue without MongoDB (DAO functionality will work)');
  }
};

module.exports = connectDB;
