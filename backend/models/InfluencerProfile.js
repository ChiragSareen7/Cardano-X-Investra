const mongoose = require('mongoose');

const influencerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  expertise: {
    type: [String],
    default: []
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String,
    telegram: String
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified'],
    default: 'unverified'
  },
  reputation: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalPredictions: {
    type: Number,
    default: 0
  },
  successfulPredictions: {
    type: Number,
    default: 0
  },
  followers: {
    type: Number,
    default: 0
  },
  // Track prediction performance
  predictionStats: {
    totalCreated: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    totalVoted: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    lastPredictionDate: Date
  },
  // AI validation scores
  aiValidationScores: {
    averageScore: { type: Number, default: 0 },
    totalValidations: { type: Number, default: 0 },
    lastValidationDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries (walletAddress already indexed via unique: true)
influencerProfileSchema.index({ verificationStatus: 1 });
influencerProfileSchema.index({ reputation: -1 });

module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);
