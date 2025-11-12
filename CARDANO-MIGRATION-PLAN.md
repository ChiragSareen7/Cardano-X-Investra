# Cardano Blockchain Migration Plan

## Overview
This document outlines the comprehensive plan to migrate the Inverstra platform from Ethereum to Cardano blockchain, replacing MetaMask with Eternl Wallet and implementing all DAO voting, prediction creation, and blockchain operations on Cardano.

---

## 🎯 Migration Goals

1. **Replace Ethereum with Cardano blockchain**
2. **Replace MetaMask with Eternl Wallet**
3. **Migrate Solidity contracts to Plutus smart contracts**
4. **Maintain frontend UI unchanged** (only blockchain integration changes)
5. **Preserve all existing functionality** (DAO voting, predictions, token system)

---

## 📋 Current Ethereum Implementation Analysis

### Frontend Components Using Ethereum:
1. **Wallet Connection** (`wallet-connect.js`)
   - Uses `window.ethereum` API
   - MetaMask connection logic
   - Address format: 0x...

2. **DAO Components**:
   - `DAOVotingCard.jsx` - Uses ethers.js for voting
   - `CreatePredictionForm.jsx` - Uses ethers.js for prediction creation
   - `dao/dashboard.js` - Wallet connection checks

3. **Influencer Pages**:
   - `create-prediction.js` - Uses ethers.js for blockchain submission
   - Contract interaction via ethers.Contract

4. **Contract Files**:
   - `contract/abi.js` - Ethereum ABI
   - `contract/contractAddress.js` - Ethereum addresses
   - `contract/daoAbi.js` - DAO contract ABI

### Backend Components Using Ethereum:
1. **DAO Routes** (`backend/routes/daoRoutes.js`)
   - Uses `ethers.js` for contract interactions
   - Provider: `ethers.JsonRpcProvider('http://localhost:8545')`
   - Contract initialization and method calls

2. **Contract Service** (`DAOContractService` class)
   - Contract reading/writing
   - Transaction handling
   - Event listening

### Smart Contracts:
1. **PredictionDAO.sol** - Solidity contract
   - Prediction creation
   - Voting mechanism
   - Member management
   - 70% approval threshold

2. **Deployment** - Hardhat framework
   - Local development network
   - Contract compilation and deployment

---

## 🔄 Required Changes

### 1. **Frontend Changes** (UI stays the same, only integration changes)

#### A. Wallet Connection (`frontend/pages/wallet-connect.js`)
**Current:**
- Uses `window.ethereum.request({ method: "eth_requestAccounts" })`
- MetaMask-specific logic
- Ethereum address format

**New:**
- Use Eternl Wallet API: `window.cardano.eternl.enable()`
- Cardano address format (Bech32: `addr1...`)
- Handle Cardano network (Mainnet/Testnet)

**Files to Modify:**
- `frontend/pages/wallet-connect.js`
- `frontend/pages/dao/dashboard.js`
- `frontend/pages/influencer/create-prediction.js`
- `frontend/pages/influencer/dashboard.js`
- `frontend/pages/learner/dashboard.js`

#### B. Contract Interaction Libraries
**Current:**
- `ethers.js` (v6.13.5)

**New:**
- `@meshsdk/mesh` or `@cardano-foundation/cardano-connect-with-wallet`
- `@emurgo/cardano-serialization-lib-browser` (for transaction building)
- `lucid-cardano` (alternative lightweight option)

**Files to Modify:**
- `frontend/components/dao/DAOVotingCard.jsx`
- `frontend/components/dao/CreatePredictionForm.jsx`
- `frontend/pages/influencer/create-prediction.js`

#### C. Contract Address/ABI Files
**Current:**
- `frontend/contract/contractAddress.js` - Ethereum addresses
- `frontend/contract/abi.js` - Ethereum ABI
- `frontend/contract/daoAbi.js` - DAO ABI

**New:**
- `frontend/contract/cardanoContractAddress.js` - Cardano contract addresses (Policy IDs)
- `frontend/contract/cardanoContractCBOR.js` - Plutus contract CBOR (replaces ABI)
- `frontend/contract/cardanoContractSchema.js` - Contract schema/interface

**Files to Create/Modify:**
- Replace all contract address files
- Replace ABI files with Cardano contract schemas

---

### 2. **Backend Changes**

#### A. Contract Service (`backend/routes/daoRoutes.js`)
**Current:**
- `ethers.JsonRpcProvider` for Ethereum RPC
- `ethers.Contract` for contract interactions
- Ethereum transaction format

