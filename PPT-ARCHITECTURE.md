# Inverstra Architecture - PowerPoint Ready

## 🎯 Main Architecture Diagram (Recommended for PPT)

```mermaid
graph TB
    subgraph "👥 Users"
        I[Influencer<br/>Creates Predictions]
        L[Learner<br/>Votes & Learns]
    end

    subgraph "🌐 Frontend Layer"
        FE[Next.js Application<br/>React + TailwindCSS<br/>Port 3000]
        WC[Wallet Integration<br/>Eternl Cardano Wallet]
    end

    subgraph "🔌 API Gateway"
        API[Next.js API Routes<br/>Proxy Layer]
    end

    subgraph "⚙️ Backend Services"
        BE[Express.js Server<br/>Node.js<br/>Port 5008]
        DAO[DAO Service<br/>Prediction Management]
        AI[AI Curation Service<br/>Content Analysis]
    end

    subgraph "💾 Data Storage"
        MDB[(MongoDB Atlas<br/>Cloud Database<br/>Primary Storage)]
    end

    subgraph "⛓️ Blockchain Layer"
        CARD[Cardano Network<br/>Preview Testnet]
        SC[Smart Contracts<br/>Aiken/Plutus]
        LUCID[Lucid SDK<br/>Transaction Builder]
    end

    subgraph "🤖 AI Services"
        GROQ[Groq AI<br/>Reasoning Validation]
        PERP[Perplexity AI<br/>Document Analysis]
    end

    subgraph "🔗 Blockchain APIs"
        BF[Blockfrost API<br/>Cardano Data Provider]
    end

    %% User Flow
    I -->|Connect Wallet| WC
    L -->|Connect Wallet| WC
    WC --> FE
    I -->|Create Prediction| FE
    L -->|Browse & Vote| FE

    %% Frontend to Backend
    FE -->|API Calls| API
    API -->|Proxy Requests| BE

    %% Backend Processing
    BE -->|Process| DAO
    BE -->|Analyze| AI
    DAO -->|Save Data| MDB
    DAO -->|Create Transaction| LUCID
    AI -->|Validate| GROQ
    AI -->|Analyze Docs| PERP

    %% Blockchain Flow
    LUCID -->|Build TX| SC
    SC -->|Deploy| CARD
    LUCID -->|Query Data| BF
    BF -->|Blockchain Data| CARD

    %% Fallback Flow
    DAO -.->|Fallback if<br/>Blockchain Fails| MDB

    %% Styling
    classDef userStyle fill:#4CAF50,stroke:#2E7D32,stroke-width:3px,color:#fff
    classDef frontendStyle fill:#2196F3,stroke:#1565C0,stroke-width:3px,color:#fff
    classDef backendStyle fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#fff
    classDef dataStyle fill:#9C27B0,stroke:#6A1B9A,stroke-width:3px,color:#fff
    classDef blockchainStyle fill:#FFC107,stroke:#F57C00,stroke-width:3px,color:#000
    classDef aiStyle fill:#E91E63,stroke:#C2185B,stroke-width:3px,color:#fff
    classDef apiStyle fill:#00BCD4,stroke:#00838F,stroke-width:3px,color:#fff

    class I,L userStyle
    class FE,WC frontendStyle
    class BE,DAO,AI backendStyle
    class MDB dataStyle
    class CARD,SC,LUCID blockchainStyle
    class GROQ,PERP aiStyle
    class API,BF apiStyle
```

## 📊 Complete User Journey Flow

