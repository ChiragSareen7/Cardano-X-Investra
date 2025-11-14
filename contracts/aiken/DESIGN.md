# PredictionDAO Aiken Design

This document maps the existing Solidity DAO behaviour to a Cardano UTXO-based implementation using Aiken.

## High-Level Approach

We model the DAO as a **state machine** where each prediction is represented by a reference UTXO locked by the `prediction_dao` validator. The datum captures prediction state; redeemers represent actions: create, vote, finalise.

### On-Chain Data (Datum)

```
type PredictionDatum = Prediction {
  prediction_id: Int,
  creator: Address,
  title: ByteArray,
  description: ByteArray,
  category: ByteArray,
  end_time: Int,
  yes_votes: Int,
  no_votes: Int,
  total_votes: Int,
  approved: Bool,
  members: List<Address>
}
```

Additional data for DAO configuration (constants) will be carried either in the datum or via `InlineDatum` on a reference UTXO. For now we embed configuration in the datum (same as Solidity constants).

### Actions (Redeemers)

```
type PredictionRedeemer
  = CreatePrediction {
      prediction_id: Int,
      creator: Address,
      voting_period: Int
    }
  | Vote {
      voter: Address,
      support: Bool
    }
  | Finalise
```

Validation rules per action:

1. **CreatePrediction**
   - Must be called by a DAO member (creator in `redeemer.creator` is in `members` list).
   - Voting period within `min_voting_period`/`max_voting_period`.
   - UTXO must be created with datum initialised (0 votes, `approved = False`).

2. **Vote**
   - Must be called by DAO member (`redeemer.voter` in members list).
  - Voter cannot have voted before (enforced via tracking set, or separate vote UTXO).
   - Current time < `end_time`.
   - UTXO output updates votes counts accordingly.

3. **Finalise**
   - Allowed after `end_time` or once threshold reached.
   - Marks `approved = True` if `yes_votes * 100 >= total_votes * threshold`.
   - Optionally closes UTXO or leaves inert state.

### Voting Record Strategy

Because Plutus validators cannot store large sets easily, we store vote hashes in the datum as a `List<Address> voted`. For scalability we may add separate UTXOs later.

### Transaction Constraints

- Use `tx.signatories` to enforce actor membership.
- Use `tx.time_range` to check deadlines.
- Ensure exactly one output continuing prediction state in Vote/Finalise transitions.

## Milestones

1. **Types**: Expand `Types.ak` with configuration and helper functions.
2. **Validator**: Implement `validator` with pattern matching on redeemers.
3. **Tests**: Use Aiken property tests to simulate transitions.
4. **Artifacts**: Build to produce `.plutus` + schema for backend.

## Off-Chain Integration

- Backend service (Node) will build transactions using Lucid/JS.
- Reference scripts and datum are consumed from `plutus.json`.
- Preview network magic `2` is used for signing/submission.

---

This design will evolve as we implement the validator; update it as we refine constraints or add features (member management, DAO config, etc.).
