# Cardano Migration - Quick Summary

## 🎯 Objective
Migrate from Ethereum/MetaMask to Cardano/Eternl Wallet while keeping frontend UI unchanged.

---

## 📋 Changes Required

### 1. **Frontend Changes** (UI stays same, only blockchain integration)

#### Files to Modify:
- ✅ `frontend/pages/wallet-connect.js` - Replace MetaMask with Eternl
- ✅ `frontend/pages/dao/dashboard.js` - Update wallet checks
- ✅ `frontend/pages/influencer/create-prediction.js` - Replace ethers.js
- ✅ `frontend/pages/influencer/dashboard.js` - Update wallet checks
- ✅ `frontend/components/dao/DAOVotingCard.jsx` - Replace ethers.js
- ✅ `frontend/components/dao/CreatePredictionForm.jsx` - Replace ethers.js

#### Files to Replace:
- ❌ `frontend/contract/contractAddress.js` → `cardanoContractAddress.js`
- ❌ `frontend/contract/abi.js` → `cardanoContractSchema.js`
- ❌ `frontend/contract/daoAbi.js` → `cardanoDaoSchema.js`

#### New Files:
- ➕ `frontend/lib/cardano.js` - Cardano utilities

---

### 2. **Backend Changes**

#### Files to Modify:
- ✅ `backend/routes/daoRoutes.js` - Replace ethers.js with Cardano services
- ✅ `backend/package.json` - Update dependencies

#### New Files:
- ➕ `backend/services/cardanoService.js` - Base Cardano operations
- ➕ `backend/services/cardanoTransactionService.js` - Transaction building
- ➕ `backend/services/plutusContractService.js` - Plutus contract interactions
- ➕ `backend/config/cardano.js` - Cardano network configuration

---

### 3. **Smart Contract Migration**

#### Remove:
- ❌ `contracts/contracts/PredictionDAO.sol` (Solidity)
- ❌ `contracts/hardhat.config.js`
- ❌ `contracts/scripts/deploy.js`

#### Create:
- ➕ `contracts/cardano/plutus/PredictionDAO.hs` - Plutus on-chain code
- ➕ `contracts/cardano/plutus/PredictionDAO.OffChain.hs` - Off-chain code
- ➕ `contracts/cardano/plutus/PredictionDAO.Schema.hs` - Data schemas
- ➕ `contracts/cardano/deploy.sh` - Deployment script

---

### 4. **Package Dependencies**

#### Frontend (`frontend/package.json`):
**Remove:**
- `ethers: ^6.13.5`

**Add:**
- `@meshsdk/mesh: ^1.0.0`
- `@emurgo/cardano-serialization-lib-browser: ^11.0.0`
- `lucid-cardano: ^0.10.0` (optional)

#### Backend (`backend/package.json`):
**Remove:**
- `ethers: ^6.13.5`

**Add:**
- `@meshsdk/mesh: ^1.0.0`
- `cardano-cli-js: ^1.0.0`

#### Contracts (`contracts/package.json`):
**Remove:**
- `@nomicfoundation/hardhat-toolbox`
- `hardhat`

**Add:**
- Plutus development environment (Nix-based)
- Or Aiken (simpler alternative)

---

## 🔄 Key Replacements

| Current (Ethereum) | New (Cardano) |
|-------------------|---------------|
| `window.ethereum` | `window.cardano.eternl` |
| `ethers.js` | `@meshsdk/mesh` or `lucid-cardano` |
| Solidity | Plutus (Haskell) |
| Hardhat | Cardano CLI + Plutus toolchain |
| `0x...` addresses | `addr1...` addresses (Bech32) |
| Account-based | UTXO-based |
| Contract storage | Datum in UTXOs |
| MetaMask | Eternl Wallet |

---

## 🛠️ Languages Added

1. **Haskell** - For Plutus smart contracts
2. **PlutusTx** - Embedded DSL for validators

**OR (Alternative):**
- **Aiken** - Modern functional language (simpler than Plutus)

---

## 📊 Implementation Phases

1. **Phase 1:** Setup Cardano development environment (2-3 days)
2. **Phase 2:** Wallet integration - Replace MetaMask with Eternl (2-3 days)
3. **Phase 3:** Smart contract migration - Solidity → Plutus (1-2 weeks)
4. **Phase 4:** Backend integration - Update contract services (3-5 days)
5. **Phase 5:** Testing & validation (1 week)

**Total Estimated Time: 3-4 weeks**

---

## ⚠️ Important Notes

1. **Frontend UI stays unchanged** - Only blockchain integration layer changes
2. **UTXO model is more complex** - Requires different approach than Ethereum
3. **Data storage** - Large data stays in MongoDB, Cardano for verification
4. **Contract deployment** - More complex than Ethereum, requires Cardano CLI
5. **Testing** - Need Cardano Testnet access

---

## ✅ Success Criteria

- [ ] Eternl wallet connects successfully
- [ ] Predictions created on Cardano
- [ ] DAO voting works on Cardano
- [ ] All functionality preserved
- [ ] Frontend UI unchanged
- [ ] Contracts deployed on Cardano Testnet

---

For detailed information, see `CARDANO-MIGRATION-PLAN.md`