```mermaid
flowchart TD
    Start([User Lands on Inverstra]) --> Connect[Connect Cardano Wallet<br/>Eternl Integration]
    
    Connect --> Role{Select User Role}
    
    Role -->|Influencer| IFlow[Influencer Dashboard]
    Role -->|Learner| LFlow[Learner Dashboard]
    
    subgraph "Influencer Workflow"
        IFlow --> Create[Create Prediction<br/>Enter Details]
        Create --> Upload[Upload Supporting<br/>Documents]
        Upload --> Validate[AI Validation<br/>Groq + Perplexity]
        Validate -->|Valid| Submit[Submit to DAO<br/>MongoDB + Cardano]
        Validate -->|Invalid| Create
        Submit --> Wait[Wait for Community<br/>Voting Period]
        Wait --> Results[View Results<br/>Track Performance]
    end
    
    subgraph "Learner Workflow"
        LFlow --> Browse[Browse Active<br/>Predictions]
        Browse --> Analyze[AI-Powered Analysis<br/>Get Insights]
        Analyze --> Vote[Cast Vote<br/>Yes/No]
        Vote --> Track[Track Prediction<br/>Outcomes]
        Track --> Learn[Learn from<br/>Results]
    end
    
    subgraph "Technical Components"
        Tech1[Frontend: Next.js]
        Tech2[Backend: Express.js]
        Tech3[Database: MongoDB]
        Tech4[Blockchain: Cardano]
        Tech5[AI: Groq + Perplexity]
    end
    
    Submit --> Tech2
    Vote --> Tech2
    Tech2 --> Tech3
    Tech2 --> Tech4
    Validate --> Tech5
    
    Results --> End([End])
    Learn --> End
    
    style Start fill:#4CAF50,color:#fff,stroke:#2E7D32,stroke-width:3px
    style Connect fill:#2196F3,color:#fff,stroke:#1565C0,stroke-width:3px
    style IFlow fill:#FF9800,color:#fff,stroke:#E65100,stroke-width:2px
    style LFlow fill:#9C27B0,color:#fff,stroke:#6A1B9A,stroke-width:2px
    style Tech1 fill:#00BCD4,color:#fff,stroke:#00838F,stroke-width:2px
    style Tech2 fill:#00BCD4,color:#fff,stroke:#00838F,stroke-width:2px
    style Tech3 fill:#00BCD4,color:#fff,stroke:#00838F,stroke-width:2px
    style Tech4 fill:#00BCD4,color:#fff,stroke:#00838F,stroke-width:2px
    style Tech5 fill:#00BCD4,color:#fff,stroke:#00838F,stroke-width:2px
```

## 🏗️ System Architecture - Technical Stack

```mermaid
graph LR
    subgraph "Client Layer"
        C1[Browser]
        C2[Eternl Wallet Extension]
    end
    
    subgraph "Frontend Stack"
        F1[Next.js 15<br/>React 18]
        F2[TailwindCSS<br/>UI Components]
        F3[Lucid Cardano<br/>Wallet SDK]
    end
    
    subgraph "Backend Stack"
        B1[Express.js<br/>REST API]
        B2[Node.js<br/>Runtime]
        B3[Mongoose<br/>ODM]
    end
    
    subgraph "Database"
        D1[MongoDB Atlas<br/>Cloud Database]
    end
    
    subgraph "Blockchain"
        BC1[Cardano Preview<br/>Testnet]
        BC2[Aiken Smart Contracts<br/>Plutus Validators]
        BC3[Blockfrost API<br/>Blockchain Data]
    end
    
    subgraph "AI Services"
        A1[Groq API<br/>LLM Reasoning]
        A2[Perplexity API<br/>Document Analysis]
    end
    
    C1 --> F1
    C2 --> F3
    F1 --> F2
    F1 --> F3
    F1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> D1
    B1 --> BC2
    BC2 --> BC1
    B1 --> BC3
    B1 --> A1
    B1 --> A2
    
    style C1 fill:#4CAF50,color:#fff
    style C2 fill:#4CAF50,color:#fff
    style F1 fill:#2196F3,color:#fff
    style F2 fill:#2196F3,color:#fff
    style F3 fill:#2196F3,color:#fff
    style B1 fill:#FF9800,color:#fff
    style B2 fill:#FF9800,color:#fff
    style B3 fill:#FF9800,color:#fff
    style D1 fill:#9C27B0,color:#fff
    style BC1 fill:#FFC107,color:#000
    style BC2 fill:#FFC107,color:#000
    style BC3 fill:#FFC107,color:#000
    style A1 fill:#E91E63,color:#fff
    style A2 fill:#E91E63,color:#fff
```

## 💡 How to Use in PowerPoint

1. **Copy the Mermaid code** from any diagram above
2. **Go to**: https://mermaid.live/ or use a Mermaid plugin in PowerPoint
3. **Paste the code** and render
4. **Export as PNG/SVG** for your presentation
5. **Or use**: VS Code with Mermaid extension to export directly

## 🎨 Color Scheme Used

- **Users**: Green (#4CAF50)
- **Frontend**: Blue (#2196F3)
- **Backend**: Orange (#FF9800)
- **Database**: Purple (#9C27B0)
- **Blockchain**: Yellow (#FFC107)
- **AI Services**: Pink (#E91E63)
- **APIs**: Cyan (#00BCD4)

