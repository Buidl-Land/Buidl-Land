export const mockProjects: Record<string, any> = {
  "1": {
    id: 1,
    creator: "0x16D49C978C2a3061647dD0E027999Fe7e6425C8C",
    title: "SocioShield",
    description: "SocioShield is a Decentralized Science (DeSci) initiative launched on the IdeaPulse platform, designed to enhance transparency and collaboration in social sciences. By leveraging blockchain technology, SocioShield creates a decentralized platform where researchers can securely share and verify social science data—such as survey results and behavioral studies—while ensuring data integrity and traceability. This fosters trust and accelerates advancements in social sciences.",
    tags: ["Web3", "DeSci", "AI", "DAO", "Token", "Community", "DeFAI", "Social Sciences", "Data Sharing", "Transparency"],
    metadata: {
      aiEvaluation: "SocioShield is an innovative DeSci project that provides transparency and secure collaboration solutions for the social sciences field through blockchain technology.",
      marketScore: 7,
      techFeasibility: "B",
      minValuation: 500000,
      maxValuation: 2000000,
    },
    status: 1, // Funding
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15天前
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2天前
  },
  "2": {
    id: 2,
    creator: "0x16D49C978C2a3061647dD0E027999Fe7e6425C8C",
    title: "GenomeGuard",
    description: "GenomeGuard is a Decentralized Science (DeSci) initiative launched on the IdeaPulse platform, designed to transform data privacy and collaboration in life sciences, with a focus on genomics. By integrating Zero-Knowledge Proof (ZK) technology, GenomeGuard creates a decentralized platform where researchers can securely share and verify sensitive data—such as genomic sequences—without revealing the raw data itself.",
    tags: ["Web3", "DeSci", "AI", "DAO", "Token", "Community", "DeFAI", "ZK", "Life Sciences", "Genomics"],
    metadata: {
      aiEvaluation: "GenomeGuard is an innovative DeSci project that provides privacy protection and secure collaboration solutions for the life sciences field through zero-knowledge proof technology.",
      marketScore: 8,
      techFeasibility: "A",
      minValuation: 1000000,
      maxValuation: 3000000,
    },
    status: 1, // Funding
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20天前
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5天前
  },
  "3": {
    id: 3,
    creator: "0x16D49C978C2a3061647dD0E027999Fe7e6425C8C",
    title: "PhishZap",
    description: "PhishZap is a targeted security solution designed to protect Web3 users from phishing attacks, one of the most common and damaging threats in the ecosystem. This AI-powered agent integrates seamlessly with popular Web3 wallets like MetaMask, continuously monitoring wallet activities.",
    tags: ["Web3", "AI", "Token", "Community", "DeFi", "DeFAI", "NFT", "Phishing Protection", "Wallet Security", "Real-Time"],
    metadata: {
      aiEvaluation: "PhishZap leverages AI and Web3 trends to combat phishing, offering a scalable, user-friendly security solution with strong market potential.",
      marketScore: 9,
      techFeasibility: "A",
      minValuation: 2000000,
      maxValuation: 5000000,
    },
    status: 1, // Funding
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10天前
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1天前
  },
  "4": {
    id: 4,
    creator: "0x16D49C978C2a3061647dD0E027999Fe7e6425C8C",
    title: "DeFi Pulse Aggregator",
    description: "A comprehensive DeFi analytics platform that aggregates data from multiple protocols to provide insights into yield opportunities, risks, and market trends.",
    tags: ["DeFi", "Analytics", "Yield Farming", "Data", "Risk Assessment"],
    metadata: {
      aiEvaluation: "DeFi Pulse Aggregator addresses a critical need for better data analytics in the DeFi space, with strong potential for user adoption.",
      marketScore: 8,
      techFeasibility: "B+",
      minValuation: 800000,
      maxValuation: 2500000,
    },
    status: 2, // In Progress
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30天前
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 8, // 8天前
  },
  "5": {
    id: 5,
    creator: "0x16D49C978C2a3061647dD0E027999Fe7e6425C8C",
    title: "NFT Governance Framework",
    description: "A governance framework that uses NFTs to represent voting power and participation in decentralized organizations, with weighted influence based on contribution history.",
    tags: ["DAO", "Governance", "NFT", "Voting", "Community"],
    metadata: {
      aiEvaluation: "This NFT-based governance approach brings innovation to DAO structures by providing more nuanced representation of member contributions.",
      marketScore: 7,
      techFeasibility: "B",
      minValuation: 600000,
      maxValuation: 1800000,
    },
    status: 1, // Funding
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 25, // 25天前
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3天前
  }
};

