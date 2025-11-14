# Aiken Smart Contracts (Cardano Preview Testnet)

This directory contains the Aiken implementation of Inverstra's PredictionDAO smart contracts targeting the **Cardano Preview testnet**.

## Project Structure

```
contracts/aiken/
├── project.toml               # Aiken project configuration
├── plutus.json                # (generated) compiled validators metadata
├── validators/                # On-chain validator modules
│   └── prediction_dao.ak      # Entry validator (draft)
├── lib/                       # Shared on-chain/off-chain data structures
│   └── Types.ak               # Datum/Redeemer definitions (draft)
└── scripts/                   # Helper scripts for build/deploy/testing
```

> **Note**: Files in `validators/` and `lib/` are placeholders until the DAO logic is fully ported from Solidity to Aiken.

## Prerequisites

- [Aiken CLI](https://github.com/aiken-lang/aiken) (install via `cargo`, `brew`, or download binary)
- Cardano node access for Preview network (e.g., [cardano-node docker](https://developers.cardano.org/docs/get-started/running-cardano/) or a hosted Ogmios endpoint)
- `cardano-cli` for transaction submission/testing

Verify Aiken installation:

```bash
aiken --version
```

## Build Validators

```
cd contracts/aiken
aiken build
```

Outputs are placed in `./plutus.json` and `./validators/*.plutus`. These artefacts will be consumed by the backend/frontend.

## Test on Preview Network

```
aiken check
# or run property tests (to be added)
```

## Network Configuration

The project is configured for **Cardano Preview** via `project.toml` (`[test] network = "preview"`).

Preview network constants:

| Parameter            | Value                                  |
|----------------------|----------------------------------------|
| Network Magic        | `2`                                    |
| Faucet               | https://docs.cardano.org/cardano-testnet/tools/faucet |
| Ogmios (public)      | https://ogmios.preview.world.dev.cardano.org |

Update environment variables when integrating with backend services:

```
CARDANO_NETWORK=preview
CARDANO_NETWORK_MAGIC=2
CARDANO_OGMIOS_URL=https://ogmios.preview.world.dev.cardano.org
```

## Next Steps

1. Define datum/redeemer types for predictions and votes (`lib/Types.ak`).
2. Implement validator logic in `validators/prediction_dao.ak`.
3. Create off-chain transaction builders (JS/TS using Lucid or Mesh).
4. Write integration tests (query UTXOs, submit transactions on Preview).

---

For migration context, see `../CARDANO-MIGRATION-PLAN.md`.

