use aiken/bytearray
use aiken/list
use test

use inverstra/prediction_dao/lib/Types.{Prediction, default_config}
use inverstra/prediction_dao/validators/prediction_dao.{can_vote, can_finalise}

fn sample_prediction() -> Prediction {
  let config = default_config()
  Prediction {
    id: 1,
    creator: hex"ab",
    title: bytearray.from_string("Title"),
    description: bytearray.from_string("Desc"),
    category: bytearray.from_string("General"),
    created_at: 100,
    end_time: 1000,
    yes_votes: 4,
    no_votes: 1,
    total_votes: 5,
    approved: False,
    is_active: True,
    voters: [hex"cd"],
    members: [hex"ab", hex"cd", hex"ef"],
    config
  }
}

pub fn vote_rejected_if_not_member() {
  let prediction = sample_prediction()
  let result = can_vote(prediction, hex"12", 500)
  expect False result
}

pub fn vote_rejected_if_already_voted() {
  let prediction = sample_prediction()
  let result = can_vote(prediction, hex"cd", 500)
  expect False result
}

pub fn vote_rejected_after_deadline() {
  let prediction = sample_prediction()
  let result = can_vote(prediction, hex"ef", 2000)
  expect False result
}

pub fn vote_allowed_when_valid() {
  let prediction = sample_prediction()
  let result = can_vote(prediction, hex"ef", 500)
  expect True result
}

pub fn finalise_disallowed_before_deadline_without_threshold() {
  let prediction = sample_prediction()
  expect False (can_finalise(prediction, 500))
}

pub fn finalise_allowed_after_deadline() {
  let prediction = sample_prediction()
  expect True (can_finalise(prediction, 2000))
}

pub fn finalise_allowed_when_threshold_met() {
  let prediction = sample_prediction()
  let updated = Prediction { prediction with yes_votes: 7, total_votes: 9 }
  expect True (can_finalise(updated, 500))
}