export const mockFundingInfo: Record<string, any> = {
  "1": {
    fundingGoal: BigInt("300000000000000000000000"), // 300,000 USDC
    raisedAmount: BigInt("180000000000000000000000"), // 180,000 USDC (60%)
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15天前
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15天后
    hasMetFundingGoal: false,
    paymentToken: "0x3856Eee08189d63c9DBd1D415789566Cc87357f5", // mockusdc地址
  },
  "2": {
    fundingGoal: BigInt("500000000000000000000000"), // 500,000 USDC
    raisedAmount: BigInt("250000000000000000000000"), // 250,000 USDC (50%)
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20天前
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10天后
    hasMetFundingGoal: false,
    paymentToken: "0x3856Eee08189d63c9DBd1D415789566Cc87357f5", // mockusdc地址
  },
  "3": {
    fundingGoal: BigInt("1000000000000000000000000"), // 1,000,000 USDC
    raisedAmount: BigInt("650000000000000000000000"), // 650,000 USDC (65%)
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10天前
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 50, // 50天后
    hasMetFundingGoal: false,
    paymentToken: "0x3856Eee08189d63c9DBd1D415789566Cc87357f5", // mockusdc地址
  },
  "4": {
    fundingGoal: BigInt("400000000000000000000000"), // 400,000 USDC
    raisedAmount: BigInt("400000000000000000000000"), // 400,000 USDC (100%)
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30天前
    endTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5天前
    hasMetFundingGoal: true,
    paymentToken: "0x3856Eee08189d63c9DBd1D415789566Cc87357f5", // mockusdc地址
  },
  "5": {
    fundingGoal: BigInt("700000000000000000000000"), // 700,000 USDC
    raisedAmount: BigInt("350000000000000000000000"), // 350,000 USDC (50%)
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 25, // 25天前
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5天后
    hasMetFundingGoal: false,
    paymentToken: "0x3856Eee08189d63c9DBd1D415789566Cc87357f5", // mockusdc地址
  }
};

