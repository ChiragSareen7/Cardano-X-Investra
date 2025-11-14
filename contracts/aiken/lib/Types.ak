// Shared data structures and guard rails for the PredictionDAO Aiken project.

use aiken/list

pub type Address = ByteArray

pub type DaoConfig = {
  voting_threshold: Int,      // percentage 0-100
  min_voting_period: Int,     // seconds
  max_voting_period: Int      // seconds
}

pub type Prediction = {
  id: Int,
  creator: Address,
  title: ByteArray,
  description: ByteArray,
  category: ByteArray,
  created_at: Int,
  end_time: Int,
  yes_votes: Int,
  no_votes: Int,
  total_votes: Int,
  approved: Bool,
  is_active: Bool,
  voters: List<Address>,
  members: List<Address>,
  config: DaoConfig
}

pub type DaoState = {
  next_prediction_id: Int,
  predictions: List<Prediction>,
  members: List<Address>,
  config: DaoConfig
}

pub type Vote = {
  voter: Address,
  support: Bool,
  timestamp: Int
}

pub fn default_config() -> DaoConfig {
  DaoConfig {
    voting_threshold: 70,
    min_voting_period: 86400,   // 1 day
    max_voting_period: 604800   // 7 days
  }
}

pub fn default_state(members: List<Address>) -> DaoState {
  DaoState {
    next_prediction_id: 1,
    predictions: [],
    members,
    config: default_config()
  }
}

pub fn is_member(address: Address, members: List<Address>) -> Bool {
  list.any(members, fn(member) { member == address })
}

pub fn has_voted(address: Address, voters: List<Address>) -> Bool {
  list.any(voters, fn(voter) { voter == address })
}

pub fn within_voting_period(current_time: Int, prediction: Prediction) -> Bool {
  current_time >= prediction.created_at && current_time <= prediction.end_time && prediction.is_active
}

pub fn approval_threshold_met(prediction: Prediction) -> Bool {
  if prediction.total_votes == 0 {
    False
  } else {
    (prediction.yes_votes * 100) >= (prediction.total_votes * prediction.config.voting_threshold)
  }
}

pub fn voting_period_within_bounds(period: Int, config: DaoConfig) -> Bool {
  period >= config.min_voting_period && period <= config.max_voting_period
}