**New:**
- Cardano Node connection (via `cardano-cli` or `ogmios`)
- Plutus contract interaction via transaction building
- Cardano transaction format (UTXO model)

**Files to Modify:**
- `backend/routes/daoRoutes.js`
- Create: `backend/services/cardanoService.js`

#### B. Transaction Building
**Current:**
- Ethereum: Simple function calls with gas estimation

**New:**
- Cardano: UTXO-based transaction building
- Plutus script execution
- Native token handling (if needed)
- Transaction signing and submission

**New Files:**
- `backend/services/cardanoTransactionService.js`
- `backend/services/plutusContractService.js`

#### C. Network Configuration
**Current:**
- Hardhat local network (port 8545)
- Ethereum chain IDs

**New:**
- Cardano Testnet (Preview/Preprod)
- Cardano Mainnet
- Cardano Node connection (port 3001 or Ogmios)

**Files to Modify:**
- `backend/config/database.js` → Add Cardano config
- Create: `backend/config/cardano.js`

---

### 3. **Smart Contract Migration**

#### A. Solidity → Plutus
**Current Contract:** `contracts/contracts/PredictionDAO.sol`

**New Contract Structure:**
```
contracts/
  plutus/
    PredictionDAO.hs          # Plutus on-chain code
    PredictionDAO.OffChain.hs # Off-chain code (minting/burning)
    PredictionDAO.Schema.hs  # Datum/Redeemer schemas
```

**Key Differences:**
- **Ethereum**: Stateful contracts with storage
- **Cardano**: UTXO-based, stateless scripts
- **Data Storage**: Use Datum in UTXOs instead of contract storage
- **Voting**: Store votes as UTXOs with Datum
- **Predictions**: Each prediction = UTXO with Datum containing prediction data

**Contract Functions to Migrate:**
1. `createPrediction()` → Plutus validator that locks UTXO with prediction datum
2. `vote()` → Plutus validator that consumes prediction UTXO and creates vote UTXO
3. `getActivePredictions()` → Off-chain query (not on-chain function)
4. `finalizePrediction()` → Plutus validator that finalizes prediction UTXO

**Files to Create:**
- `contracts/plutus/PredictionDAO.hs`
- `contracts/plutus/PredictionDAO.OffChain.hs`
- `contracts/plutus/Deploy.hs` (deployment script)

---

### 4. **Development Environment Changes**

#### A. Remove Ethereum Tooling
**Remove:**
- Hardhat (`hardhat.config.js`)
- Solidity compiler
- Ethereum node (Hardhat node)

**Files to Remove:**
- `contracts/hardhat.config.js`
- `contracts/package.json` (update dependencies)
- `contracts/scripts/deploy.js` (replace with Cardano deployment)

#### B. Add Cardano Tooling
**Add:**
- **Plutus Development Environment:**
  - Nix shell with Plutus toolchain
  - `plutus-apps` repository setup
  - `cardano-cli` for contract deployment
  - `cardano-node` for local testing (optional)

- **Alternative (Simpler):**
  - Use **Aiken** (modern Plutus alternative) - simpler syntax
  - Or use **Mesh SDK** for JavaScript-based contract interactions

**New Files:**
- `contracts/cardano/plutus/` - Plutus contracts
- `contracts/cardano/deploy.sh` - Deployment script
- `contracts/cardano/README.md` - Cardano deployment guide

---

### 5. **Package Dependencies**

#### Frontend (`frontend/package.json`)
**Remove:**
```json
"ethers": "^6.13.5"
```

**Add:**
```json
"@meshsdk/mesh": "^1.0.0",
"@emurgo/cardano-serialization-lib-browser": "^11.0.0",
"lucid-cardano": "^0.10.0"  // Alternative option
```

#### Backend (`backend/package.json`)
**Remove:**
```json
"ethers": "^6.13.5"
```

**Add:**
```json
"@meshsdk/mesh": "^1.0.0",
"@cardano-foundation/cardano-connect-with-wallet": "^1.0.0",
"cardano-cli-js": "^1.0.0"  // For backend contract interactions
```

#### Contracts (`contracts/package.json`)
**Remove:**
```json
"@nomicfoundation/hardhat-toolbox": "^6.1.0",
"hardhat": "^2.26.3"
```

**Add:**
- Plutus development requires Nix environment
- Or use Aiken for simpler contract development

---

## 🛠️ Implementation Plan