// Mock project tasks data
export const mockProjectTasks: Record<string, any> = {
  // SocioShield project tasks
  "1-1": {
    title: "Develop Data Validation Smart Contract",
    description: "Develop smart contracts for the SocioShield project to validate and store social science research data. The contract needs to implement data integrity checks, researcher identity verification, and data sharing permission management functions.",
    reward: BigInt("3000000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 14 days later
    status: 0, // Open status
    requiredSkills: ["Solidity", "Smart Contracts", "Data Validation", "Permission Management"],
    estimatedHours: 80,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5,
    completedAt: 0,
  },
  "1-2": {
    title: "Develop User Interface",
    description: "Design and implement the user interface for the SocioShield platform, including researcher registration, data upload, validation process, and data browsing functions. The interface needs to be intuitive and support visualization of various research data.",
    reward: BigInt("2500000000000000000000"), // 2.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 21, // 21 days later
    status: 1, // Assigned
    requiredSkills: ["React", "Frontend Development", "Data Visualization", "Web3"],
    estimatedHours: 60,
    assignee: "0x7890123456789012345678901234567890123456",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 8,
    completedAt: 0,
  },
  "1-3": {
    title: "AI Data Analysis Module Development",
    description: "Develop an AI data analysis module for the SocioShield platform to automatically analyze uploaded social science research data, generate insights, and identify potential data biases or anomalies.",
    reward: BigInt("4000000000000000000000"), // 4 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days later
    status: 0, // Open status
    requiredSkills: ["Machine Learning", "Data Analysis", "Python", "Statistics"],
    estimatedHours: 100,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3,
    completedAt: 0,
  },

  // GenomeGuard project tasks
  "2-1": {
    title: "Zero-Knowledge Proof Implementation",
    description: "Implement a zero-knowledge proof system for the GenomeGuard platform, enabling researchers to verify specific properties of gene sequences without revealing the original genetic data. Includes circuit design, verifier implementation, and platform integration.",
    reward: BigInt("5000000000000000000000"), // 5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 25, // 25 days later
    status: 2, // In progress
    requiredSkills: ["Zero-Knowledge Proofs", "Cryptography", "Circom", "Solidity"],
    estimatedHours: 120,
    assignee: "0x8901234567890123456789012345678901234567",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15,
    completedAt: 0,
  },
  "2-2": {
    title: "Genetic Data Storage System",
    description: "Design and implement a distributed data storage system for the GenomeGuard platform, ensuring secure storage, efficient retrieval, and appropriate access control for genetic data. The system needs to encrypt sensitive data while allowing access to appropriately authorized users.",
    reward: BigInt("3500000000000000000000"), // 3.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 18, // 18 days later
    status: 0, // Open status
    requiredSkills: ["Distributed Storage", "Encryption", "Databases", "IPFS"],
    estimatedHours: 90,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10,
    completedAt: 0,
  },
  "2-3": {
    title: "Researcher Access Control System",
    description: "Develop a researcher access control system for the GenomeGuard platform, implementing fine-grained permission management based on identity, research permits, and access levels. The system needs to support temporary access authorization, usage record auditing, and access revocation functions.",
    reward: BigInt("30000000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days later
    status: 1, // Assigned
    requiredSkills: ["Access Control", "Authentication", "Security", "Auditing"],
    estimatedHours: 70,
    assignee: "0x9012345678901234567890123456789012345678",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 8,
    completedAt: 0,
  },

  // PhishZap project tasks
  "3-1": {
    title: "Wallet Activity Monitoring Module",
    description: "Develop a wallet activity monitoring module for PhishZap that can detect suspicious transactions and contract interactions in real-time. The module needs to analyze transaction patterns, target address credibility, and smart contract risk indicators, and alert when potential risks are detected.",
    reward: BigInt("4500000000000000000000"), // 4.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days later
    status: 0, // Open status
    requiredSkills: ["Blockchain Analysis", "Security", "Transaction Monitoring", "Risk Assessment"],
    estimatedHours: 85,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5,
    completedAt: 0,
  },
  "3-2": {
    title: "NLP Phishing Message Detector",
    description: "Develop a natural language processing phishing message detector for PhishZap to analyze suspicious messages in Discord, Telegram, and email. The system needs to identify phishing links, fake airdrop claims, and other common scam patterns.",
    reward: BigInt("3000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days later
    status: 2, // In progress
    requiredSkills: ["NLP", "Machine Learning", "Text Analysis", "Security"],
    estimatedHours: 75,
    assignee: "0xA123456789012345678901234567890123456789",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 12,
    completedAt: 0,
  },
  "3-3": {
    title: "Browser Extension Integration",
    description: "Integrate PhishZap functionality into a browser extension, providing real-time website security analysis, phishing link blocking, and secure transaction confirmation. The extension needs to support Chrome, Firefox, and Brave browsers.",
    reward: BigInt("2500000000000000000"), // 2.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 18, // 18 days later
    status: 1, // Assigned
    requiredSkills: ["Browser Extensions", "JavaScript", "Web Security", "UI/UX"],
    estimatedHours: 60,
    assignee: "0xB234567890123456789012345678901234567890",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7,
    completedAt: 0,
  },

  // DeFi Pulse Aggregator project tasks
  "4-1": {
    title: "Multi-Protocol Data Scraper",
    description: "Develop a multi-protocol data scraping system for DeFi Pulse Aggregator, capable of collecting and normalizing data from major DeFi platforms. The system needs to automatically adapt to API changes and handle network interruptions.",
    reward: BigInt("3500000000000000000"), // 3.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10 days later
    status: 4, // Completed
    requiredSkills: ["API Integration", "Data Scraping", "DeFi Protocols", "Node.js"],
    estimatedHours: 80,
    assignee: "0xC345678901234567890123456789012345678901",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20,
    completedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2,
  },
  "4-2": {
    title: "Yield Optimization Algorithm",
    description: "Develop a DeFi yield optimization algorithm capable of analyzing multi-platform yield opportunities and associated risks, providing personalized investment recommendations for users. The algorithm needs to consider yield rates, risk scores, historical volatility, and gas costs.",
    reward: BigInt("4000000000000000000"), // 4 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days later
    status: 2, // In progress
    requiredSkills: ["Algorithm Design", "Financial Modeling", "DeFi", "Optimization"],
    estimatedHours: 90,
    assignee: "0xD456789012345678901234567890123456789012",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15,
    completedAt: 0,
  },
  "4-3": {
    title: "Risk Assessment Dashboard",
    description: "Design and implement a risk assessment dashboard for DeFi Pulse Aggregator, providing intuitive visualization and detailed analysis of risks associated with various protocols and investment strategies. The dashboard needs to display smart contract risks, protocol historical events, and liquidity indicators.",
    reward: BigInt("3000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 12, // 12 days later
    status: 3, // Under review
    requiredSkills: ["Data Visualization", "Risk Analysis", "Frontend Development", "UI Design"],
    estimatedHours: 70,
    assignee: "0xE567890123456789012345678901234567890123",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10,
    completedAt: 0,
  },

  // NFT Governance Framework project tasks
  "5-1": {
    title: "NFT Voting Weight System",
    description: "Design and implement an NFT voting weight system that allocates governance weight based on contribution history, holding period, and participation level. The system needs to prevent attacks and power concentration while encouraging active participation in community governance.",
    reward: BigInt("4000000000000000000"), // 4 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days later
    status: 0, // Open status
    requiredSkills: ["NFT", "Governance Mechanisms", "Solidity", "Voting Systems"],
    estimatedHours: 85,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 6,
    completedAt: 0,
  },
  "5-2": {
    title: "Contribution Tracking Mechanism",
    description: "Develop a DAO contribution tracking mechanism to record and verify various contributions from community members, including code submissions, community management, content creation, and governance participation. The system will serve as the basis for NFT attributes and governance weights.",
    reward: BigInt("3500000000000000000"), // 3.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 25, // 25 days later
    status: 0, // Open status
    requiredSkills: ["DAO Governance", "Contribution Measurement", "Data Analysis", "Web3"],
    estimatedHours: 75,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5,
    completedAt: 0,
  },
  "5-3": {
    title: "Governance Dashboard Development",
    description: "Develop a comprehensive governance dashboard for NFT Governance Framework, allowing DAO members to submit proposals, participate in voting, view voting results, and track governance activities. The interface needs to be intuitive and support mobile access.",
    reward: BigInt("3000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days later
    status: 1, // Assigned
    requiredSkills: ["React", "Frontend Development", "UI/UX", "Data Visualization"],
    estimatedHours: 70,
    assignee: "0xF678901234567890123456789012345678901234",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 8,
    completedAt: 0,
  }
};

// Export task data for detailed view
export const mockTasks: Record<string, any> = {
  "1-1": {
    title: "Smart Contract Development",
    description: "Develop and test the core smart contracts for the identity verification protocol. This task requires implementing the zero-knowledge proof circuit for privacy-preserving identity verification.\n\nThe developer will be responsible for:\n- Implementing the core contracts\n- Writing comprehensive tests\n- Documentation\n- Gas optimization",
    reward: BigInt("3000000000000000000000"), // 3 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 14 days from now
    status: 0, // Open
    requiredSkills: ["Solidity", "ZKP", "Smart Contracts", "Testing"],
    estimatedHours: 60,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2 days ago
    completedAt: 0,
  },
  "1-2": {
    title: "Frontend Integration",
    description: "Build the user interface for identity management and verification. Create a seamless user experience for managing decentralized identities and presenting verifiable credentials.\n\nThe developer will be responsible for:\n- Building React components\n- Implementing Web3 connectivity\n- Creating an intuitive user flow\n- Mobile-responsive design",
    reward: BigInt("2000000000000000000000"), // 2 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 21, // 21 days from now
    status: 0, // Open
    requiredSkills: ["React", "Web3.js", "UI/UX", "Frontend"],
    estimatedHours: 50,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1 day ago
    completedAt: 0,
  },
  "2-1": {
    title: "Cross-Chain Bridge Implementation",
    description: "Implement secure bridge functionality for cross-chain liquidity transfer. Ensure atomic transactions and prevent double-spending across multiple blockchains.\n\nThe developer will be responsible for:\n- Implementing bridge contracts\n- Creating secure lock-and-mint mechanisms\n- Handling cross-chain message passing\n- Comprehensive security testing",
    reward: BigInt("5000000000000000000000"), // 5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days from now
    status: 1, // Assigned
    requiredSkills: ["Solidity", "Cross-Chain", "Bridges", "Security"],
    estimatedHours: 100,
    assignee: "0x7890123456789012345678901234567890123456",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5 days ago
    completedAt: 0,
  },
  "3-1": {
    title: "Reputation System Design",
    description: "Design and implement the reputation scoring algorithm for research contributors. Create a system that fairly evaluates contribution quality, reproducibility, and impact.\n\nThe developer will be responsible for:\n- Designing the scoring algorithm\n- Implementing the reputation contract\n- Creating anti-gaming mechanisms\n- Documentation of methodology",
    reward: BigInt("2500000000000000000000"), // 2.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days from now
    status: 0, // Open
    requiredSkills: ["Algorithm Design", "Reputation Systems", "Data Analysis"],
    estimatedHours: 70,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3 days ago
    completedAt: 0,
  },
  "4-1": {
    title: "Carbon Credit Verification Oracle",
    description: "Develop the oracle system for verifying real-world carbon credit impact. Create a trustworthy bridge between on-chain incentives and off-chain environmental impact verification.\n\nThe developer will be responsible for:\n- Designing the oracle architecture\n- Implementing data validation mechanisms\n- Creating Chainlink external adapters\n- Documentation and testing",
    reward: BigInt("3500000000000000000000"), // 3.5 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 25, // 25 days from now
    status: 0, // Open
    requiredSkills: ["Oracles", "Data Verification", "Chainlink", "Environmental Science"],
    estimatedHours: 80,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 4, // 4 days ago
    completedAt: 0,
  },
  "5-1": {
    title: "Perform Security Audit",
    description: "Conduct a comprehensive security audit of the project's smart contracts and backend systems. Identify vulnerabilities, assess risk levels, and provide remediation recommendations.\n\nThe audit should cover standard attack vectors as well as project-specific risks.\n\nDeliverables:\n- Audit report\n- Vulnerability assessment\n- Remediation recommendations\n- Follow-up verification",
    reward: BigInt("2000000000000000000000"), // 2 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days from now
    status: 0, // Open
    requiredSkills: ["Security", "Smart Contract Auditing", "Penetration Testing", "Risk Assessment"],
    estimatedHours: 80,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1 day ago
    completedAt: 0,
  }
}; 