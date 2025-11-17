# 🔮 Inverstra: Building Trust in Financial Advice Through Community Verification

## 🌟 **Executive Summary**

Inverstra is the world's first financial forecasting platform powered by decentralized communities and real-time web verification. In an era where 70% of online financial advice remains unaccountable, we're transforming how investment predictions are created, validated, and consumed—moving from viral, unchecked "finfluencer" content to a transparent, community-governed ecosystem.

## ❓ Problem Statement

In the world of finance, there's a growing distrust in self-proclaimed “finfluencers” spreading misleading or unaudited investment advice on social media. Most platforms lack transparency, verification, or accountability for these predictions — leading to misinformation and financial losses.

> 🔧 **We aim to solve this by:**
- ✅ Creating a **fully decentralized platform** where verified communities govern predictions, not corporations or individual influencers.A platform where predictions are verified and approved by **communities (DAOs)**.
- ✅ Using **AI** to explain and validate reasoning behind investment ideas.
- ✅ Ensuring **transparency, credibility, and decentralization** in financial forecasting.

- **Live Demo:** [https://cardano-investra.vercel.app/](https://cardano-investra.vercel.app/)

## 🚀 **Technology Stack (Cardano-First)**

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn UI, Framer Motion  
- **Wallet & Cardano:**  
  - Cardano CIP-30 wallets (Eternl)  
  - `lucid-cardano` for wallet connection & transaction building  
  - Custom Cardano helper layer in `frontend/lib/cardano.js`  
- **Backend:** Node.js, Express.js, RESTful APIs  
- **Database:** MongoDB Atlas (user profiles, predictions, tokens) — used as an off-chain mirror and fallback, **Cardano is the source of truth for governance & accountability**  
- **Web3 (Current Implementation):**  
  - Target chain: **Cardano**  
  - Wallet auth & addresses via Cardano wallets (Eternl-first)  
  - On-chain governance model based on the `PredictionDAO` contract logic (Solidity prototype in `contracts/PredictionDAO.sol`, being ported to Plutus as per `CARDANO-MIGRATION-PLAN.md`)  
- **Authentication:** Non-custodial, wallet-based auth (Cardano wallets – primarily Eternl)  
- **Verification:** Web scraping + AI curation layer for market data, news, and source credibility

## 🔄 **User Flows & Experience**

### **Complete User Journey**
```
┌─────────────────┐    ┌────────────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Visits   │───▶│  Connect Cardano       │───▶│  Role Selection │───▶│  Profile Setup  │
│   Website       │    │  Wallet (Eternl)       │    │  (Learner/      │    │  (Investment    │
│                 │    │                        │    │   Expert/       │    │   Preferences)  │
│                 │    │  (Wallet = Login)      │    │   Verifier)     │    │                 │
└─────────────────┘    └────────────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Expert Flow**
As an expert/influencer:

1. **Wallet Connection & Profile**
   - Connect wallet for on-chain accountability
   - Dashboard displays prediction history and credibility score

2. **Create Prediction**
   - Enter financial values with clear reasoning
   - Upload supporting evidence (documents, charts)
   - System requires evidence, not guesswork

3. **Verification Process**
   - Web scraping verification reviews prediction and data
   - Assigns validation score (minimum 70/100 required)
   - Predictions sent anonymously to DAO community
   - 70% supermajority required for publication
   
4. **Feedback & Rewards**
   - Approved predictions go live and earn tokens
   - Rejected predictions receive private feedback
   - Reputation builds with successful predictions

### **Learner Flow**
As a user/learner:

1. **Wallet Connection & Profile**
   - Join with wallet and set preferences
   - Receive 20 initial tokens
   
2. **Dashboard Experience**
   - View curated, verified predictions
   - Spend 2 tokens to unlock detailed predictions
   - Access personalized insights based on preferences

3. **Token Economy**
   - Earn through daily logins and engagement
   - Pay for premium content with tokens
   - Track prediction performance


### **DAO Verification Flow**
```
Prediction ──▶ Web Scraping ──▶ Data Collection ──▶ Web Data ──▶ Market Context ──▶ DAO Decision
     │              │               │               │              │               │
     ▼              ▼               ▼               ▼              ▼               ▼
┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Submit  │ │ Analyze     │ │ Real-time   │ │ Market      │ │ Contextual  │ │ Informed    │
│ for     │ │ Credibility │ │ Web Scraping│ │ Data        │ │ Analysis    │ │ Voting      │
│ Voting  │ │ & Quality   │ │             │ │             │ │             │ │             │
└─────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```
## 💰 **Tokenomics & Economic Model**

Our platform operates on a scarce-token ecosystem that incentivizes quality contributions and thoughtful engagement:


| User Type | Starting Tokens | Token Usage | Earning Mechanism |
|-----------|----------------|-------------|-------------------|
| **Learners** | 20 tokens | 2 tokens per prediction unlock | Daily logins, engagement rewards |
| **Experts/Influencers** | 50 tokens | 10 tokens per prediction creation | 25 tokens per approved prediction, achievements |
| **DAO Members** | 30 tokens | 1 token per vote | Rewards for active, accurate participation |

This token-based economy ensures:
- Every action has a cost, reducing spam and low-quality content
- Quality predictions are rewarded, creating positive reinforcement
- Active participation and accuracy build reputation and wealth
- All transactions are governed by transparent, auditable smart contracts

## 🌟 **Competitive Edge & Unique Value**

| Platform | Verification Method | Accountability | Governance |
|----------|---------------------|----------------|------------|
| **Instagram/TikTok** | None (virality-driven) | None | Centralized |
| **Financial Forums** | Moderator review | Limited | Centralized |
| **Reddit/Discord** | Community voting | Pseudonymous | Semi-decentralized |
| **Inverstra** | Triple validation: Web verification + Source checking + DAO voting | Wallet-linked, on-chain | Fully decentralized |

**Our Web3 Advantage:**
- Predictions are immutable and blockchain-verified
- Reputation is earned through verifiable actions, not follower count
- Communities have actual governance power through DAOs
- Token economics reward accuracy and quality, not virality

## 🧪 **Features Completed for HackIndia**

- ✅ **Wallet Integration:** Cardano wallet connection (Eternl-first, CIP‑30) with address persistence
- ✅ **Multi-Role System:** Distinct flows for experts, learners, and DAO members
- ✅ **Dynamic Dashboard:** Personalized prediction feed with modern UI
- ✅ **Verification System:** Web scraping verification for data accuracy
- ✅ **DAO Governance:** Community voting mechanism with supermajority requirements
- ✅ **Token Economy:** Fully implemented token distribution and spending system
- ✅ **Smart Contracts (Design):** `PredictionDAO` governance logic (current Solidity prototype, being migrated to Cardano/Plutus for production)
- ✅ **MongoDB Integration:** Complete user profile, prediction & token storage as an off‑chain mirror / fallback

## 🛠️ **Project Setup Instructions**

### Frontend Setup
```bash
git clone https://github.com/ChiragSareen7/Cardano-X-Investra.git
cd Cardano-X-Investra/frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd ../backend
npm install
npm run dev
```

**Requirements:**
- Node.js v16+
- Cardano wallet browser extension (recommended: **Eternl**, also supports Nami/Flint)

> 🔁 **Note on Blockchain Layer:**  
> The repository still contains the original Ethereum/Hardhat prototype (`contracts/` directory) as a reference for the DAO logic.  
> The **target production deployment is on Cardano**, with Cardano-specific migration, architecture and Plutus plans documented in:  
> - `CARDANO-MIGRATION-PLAN.md`  
> - `CARDANO-MIGRATION-SUMMARY.md`  
> - `TECHNOLOGY-FLOW-DIAGRAM.md`

## 🌐 **Impact & Vision**

Inverstra isn't just a platform—it's a movement to transform how financial advice is created and consumed in India and beyond. By building trust through transparency and community governance, we're creating a future where:

- Young investors have access to reliable, verified financial guidance
- Financial literacy becomes accessible without the risk of misinformation
- Communities, not algorithms or influencers, determine what advice is trustworthy
- Accountability becomes the standard in financial content creation

What started as a hackathon project has grown into a community-powered solution redefining trust in financial advice. 

## 👥 **Team**

Our diverse team combines expertise in blockchain development, UI/UX design, financial markets, and community building:

- **Kamakshi Pandoh** - Full Stack Developer & Project Lead
- **Chirag Sareen** - Blockchain Developer
