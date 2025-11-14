const mongoose = require('mongoose');

const tokenTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  transactionType: {
    type: String,
    enum: [
      'initial_bonus',      // Initial tokens for new users
      'prediction_view',    // Spending tokens to view prediction
      'prediction_create',  // Spending tokens to create prediction
      'dao_vote',          // Spending tokens to vote
      'prediction_approval', // Earning tokens for approved prediction
      'achievement_bonus',  // Bonus tokens for achievements
      'referral_bonus',     // Referral rewards
      'daily_bonus',       // Daily login bonus
      'level_up_bonus',    // Level up rewards
      'refund'             // Token refunds
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  // Related entities
  relatedEntity: {
    type: {
      type: String,
      enum: ['prediction', 'vote', 'achievement', 'referral', 'level_up']
    },
    id: String,
    title: String
  },
  // Transaction metadata
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries (transactionId already indexed via unique: true)
tokenTransactionSchema.index({ walletAddress: 1, createdAt: -1 });
tokenTransactionSchema.index({ transactionType: 1 });
tokenTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TokenTransaction', tokenTransactionSchema);
