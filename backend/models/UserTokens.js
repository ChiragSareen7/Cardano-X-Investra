const mongoose = require('mongoose');

const userTokensSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['learner', 'influencer', 'dao_member'],
    required: true
  },
  totalTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  availableTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  lockedTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  // Token categories for different purposes
  tokenCategories: {
    viewing: { type: Number, default: 0 }, // For viewing predictions
    voting: { type: Number, default: 0 },  // For DAO voting power
    creation: { type: Number, default: 0 }, // For creating predictions
    bonus: { type: Number, default: 0 }    // Bonus tokens from achievements
  },
  // User level and reputation based on tokens
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  reputation: {
    type: Number,
    default: 0,
    min: 0
  },
  // Achievement badges
  badges: [{
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now },
    tokenReward: Number
  }],
  // Transaction history reference
  lastTransactionDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries (walletAddress already indexed via unique: true)
userTokensSchema.index({ userType: 1 });
userTokensSchema.index({ totalTokens: -1 });
userTokensSchema.index({ level: -1 });

// Pre-save middleware to update timestamps
userTokensSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('UserTokens', userTokensSchema);
