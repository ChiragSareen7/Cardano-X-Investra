const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voter: {
    type: String,
    required: true
  },
  support: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const daopredictionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  creator: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  yesVotes: {
    type: Number,
    default: 0
  },
  noVotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  votes: [voteSchema],
  // Track if this was synced from contract
  contractSynced: {
    type: Boolean,
    default: false
  },
  // Contract prediction ID for reference
  contractPredictionId: {
    type: String,
    default: null
  },
  cardanoDebug: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Index for efficient queries (id already indexed via unique: true)
daopredictionSchema.index({ isActive: 1, endTime: 1 });
daopredictionSchema.index({ isApproved: 1 });
daopredictionSchema.index({ creator: 1 });

module.exports = mongoose.model('DAOPrediction', daopredictionSchema);
