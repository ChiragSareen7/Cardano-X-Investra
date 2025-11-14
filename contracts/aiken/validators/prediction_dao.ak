/// Prediction DAO Validator
/// Handles prediction creation, voting, and approval on Cardano

use aiken/transaction
use aiken/bytearray
use aiken/list

use inverstra/prediction_dao/lib/Types.{
  Prediction,
  DaoConfig,
  default_config,
  is_member,
  has_voted,
  approval_threshold_met,
  within_voting_period,
  voting_period_within_bounds
}

// PredictionDAO validator on Cardano Preview testnet.

pub type PredictionDatum {
  PredictionState Prediction
}

pub type PredictionRedeemer {
  CreatePrediction {
    prediction_id: Int,
    creator: ByteArray,
    voting_period: Int
  },
  Vote {
    voter: ByteArray,
    support: Bool
  },
  Finalise
}

pub fn tx_signed_by(tx: transaction::Transaction, signer: ByteArray) -> Bool {
  list.any(tx.extra.signatories, fn(sig) { sig == signer })
}

pub fn validator(datum: PredictionDatum, redeemer: PredictionRedeemer, ctx: transaction::ScriptContext) -> Bool {
  let tx = ctx.tx

  when datum is {
    PredictionState(prediction) -> when redeemer is {
      CreatePrediction { prediction_id, creator, voting_period } ->
        validate_create(prediction, prediction_id, creator, voting_period, tx)

      Vote { voter, support } ->
        validate_vote(prediction, voter, support, tx)

      Finalise ->
        validate_finalise(prediction, tx)
    }
  }
}

pub fn validate_create(
  prediction: Prediction,
  redeemer_prediction_id: Int,
  creator: ByteArray,
  voting_period: Int,
  tx: transaction::Transaction
) -> Bool {
  if prediction.id != redeemer_prediction_id {
    trace "Prediction id mismatch" False
  } else if prediction.creator != creator {
    trace "Creator mismatch" False
  } else if !is_member(creator, prediction.members) {
    trace "Creator must be DAO member" False
  } else if !tx_signed_by(tx, creator) {
    trace "Creator signature missing" False
  } else if !prediction.is_active {
    trace "Prediction must start active" False
  } else if prediction.approved {
    trace "New prediction cannot be pre-approved" False
  } else if prediction.total_votes != 0 || prediction.yes_votes != 0 || prediction.no_votes != 0 {
    trace "Initial votes must be zero" False
  } else if !list.is_empty(prediction.voters) {
    trace "Initial voters list must be empty" False
  } else if !voting_period_within_bounds(voting_period, prediction.config) {
    trace "Voting period out of bounds" False
  } else if prediction.end_time <= prediction.created_at {
    trace "End time must be after creation" False
  } else if !within_voting_period(prediction.created_at, prediction) {
    trace "Prediction must start within voting period" False
  } else {
    True
  }
}

pub fn validate_vote(prediction: Prediction, voter: ByteArray, _support: Bool, tx: transaction::Transaction) -> Bool {
  if !prediction.is_active {
    trace "Prediction is not active" False
  } else if !is_member(voter, prediction.members) {
    trace "Voter is not a DAO member" False
  } else if has_voted(voter, prediction.voters) {
    trace "Voter already voted" False
  } else if !tx_signed_by(tx, voter) {
    trace "Voter signature missing" False
  } else if !within_voting_window(prediction.end_time, tx) {
    trace "Voting period ended" False
  } else {
    True
  }
}

pub fn validate_finalise(prediction: Prediction, tx: transaction::Transaction) -> Bool {
  let voting_closed = !within_voting_window(prediction.end_time, tx)
  let threshold_met = approval_threshold_met(prediction)

  if !prediction.is_active {
    trace "Prediction already finalised" False
  } else if voting_closed || threshold_met {
    True
  } else {
    trace "Cannot finalise before deadline or threshold" False
  }
}

pub fn within_voting_window(end_time: Int, tx: transaction::Transaction) -> Bool {
  when tx.valid_range is {
    transaction::Always -> True,
    transaction::Finite(range) ->
      when range.upper_bound is {
        transaction::Bound::Always -> True,
        transaction::Bound::Finite { value, inclusive } ->
          if inclusive { value <= end_time } else { value < end_time }
      }
  }
}

// ---- Pure helpers for property tests ----

pub fn can_vote(prediction: Prediction, voter: ByteArray, current_time: Int) -> Bool {
  if !prediction.is_active {
    False
  } else if !is_member(voter, prediction.members) {
    False
  } else if has_voted(voter, prediction.voters) {
    False
  } else if !within_voting_period(current_time, prediction) {
    False
  } else {
    True
  }
}

pub fn can_finalise(prediction: Prediction, current_time: Int) -> Bool {
  if !prediction.is_active {
    False
  } else if current_time > prediction.end_time {
    True
  } else {
    approval_threshold_met(prediction)
  }
}