### Phase 1: Setup Cardano Development Environment
1. **Install Cardano Tools:**
   - Set up Nix shell with Plutus toolchain
   - Install `cardano-cli`
   - Configure Cardano Testnet connection

2. **Create Cardano Service Layer:**
   - `backend/services/cardanoService.js` - Base Cardano operations
   - `backend/services/cardanoTransactionService.js` - Transaction building
   - `backend/config/cardano.js` - Network configuration

### Phase 2: Wallet Integration
1. **Replace MetaMask with Eternl:**
   - Update `wallet-connect.js` to use Eternl API
   - Handle Cardano address format (Bech32)
   - Update all wallet connection checks

2. **Update Frontend Contract Interaction:**
   - Replace `ethers.js` with Mesh SDK or Lucid
   - Update contract address files
   - Replace ABI with Cardano contract schemas

### Phase 3: Smart Contract Migration
1. **Write Plutus Contracts:**
   - Convert `PredictionDAO.sol` logic to Plutus
   - Design UTXO-based data structures (Datum)
   - Implement validators for prediction creation and voting

2. **Deploy Contracts:**
   - Compile Plutus contracts
   - Deploy to Cardano Testnet
   - Get contract addresses (Policy IDs/Validator hashes)

### Phase 4: Backend Integration
1. **Update DAO Routes:**
   - Replace `ethers.js` calls with Cardano transaction building
   - Update contract interaction methods
   - Handle UTXO model queries

2. **Update Transaction Flow:**
   - Build Cardano transactions
   - Handle Plutus script execution
   - Submit transactions to Cardano network

### Phase 5: Testing & Validation
1. **Test All Functionality:**
   - Wallet connection
   - Prediction creation
   - DAO voting
   - Contract queries

2. **Update Documentation:**
   - Migration guide
   - Cardano deployment instructions
   - API changes

---

## 📚 Languages & Technologies Added

### New Languages:
1. **Haskell** (for Plutus smart contracts)
   - Plutus is written in Haskell
   - On-chain code: Haskell with Plutus libraries
   - Off-chain code: Haskell with Cardano libraries

2. **PlutusTx** (embedded DSL in Haskell)
   - For writing on-chain validator logic
   - Compiles to Plutus Core

### Alternative (Simpler):
- **Aiken** (if chosen)
  - Modern functional language for Cardano
  - Simpler syntax than Plutus
  - TypeScript-like but functional

### New Technologies:
1. **Cardano Node** - Blockchain node software
2. **Cardano CLI** - Command-line interface for Cardano
3. **Ogmios** - Cardano query server (alternative to direct node connection)
4. **Mesh SDK** - JavaScript library for Cardano
5. **Lucid** - TypeScript library for Cardano (alternative)
6. **Cardano Serialization Library** - For transaction building

---

## 🔧 Technical Architecture Changes

### Ethereum Model (Current):
```
Frontend → ethers.js → Ethereum RPC → Smart Contract (Stateful)
```

### Cardano Model (New):
```
Frontend → Mesh SDK/Lucid → Cardano Node/Ogmios → Plutus Validator (UTXO-based)
```

### Key Differences:

| Aspect | Ethereum | Cardano |
|--------|----------|---------|
| **Model** | Account-based (stateful) | UTXO-based (stateless) |
| **Contracts** | Solidity | Plutus (Haskell) |
| **Storage** | Contract storage | Datum in UTXOs |
| **Transactions** | Function calls | UTXO consumption/creation |
| **Gas** | Gas fees | Transaction fees (ADA) |
| **Addresses** | 0x... (hex) | addr1... (Bech32) |
| **Wallet** | MetaMask | Eternl |

---

## 📁 File Structure Changes

### New Files to Create:

```
Inverstra/
├── contracts/
│   ├── cardano/
│   │   ├── plutus/
│   │   │   ├── PredictionDAO.hs
│   │   │   ├── PredictionDAO.OffChain.hs
│   │   │   └── PredictionDAO.Schema.hs
│   │   ├── deploy.sh
│   │   └── README.md
│   └── (remove hardhat files)
│
├── backend/
│   ├── services/
│   │   ├── cardanoService.js (NEW)
│   │   ├── cardanoTransactionService.js (NEW)
│   │   └── plutusContractService.js (NEW)
│   ├── config/
│   │   └── cardano.js (NEW)
│   └── routes/
│       └── daoRoutes.js (MODIFY)
│
└── frontend/
    ├── contract/
    │   ├── cardanoContractAddress.js (NEW - replaces contractAddress.js)
    │   ├── cardanoContractSchema.js (NEW - replaces abi.js)
    │   └── cardanoDaoSchema.js (NEW - replaces daoAbi.js)
    ├── lib/
    │   └── cardano.js (NEW - replaces any ethers utilities)
    └── pages/
        └── wallet-connect.js (MODIFY)
```

