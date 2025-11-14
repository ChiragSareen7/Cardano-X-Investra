use aiken/bytearray
use aiken/test
use aiken/transaction

use inverstra/prediction_dao/validators/prediction_dao

pub fn tests() -> List<test::Test> {
  test.group "PredictionDAO helpers" [
    test.assert "is_member returns True when address in list" (
      prediction_dao::is_member(bytearray.from_string("alice"), [bytearray.from_string("alice")])
    ),
    test.assert "has_voted detects voter" (
      prediction_dao::has_voted(bytearray.from_string("bob"), [bytearray.from_string("bob")])
    ),
    test.assert "within_voting_window with Always range" (
      prediction_dao::within_voting_window(100, transaction::Transaction {
        inputs: [],
        outputs: [],
        fee: 0,
        mint: [],
        certificates: [],
        withdrawals: [],
        valid_range: transaction::Always,
        extra: transaction::Extra {
          signatories: [],
          redeemers: [],
          datums: []
        }
      })
    )
  ]
}