### Files to Modify:

**Frontend:**
- `frontend/pages/wallet-connect.js`
- `frontend/pages/dao/dashboard.js`
- `frontend/pages/influencer/create-prediction.js`
- `frontend/pages/influencer/dashboard.js`
- `frontend/components/dao/DAOVotingCard.jsx`
- `frontend/components/dao/CreatePredictionForm.jsx`
- `frontend/contract/contractAddress.js` → Replace
- `frontend/contract/abi.js` → Replace
- `frontend/contract/daoAbi.js` → Replace

**Backend:**
- `backend/routes/daoRoutes.js`
- `backend/package.json`
- `backend/config/database.js` (add Cardano config)

**Contracts:**
- `contracts/package.json` (update dependencies)
- Remove: `contracts/hardhat.config.js`
- Remove: `contracts/scripts/deploy.js` (replace with Cardano deployment)

---

## 🚀 Migration Steps (Detailed)

### Step 1: Environment Setup
```bash
# Install Cardano CLI (via Nix or binary)
# Set up Plutus development environment
# Configure Cardano Testnet connection
```

### Step 2: Wallet Integration
```javascript
// Replace window.ethereum with window.cardano.eternl
const wallet = await window.cardano.eternl.enable();
const addresses = await wallet.getUsedAddresses();
```

### Step 3: Contract Development
```haskell
-- Write Plutus validator in Haskell
-- Compile to Plutus Core
-- Deploy to Cardano Testnet
```

### Step 4: Frontend Updates
```javascript
// Replace ethers.js imports
import { MeshWallet } from '@meshsdk/mesh';

// Update contract interactions
const tx = await mesh.buildTransaction(...);
```

### Step 5: Backend Updates
```javascript
// Replace ethers provider
const cardanoService = new CardanoService();
const tx = await cardanoService.buildTransaction(...);
```

---

## ⚠️ Important Considerations

### 1. **UTXO Model Complexity**
- Cardano uses UTXO model (like Bitcoin), not account-based
- Need to track UTXOs for each prediction/vote
- More complex than Ethereum's simple function calls

### 2. **Data Storage**
- Cannot store large data on-chain (expensive)
- Use Datum for small data, off-chain storage for large data
- May need to keep MongoDB for detailed data, Cardano for verification

### 3. **Transaction Building**
- More complex than Ethereum
- Need to select UTXOs, build transactions, sign, submit
- Requires understanding of Cardano transaction structure

### 4. **Contract Deployment**
- Plutus contracts are more complex to deploy
- Need to compile, get validator hash, build deployment transaction
- Higher learning curve than Solidity

### 5. **Testing**
- Cardano Testnet required for testing
- Slower transaction times than Ethereum
- Different fee structure

---

## 📊 Estimated Complexity

| Task | Complexity | Time Estimate |
|------|------------|---------------|
| Wallet Integration | Medium | 2-3 days |
| Contract Migration | High | 1-2 weeks |
| Backend Integration | Medium | 3-5 days |
| Frontend Updates | Low-Medium | 2-3 days |
| Testing & Debugging | High | 1 week |
| **Total** | **High** | **3-4 weeks** |

---

## 🎯 Success Criteria

1. ✅ Eternl wallet connects successfully
2. ✅ Predictions can be created on Cardano
3. ✅ DAO voting works on Cardano
4. ✅ All existing functionality preserved
5. ✅ Frontend UI unchanged (only blockchain integration)
6. ✅ Contracts deployed and verified on Cardano Testnet

---

## 📝 Next Steps

1. **Review and approve this migration plan**
2. **Set up Cardano development environment**
3. **Begin Phase 1: Environment Setup**
4. **Iterate through each phase systematically**

---

## 🔗 Resources

- [Cardano Developer Portal](https://developers.cardano.org/)
- [Plutus Documentation](https://plutus.readthedocs.io/)
- [Mesh SDK Documentation](https://mesh.martify.io/)
- [Eternl Wallet API](https://eternl.io/)
- [Cardano Serialization Library](https://github.com/Emurgo/cardano-serialization-lib)

---

**Note:** This migration is significant and requires deep understanding of both Ethereum and Cardano architectures. Consider having a Cardano/Plutus expert review the contract migration.

