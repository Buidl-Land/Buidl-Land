"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { useContractRead, useContractWrite } from "~~/hooks/contracts";
import { notification } from "~~/utils/scaffold-eth";
import { useAccount } from "wagmi";

// Define project data type
type ProjectData = {
  id: number;
  creator: string;
  title: string;
  description: string;
  tags: string[];
  metadata: {
    aiEvaluation: string;
    marketScore: number;
    techFeasibility: string;
    minValuation: number;
    maxValuation: number;
  };
  status: number;
  createdAt: number;
  updatedAt: number;
};

// Define funding info type
type FundingInfo = {
  fundingGoal: bigint;
  raisedAmount: bigint;
  startTime: number;
  endTime: number;
  hasMetFundingGoal: boolean;
  paymentToken: string;
};

// Define task type
type TaskInfo = {
  id: number;
  title: string;
  description: string;
  reward: bigint;
  deadline: number;
  status: number;
  skills: string[];
};

// Create simple cache objects
const projectCache: Record<string, ProjectData> = {};
const fundingCache: Record<string, FundingInfo> = {};
const taskCountCache: Record<string, number> = {};

// Mock projects data
const mockProjects: Record<string, ProjectData> = {
  "1": {
    id: 1,
    creator: "0x1E58E44a26ea3AEb68dc09dB93f9aCD1eCA7411C",
    title: "Decentralized Exchange Platform",
    description: "A next-generation decentralized exchange focusing on cross-chain swaps with minimal slippage and maximum security. The platform will introduce innovative AMM mechanisms and provide extensive liquidity options for long-tail assets.\n\nKey features:\n- Cross-chain trading without wrapping\n- Dynamic fee structure to optimize for different market conditions\n- Advanced trading tools including limit orders and stop losses\n- Community governance for protocol decisions\n- Liquidity provider incentives that minimize impermanent loss",
    tags: ["DeFi", "Exchange", "Cross-chain"],
    metadata: {
      aiEvaluation: "Strong market potential with innovative AMM approach",
      marketScore: 8,
      techFeasibility: "High",
      minValuation: 3000000,
      maxValuation: 5000000,
    },
    status: 0,
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30 days ago
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2 days ago
  },
  "2": {
    id: 2,
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    title: "NFT Marketplace for Digital Art",
    description: "A curated NFT marketplace focused on high-quality digital art with built-in creator royalties and fractional ownership. The platform will provide tools for artists to easily mint collections and for collectors to discover unique pieces.\n\nKey features:\n- Curation mechanism to maintain high-quality listings\n- Built-in royalty enforcement for secondary sales\n- Fractional ownership of high-value pieces\n- Social features for community building\n- Integration with VR/AR for immersive art experiences",
    tags: ["NFT", "Art", "Marketplace"],
    metadata: {
      aiEvaluation: "Differentiated offering in saturated market",
      marketScore: 7,
      techFeasibility: "Medium",
      minValuation: 2000000,
      maxValuation: 4000000,
    },
    status: 0,
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 45, // 45 days ago
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5 days ago
  },
  "3": {
    id: 3,
    creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    title: "DeFi Lending Protocol",
    description: "An innovative lending protocol that introduces capital-efficient loans with dynamic interest rates based on market conditions. The platform will support multiple collateral types and offer unique liquidation mechanisms.\n\nKey features:\n- Risk-based interest rates for improved capital efficiency\n- Multiple collateral options including LP tokens and NFTs\n- Flash loans for sophisticated DeFi operations\n- Graceful liquidation mechanisms to protect borrowers\n- Interest rate derivatives for hedging",
    tags: ["DeFi", "Lending", "Interest Rates"],
    metadata: {
      aiEvaluation: "Robust technical architecture with novel liquidation approach",
      marketScore: 9,
      techFeasibility: "High",
      minValuation: 4000000,
      maxValuation: 7000000,
    },
    status: 0,
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20 days ago
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1 day ago
  },
  "4": {
    id: 4,
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "DAO Governance Framework",
    description: "A comprehensive DAO framework focused on efficient governance while maintaining decentralization. The system introduces novel voting mechanisms and delegation systems to improve participation.\n\nKey features:\n- Quadratic voting to prevent plutocracy\n- Delegation with conditional withdrawal\n- Proposal templates for common governance actions\n- On-chain/off-chain hybrid governance for gas efficiency\n- Reputation system to reward participation",
    tags: ["DAO", "Governance", "Voting"],
    metadata: {
      aiEvaluation: "Addresses core governance challenges in existing DAOs",
      marketScore: 8,
      techFeasibility: "Medium-High",
      minValuation: 3500000,
      maxValuation: 6000000,
    },
    status: 1,
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 60, // 60 days ago
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10 days ago
  },
  "5": {
    id: 5,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    title: "Cross-Chain Bridge Solution",
    description: "A secure and efficient cross-chain bridge for transferring assets between multiple blockchain networks with minimal trust assumptions and fast finality.\n\nKey features:\n- Multi-party computation for secure asset transfers\n- Support for 10+ major blockchain networks\n- Fast finality with optimistic confirmation\n- Economically secured validator set\n- MEV-resistant design",
    tags: ["Infrastructure", "Bridge", "Cross-chain"],
    metadata: {
      aiEvaluation: "Critical infrastructure with strong security model",
      marketScore: 9,
      techFeasibility: "High",
      minValuation: 5000000,
      maxValuation: 9000000,
    },
    status: 0,
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15 days ago
    updatedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3 days ago
  },
};

// Mock funding info
const mockFundingInfo: Record<string, FundingInfo> = {
  "1": {
    fundingGoal: BigInt("5000000000000000000000"), // 5000 USDC
    raisedAmount: BigInt("3200000000000000000000"), // 3200 USDC
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20 days ago
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10 days from now
    hasMetFundingGoal: false,
    paymentToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
  },
  "2": {
    fundingGoal: BigInt("3000000000000000000000"), // 3000 USDC
    raisedAmount: BigInt("1800000000000000000000"), // 1800 USDC
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30 days ago
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days from now
    hasMetFundingGoal: false,
    paymentToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
  },
  "3": {
    fundingGoal: BigInt("7000000000000000000000"), // 7000 USDC
    raisedAmount: BigInt("7500000000000000000000"), // 7500 USDC
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15 days ago
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5 days from now
    hasMetFundingGoal: true,
    paymentToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
  },
  "4": {
    fundingGoal: BigInt("6000000000000000000000"), // 6000 USDC
    raisedAmount: BigInt("6000000000000000000000"), // 6000 USDC
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 45, // 45 days ago
    endTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15 days ago
    hasMetFundingGoal: true,
    paymentToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
  },
  "5": {
    fundingGoal: BigInt("9000000000000000000000"), // 9000 USDC
    raisedAmount: BigInt("4500000000000000000000"), // 4500 USDC
    startTime: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10 days ago
    endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days from now
    hasMetFundingGoal: false,
    paymentToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
  },
};

// Mock task counts
const mockTaskCounts: Record<string, number> = {
  "1": 2,
  "2": 1,
  "3": 1,
  "4": 1,
  "5": 1,
};

// Mock tasks data
const mockProjectTasks: Record<string, TaskInfo[]> = {
  "1": [
    {
      id: 0,
      title: "Implement Smart Contract for Token Distribution",
      description: "Develop and deploy a smart contract that handles token distribution according to the project's tokenomics model.",
      reward: BigInt("1000000000000000000"), // 1 USDC
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 14 days from now
      status: 0, // Open
      skills: ["Solidity", "Smart Contracts", "Web3", "Testing"],
    },
    {
      id: 1,
      title: "Design UI Components for Funding Dashboard",
      description: "Create reusable UI components for the project funding dashboard.",
      reward: BigInt("800000000000000000"), // 0.8 USDC
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days from now
      status: 1, // Assigned
      skills: ["React", "UI/UX", "Next.js", "Tailwind"],
    },
  ],
  "2": [
    {
      id: 0,
      title: "Develop API for Market Data Integration",
      description: "Create a robust API for integrating market data from various sources.",
      reward: BigInt("1200000000000000000"), // 1.2 USDC
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10 days from now
      status: 2, // In Progress
      skills: ["Node.js", "API Development", "Data Processing", "Testing"],
    },
  ],
  "3": [
    {
      id: 0,
      title: "Implement Voting Mechanism for DAO",
      description: "Develop a decentralized voting mechanism for the project's DAO.",
      reward: BigInt("1500000000000000000"), // 1.5 USDC
      deadline: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3 days ago (past deadline)
      status: 3, // Completed
      skills: ["Solidity", "DAO", "Governance", "Web3"],
    },
  ],
  "4": [
    {
      id: 0,
      title: "Create Technical Documentation",
      description: "Develop comprehensive technical documentation for the project.",
      reward: BigInt("700000000000000000"), // 0.7 USDC
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5 days from now
      status: 4, // Verified
      skills: ["Technical Writing", "Documentation", "Diagrams", "Developer Experience"],
    },
  ],
  "5": [
    {
      id: 0,
      title: "Perform Security Audit",
      description: "Conduct a comprehensive security audit of the project's smart contracts and backend systems.",
      reward: BigInt("2000000000000000000"), // 2 USDC
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days from now
      status: 0, // Open
      skills: ["Security", "Smart Contract Auditing", "Penetration Testing", "Risk Assessment"],
    },
  ],
};

// Parse project data from contract response
const parseProjectData = (data: any[]): ProjectData => {
  return {
    id: Number(data[0]),
    creator: data[1],
    title: data[2],
    description: data[3],
    tags: data[4],
    metadata: {
      aiEvaluation: data[5].aiEvaluation,
      marketScore: Number(data[5].marketScore),
      techFeasibility: data[5].techFeasibility,
      minValuation: Number(data[5].minValuation),
      maxValuation: Number(data[5].maxValuation),
    },
    status: Number(data[6]),
    createdAt: Number(data[7]),
    updatedAt: Number(data[8]),
  };
};

// Parse funding info from contract response
const parseFundingInfo = (data: any[]): FundingInfo => {
  return {
    fundingGoal: data[0],
    raisedAmount: data[1],
    startTime: Number(data[2]),
    endTime: Number(data[3]),
    hasMetFundingGoal: data[4],
    paymentToken: data[5],
  };
};

// Format amount, convert wei to ETH
const formatAmount = (amount: bigint): string => {
  const ethAmount = Number(amount) / 1e18;
  return ethAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Convert ETH to wei
const parseAmount = (amount: string): bigint => {
  try {
    // Convert ETH amount to wei (1 ETH = 10^18 wei)
    const ethAmount = parseFloat(amount);
    if (isNaN(ethAmount) || ethAmount <= 0) {
      throw new Error("Please enter a valid amount");
    }
    return BigInt(Math.floor(ethAmount * 1e18));
  } catch (error) {
    throw new Error("Invalid amount format");
  }
};

// Project status mapping
const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Active", color: "bg-green-100 text-green-800" },
  1: { label: "Completed", color: "bg-blue-100 text-blue-800" },
  2: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

// Task status mapping
const taskStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Open", color: "bg-secondary text-white" },
  1: { label: "Assigned", color: "bg-primary text-white" },
  2: { label: "In Progress", color: "bg-info text-white" },
  3: { label: "Completed", color: "bg-warning text-white" },
  4: { label: "Verified", color: "bg-success text-white" },
  5: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

type TabType = "details" | "roadmap" | "tasks";

export function ProjectDetailsClient({ projectId }: { projectId: string }) {
  const numericProjectId = parseInt(projectId);
  const { readMethod, isLoading } = useContractRead();
  const { writeMethod } = useContractWrite();
  const { address } = useAccount();
  const [project, setProject] = useState<ProjectData | null>(() => projectCache[projectId] || null);
  const [fundingInfo, setFundingInfo] = useState<FundingInfo | null>(() => fundingCache[projectId] || null);
  const [taskCount, setTaskCount] = useState<number | null>(() => taskCountCache[projectId] || null);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Contribution related state
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);

  // Task related state
  const [projectTasks, setProjectTasks] = useState<TaskInfo[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Token claim related state
  const [claimedAmount, setClaimedAmount] = useState<bigint>(0n);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoadingClaimData, setIsLoadingClaimData] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [tokenContribution, setTokenContribution] = useState<bigint>(0n);
  const [tokenInfo, setTokenInfo] = useState<{
    tokenAddress: string;
    totalSupply: bigint;
    crowdfundingPool: bigint;
    teamPool: bigint;
    ecosystemPool: bigint;
    vestingStart: number;
    vestingDuration: number;
  } | null>(null);
  const [unlockedAmount, setUnlockedAmount] = useState<bigint>(0n);
  const [unlockPercentage, setUnlockPercentage] = useState<number>(0);

  // Refresh funding info
  const refreshFundingInfo = async () => {
    try {
      const fundingResult = await readMethod("getFundingInfo", [numericProjectId]);

      if (fundingResult) {
        const parsedFunding = parseFundingInfo(fundingResult as any[]);

        // Update cache
        fundingCache[projectId] = parsedFunding;

        setFundingInfo(parsedFunding);
      }
    } catch (err) {
      console.error("Failed to fetch funding info:", err);
    }
  };

  // Handle contribution submission
  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      notification.error("Please enter a valid amount");
      return;
    }

    try {
      setIsContributing(true);

      // Convert ETH to wei
      const amountInWei = parseAmount(contributionAmount);

      // Show loading notification
      const notificationId = notification.loading("Processing your contribution transaction...");

      // Call contract method
      const result = await writeMethod("contribute", [numericProjectId, amountInWei], {
        onSuccess: (txHash) => {
          // Remove loading notification
          notification.remove(notificationId);

          // Show success notification
          notification.success(
            <div>
              <p>Contribution successful!</p>
              <p className="text-xs mt-1">Transaction hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
            </div>,
            { duration: 5000 }
          );

          // Clear input
          setContributionAmount("");

          // Refresh funding info
          setTimeout(() => {
            refreshFundingInfo();
          }, 2000);
        },
        onError: (error) => {
          // Remove loading notification
          notification.remove(notificationId);

          // Show error notification
          notification.error(`Contribution failed: ${error.message}`);
        }
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Contribution failed:", error);
      notification.error(`Contribution failed: ${error.message}`);
    } finally {
      setIsContributing(false);
    }
  };

  // Fetch project tasks
  const fetchProjectTasks = async () => {
    if (taskCount && taskCount > 0) {
      setIsLoadingTasks(true);
      try {
        const tasks: TaskInfo[] = [];
        // Fetch each task by ID, starting from 0
        for (let i = 0; i < taskCount; i++) {
          try {
            const taskResult = await readMethod("getTask", [numericProjectId, i]);
            if (taskResult) {
              tasks.push({
                id: i,
                title: taskResult[0],
                description: taskResult[1],
                reward: taskResult[2],
                deadline: Number(taskResult[3]),
                status: Number(taskResult[4]),
                skills: taskResult[5],
              });
            }
          } catch (err) {
            console.error(`Failed to fetch task ${i}:`, err);
          }
        }
        setProjectTasks(tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setIsLoadingTasks(false);
      }
    }
  };

  // Handle token claim
  const handleClaimTokens = async () => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      setIsClaiming(true);

      // Show loading notification
      const notificationId = notification.loading("Processing your token claim transaction...");

      // Call contract method
      const result = await writeMethod("claimTokens", [numericProjectId], {
        onSuccess: (txHash) => {
          // Remove loading notification
          notification.remove(notificationId);

          // Show success notification
          notification.success(
            <div>
              <p>Tokens claimed successfully!</p>
              <p className="text-xs mt-1">Transaction hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
            </div>,
            { duration: 5000 }
          );

          // Refresh claim data
          setTimeout(() => {
            fetchClaimData();
          }, 2000);
        },
        onError: (error) => {
          // Remove loading notification
          notification.remove(notificationId);

          // Show error notification
          notification.error(`Token claim failed: ${error.message}`);
        }
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Token claim failed:", error);
      notification.error(`Token claim failed: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  // Fetch claim data
  const fetchClaimData = async () => {
    if (!address || !fundingInfo) return;

    setIsLoadingClaimData(true);
    try {
      // Get claimed amount
      const claimedResult = await readMethod("getClaimedAmount", [numericProjectId, address]);
      if (claimedResult !== null) {
        setClaimedAmount(BigInt(claimedResult.toString()));
      }

      // Get token contribution
      const contributionResult = await readMethod("getTokenContribution", [numericProjectId, address]);
      if (contributionResult !== null) {
        setTokenContribution(BigInt(contributionResult.toString()));
      }

      // Get project token info
      const tokenInfoResult = await readMethod("getProjectToken", [numericProjectId]);
      if (tokenInfoResult) {
        const parsedTokenInfo = {
          tokenAddress: tokenInfoResult[0],
          totalSupply: BigInt(tokenInfoResult[1].toString()),
          crowdfundingPool: BigInt(tokenInfoResult[2].toString()),
          teamPool: BigInt(tokenInfoResult[3].toString()),
          ecosystemPool: BigInt(tokenInfoResult[4].toString()),
          vestingStart: Number(tokenInfoResult[5]),
          vestingDuration: Number(tokenInfoResult[6]),
        };
        setTokenInfo(parsedTokenInfo);

        // Calculate unlocked amount based on vesting schedule
        if (tokenContribution > 0n && parsedTokenInfo.vestingStart > 0) {
          const now = Math.floor(Date.now() / 1000);
          const vestingEnd = parsedTokenInfo.vestingStart + parsedTokenInfo.vestingDuration;

          if (now >= vestingEnd) {
            // Fully vested
            setUnlockedAmount(tokenContribution);
            setUnlockPercentage(100);
          } else if (now <= parsedTokenInfo.vestingStart) {
            // Vesting not started
            setUnlockedAmount(0n);
            setUnlockPercentage(0);
          } else {
            // Partially vested - linear vesting
            const timeElapsed = now - parsedTokenInfo.vestingStart;
            const vestingProgress = timeElapsed / parsedTokenInfo.vestingDuration;
            const percentage = Math.min(100, Math.floor(vestingProgress * 100));

            setUnlockPercentage(percentage);
            setUnlockedAmount(tokenContribution * BigInt(percentage) / BigInt(100));
          }
        }
      }

      // Check if funding is complete and tokens can be claimed
      const now = new Date();
      const endDate = new Date(fundingInfo.endTime * 1000);
      const isFundingComplete = fundingInfo.hasMetFundingGoal || now > endDate;

      // Can claim if funding is complete, user has tokens, and there are unlocked tokens not yet claimed
      setCanClaim(isFundingComplete && tokenContribution > 0n && unlockedAmount > claimedAmount);
    } catch (err) {
      console.error("Failed to fetch claim data:", err);
    } finally {
      setIsLoadingClaimData(false);
    }
  };

  // Fetch project data
  useEffect(() => {
    // If we already have cached data, use it
    if (projectCache[projectId]) {
      setProject(projectCache[projectId]);
    }

    if (fundingCache[projectId]) {
      setFundingInfo(fundingCache[projectId]);
    }

    if (taskCountCache[projectId]) {
      setTaskCount(taskCountCache[projectId]);
    }

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch project data
        if (!project) {
          const projectResult = await readMethod("getProject", [numericProjectId]);

          if (projectResult) {
            const parsedProject = parseProjectData(projectResult as any[]);

            // Update cache
            projectCache[projectId] = parsedProject;

            setProject(parsedProject);
          }
        }

        // Fetch funding info
        if (!fundingInfo) {
          const fundingResult = await readMethod("getFundingInfo", [numericProjectId]);

          if (fundingResult) {
            const parsedFunding = parseFundingInfo(fundingResult as any[]);

            // Update cache
            fundingCache[projectId] = parsedFunding;

            setFundingInfo(parsedFunding);
          }
        }

        // Fetch task count
        if (taskCount === null) {
          const taskCountResult = await readMethod("getProjectTaskCount", [numericProjectId]);

          if (taskCountResult !== null && taskCountResult !== undefined) {
            const count = Number(taskCountResult);

            // Update cache
            taskCountCache[projectId] = count;

            setTaskCount(count);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [readMethod, projectId, numericProjectId, isLoading, project, fundingInfo, taskCount]);

  // Fetch tasks when active tab is "tasks"
  useEffect(() => {
    if (activeTab === "tasks" && taskCount && projectTasks.length === 0 && !isLoadingTasks) {
      fetchProjectTasks();
    }
  }, [activeTab, taskCount, projectTasks.length, isLoadingTasks]);

  // Fetch claim data when funding info is available
  useEffect(() => {
    if (fundingInfo && address && !isLoadingData) {
      fetchClaimData();
    }
  }, [fundingInfo, address, isLoadingData]);

  if (isLoading || isLoadingData || !project) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-8 animate-pulse">
        <div className="h-10 bg-base-200 dark:bg-base-300/50 rounded-lg w-1/3 mb-8"></div>
        <div className="h-6 bg-base-200 dark:bg-base-300/50 rounded-lg w-1/4 mb-8"></div>
        <div className="h-40 bg-base-200 dark:bg-base-300/50 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-60 bg-base-200 dark:bg-base-300/50 rounded-lg lg:col-span-2"></div>
          <div className="h-60 bg-base-200 dark:bg-base-300/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Calculate funding progress and days left
  let fundingProgress = 0;
  let daysLeft = 0;
  let isFundingClosed = false;

  if (fundingInfo) {
    // Calculate funding progress percentage
    fundingProgress = fundingInfo.fundingGoal > 0n
      ? Number((fundingInfo.raisedAmount * 100n) / fundingInfo.fundingGoal)
      : 0;

    // Calculate days left
    const now = new Date();
    const endDate = new Date(fundingInfo.endTime * 1000);
    daysLeft = Math.max(0, differenceInDays(endDate, now));

    // Determine if funding is closed
    isFundingClosed = fundingInfo.hasMetFundingGoal || now > endDate;
  }

  const status = statusMap[project.status] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
  const createdTime = formatDistanceToNow(new Date(project.createdAt * 1000), { addSuffix: true });

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 mt-4 sm:pt-28 sm:mt-6">
      {/* Project title and status */}
      <div className="p-6 mb-8 rounded-2xl shadow-lg bg-base-100 dark:bg-base-200 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/40 before:via-secondary/40 before:to-accent/40 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
        {/* Add aurora effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-xl opacity-70 animate-pulse dark:opacity-40"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-accent/10 via-primary/10 to-secondary/10 rounded-full blur-xl opacity-60 animate-pulse dark:opacity-30" style={{ animationDelay: "2s" }}></div>

        <div className="relative z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3 sm:gap-2 sm:mb-4">
            {project.tags.map((tag, index) => (
              <span key={index} className="badge badge-primary badge-sm sm:badge-md bg-primary/10 border-0 text-primary">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">{project.title}</h1>
              <p className="flex flex-wrap items-center gap-2 text-base-content/70 dark:text-base-content/70 text-sm">
                <span>Created {createdTime}</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center">
                  Created by <span className="ml-1 px-2 py-0.5 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary/10 dark:hover:bg-primary/20">agent@IdeaPlusesAI</span>
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              {taskCount !== null && (
                <span className="badge badge-outline badge-secondary">
                  {taskCount} Tasks
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="tabs tabs-boxed mb-8">
        <button
          className={`tab ${activeTab === "details" ? "tab-active text-base-content dark:text-base-content" : "text-base-content/70 dark:text-base-content/70"}`}
          onClick={() => setActiveTab("details")}
        >
          Project Details
        </button>
        <button
          className={`tab ${activeTab === "roadmap" ? "tab-active text-base-content dark:text-base-content" : "text-base-content/70 dark:text-base-content/70"}`}
          onClick={() => setActiveTab("roadmap")}
        >
          Roadmap
        </button>
        <button
          className={`tab ${activeTab === "tasks" ? "tab-active text-base-content dark:text-base-content" : "text-base-content/70 dark:text-base-content/70"}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks ({taskCount || 0})
        </button>
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2">
          {activeTab === "details" && (
            <>
              <div className="p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
                <div className="relative z-10">
                  <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4 text-base-content dark:text-base-content">
                    <span className="material-icons text-primary text-sm align-text-bottom mr-1">description</span>
                    Project Description
                  </h2>
                  <div className="whitespace-pre-line text-sm sm:text-base text-base-content/80 dark:text-base-content/70">{project.description}</div>

                  <h3 className="mt-8 mb-3 text-base font-bold sm:text-lg sm:mb-4 text-base-content dark:text-base-content">
                    <span className="material-icons text-primary text-sm align-text-bottom mr-1">psychology</span>
                    AI Evaluation
                  </h3>
                  <div className="p-4 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50 dark:border-base-300/20">
                    <p className="text-sm sm:text-base italic text-base-content/70 dark:text-base-content/60">{project.metadata.aiEvaluation}</p>
                  </div>
                </div>
              </div>

              {/* Move Project Tokens card here */}
              {fundingInfo && address && (
                <div className="mt-8 p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
                  {/* Add aurora effect */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-xl opacity-60 animate-pulse dark:opacity-30"></div>

                  <div className="relative z-10">
                    <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                      <span className="material-icons text-primary text-sm align-text-bottom mr-1">token</span>
                      Project Tokens
                    </h2>

                    {isLoadingClaimData ? (
                      <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                      </div>
                    ) : (
                      <>
                        {tokenInfo && (
                          <div className="mb-4">
                            <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm mb-2">Token Allocation</p>
                            <div className="w-full bg-base-200 dark:bg-base-300/50 rounded-full h-4 mb-2">
                              <div className="flex h-4 rounded-full overflow-hidden">
                                <div
                                  className="bg-primary h-4"
                                  style={{ width: "60%" }}
                                  title="Crowdfunding Pool (60%)"
                                ></div>
                                <div
                                  className="bg-secondary h-4"
                                  style={{ width: "25%" }}
                                  title="Task & DAO Pool (25%)"
                                ></div>
                                <div
                                  className="bg-accent h-4"
                                  style={{ width: "15%" }}
                                  title="Ecosystem Pool (15%)"
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-base-content/70 dark:text-base-content/70">
                              <span>Crowdfunding: 60%</span>
                              <span>Task & DAO: 25%</span>
                              <span>Ecosystem: 15%</span>
                            </div>
                            <div className="p-3 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50 dark:border-base-300/20 mt-4">
                              <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">
                                <span className="material-icons text-primary text-xs align-text-bottom mr-1">inventory_2</span>
                                Total Supply
                              </p>
                              <p className="mt-1 text-base font-semibold sm:text-lg text-base-content dark:text-base-content">{formatAmount(tokenInfo.totalSupply)} Tokens</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4 mt-4">
                          {tokenContribution > 0n ? (
                            <>
                              <div className="p-3 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50">
                                <p className="text-xs opacity-70 sm:text-sm">
                                  <span className="material-icons text-primary text-xs align-text-bottom mr-1">account_balance_wallet</span>
                                  Your Token Allocation
                                </p>
                                <p className="mt-1 text-base font-semibold sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                  {formatAmount(tokenContribution)} Tokens
                                </p>
                              </div>

                              {tokenInfo && tokenInfo.vestingDuration > 0 && (
                                <div className="mt-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs opacity-70 sm:text-sm">
                                      <span className="material-icons text-primary text-xs align-text-bottom mr-1">lock_open</span>
                                      Unlock Progress
                                    </p>
                                    <span className="text-xs font-medium">{unlockPercentage}%</span>
                                  </div>
                                  <div className="w-full bg-base-200 dark:bg-base-300/50 rounded-full h-2.5">
                                    <div
                                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                      style={{ width: `${unlockPercentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-xs opacity-70 mt-1">
                                    <span>Unlocked: {formatAmount(unlockedAmount)}</span>
                                    <span>Total: {formatAmount(tokenContribution)}</span>
                                  </div>
                                  <p className="text-xs opacity-60 mt-2 italic">
                                    Tokens unlock linearly over 180 days
                                  </p>
                                </div>
                              )}

                              {claimedAmount > 0n && (
                                <div className="p-3 rounded-lg bg-success/10 dark:bg-success/5 border border-success/20">
                                  <p className="text-xs opacity-70 sm:text-sm">
                                    <span className="material-icons text-success text-xs align-text-bottom mr-1">check_circle</span>
                                    Already Claimed
                                  </p>
                                  <p className="mt-1 text-base font-semibold sm:text-lg text-success">{formatAmount(claimedAmount)} Tokens</p>
                                </div>
                              )}

                              <div className="mt-4">
                                <button
                                  className={`btn btn-primary w-full btn-sm sm:btn-md ${isClaiming ? 'loading' : ''} ${!canClaim ? 'btn-disabled' : ''}`}
                                  onClick={handleClaimTokens}
                                  disabled={isClaiming || !canClaim}
                                >
                                  {isClaiming ? (
                                    <>
                                      <span className="loading loading-spinner loading-xs"></span>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <span className="material-icons text-sm align-text-bottom mr-1">redeem</span>
                                      Claim Tokens
                                    </>
                                  )}
                                </button>

                                {!canClaim && tokenContribution > 0n && (
                                  <p className="text-xs text-center mt-2 opacity-60 italic">
                                    {claimedAmount >= tokenContribution
                                      ? 'You have already claimed all your tokens'
                                      : unlockedAmount <= claimedAmount
                                        ? 'No tokens available for claiming yet'
                                        : 'Tokens not yet available for claiming'}
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm opacity-70 italic">You have not contributed to this project yet</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "roadmap" && (
            <div className="p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
              <div className="relative z-10">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4 text-base-content dark:text-base-content">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">map</span>
                  Project Roadmap
                </h2>

                <div className="p-6 text-center opacity-70 italic">
                  <span className="material-icons text-4xl mb-2">timeline</span>
                  <p>Roadmap data is not yet available from the contract. This section will display the project&apos;s development plan and milestones.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
              <div className="relative z-10">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4 text-base-content dark:text-base-content">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">assignment</span>
                  Project Tasks
                </h2>

                {isLoadingTasks ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : taskCount && taskCount > 0 ? (
                  <div className="mt-4 space-y-4">
                    {projectTasks.map(task => {
                      const statusStyle = taskStatusMap[task.status]?.color || "bg-base-200 text-base-content";
                      const statusLabel = taskStatusMap[task.status]?.label || "Unknown";

                      return (
                        <div key={task.id} className="p-4 rounded-lg bg-base-200/50 hover:bg-base-200/70 dark:bg-base-300/30 dark:hover:bg-base-300/40 border border-base-300/50 dark:border-base-300/20 transition-all">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base font-semibold sm:text-lg">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle} border-0`}>
                              {statusLabel}
                            </span>
                          </div>
                          <p className="mt-2 text-sm opacity-70 line-clamp-2">{task.description}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {task.skills.slice(0, 3).map((skill: string, index: number) => (
                              <span key={index} className="badge badge-sm bg-primary/10 border-0 text-primary">
                                {skill}
                              </span>
                            ))}
                            {task.skills.length > 3 && (
                              <span className="badge badge-sm bg-base-300/80 border-0">+{task.skills.length - 3} more</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <span className="material-icons text-primary text-sm mr-1">payments</span>
                              <span className="text-sm font-medium">{formatAmount(task.reward)} USDC</span>
                            </div>
                            <a
                              href={`/projects/${projectId}/tasks/${task.id}`}
                              className="btn btn-primary btn-sm sm:btn-md h-10 min-h-10"
                            >
                              <span className="material-icons text-xs mr-1">visibility</span>
                              View Details
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center opacity-70 italic">
                    <span className="material-icons text-4xl mb-2">assignment_late</span>
                    <p>This project has no tasks yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Funding info card */}
          {fundingInfo && (
            <div className="p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
              {/* Add aurora effect */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-xl opacity-60 animate-pulse dark:opacity-30"></div>

              <div className="relative z-10">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4 text-base-content dark:text-base-content">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">payments</span>
                  Funding Information
                </h2>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">Funding Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-base-content dark:text-base-content">{daysLeft} days{daysLeft > 0 ? " remaining" : " ended"}</span>
                    {isFundingClosed && (
                      <span className="badge badge-sm badge-success text-xs border-0">Funding Completed</span>
                    )}
                  </div>
                </div>

                <div className="w-full bg-base-200 dark:bg-base-300/50 rounded-full h-2.5 mb-2 sm:h-3">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 sm:h-3"
                    style={{ width: `${Math.min(100, fundingProgress)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs sm:text-sm mb-4">
                  <span className="font-medium text-base-content dark:text-base-content">{formatAmount(fundingInfo.raisedAmount)} USDC</span>
                  <span className="text-base-content/70 dark:text-base-content/70">Goal: {formatAmount(fundingInfo.fundingGoal)} USDC</span>
                </div>

                <div className="p-3 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50 dark:border-base-300/20 mb-4">
                  <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">trending_up</span>
                    Funding Status
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">
                    {fundingProgress >= 100 ? (
                      <span className="text-success">Funding Goal Achieved!</span>
                    ) : (
                      <span className="text-base-content dark:text-base-content">Completed {fundingProgress.toFixed(1)}%</span>
                    )}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="form-control">
                    <label className="flex justify-between mb-2">
                      <span className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">Contribution Amount (USDC)</span>
                      {isFundingClosed && (
                        <span className="text-xs text-error">Funding Completed</span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="0.1"
                        className="input input-bordered input-sm sm:input-md w-full"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        disabled={isContributing || isFundingClosed}
                        min="0"
                        step="0.01"
                      />
                      <button
                        className={`btn btn-sm sm:btn-md ${isFundingClosed ? 'btn-disabled' : 'btn-primary'} ${isContributing ? 'loading' : ''}`}
                        onClick={handleContribute}
                        disabled={isContributing || isFundingClosed || !contributionAmount || parseFloat(contributionAmount) <= 0}
                      >
                        {isContributing ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="material-icons text-sm align-text-bottom mr-1">send</span>
                            Contribute
                          </>
                        )}
                      </button>
                    </div>
                    <label className="label">
                      <span className="text-xs text-base-content/60 dark:text-base-content/60">Minimum Amount: 0.01 USDC</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project evaluation card */}
          <div className="p-4 shadow-lg card bg-base-100 dark:bg-base-200 sm:p-6 relative overflow-hidden border border-base-200 dark:border-base-300 before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-base-100 after:to-base-100 dark:after:from-base-200 dark:after:to-base-200 after:-z-10">
            {/* Add aurora effect */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-xl opacity-60 animate-pulse dark:opacity-30"></div>

            <div className="relative z-10">
              <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4 text-base-content dark:text-base-content">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">analytics</span>
                Project Evaluation
              </h2>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">Market Score</p>
                  <div className="flex items-center mt-1">
                    <div className="rating rating-sm">
                      {[...Array(10)].map((_, i) => (
                        <input
                          key={i}
                          type="radio"
                          name="rating-2"
                          title={`Rating ${i+1}`}
                          className={`mask mask-star-2 ${i < project.metadata.marketScore ? 'bg-primary' : 'bg-base-300 dark:bg-base-content/20'}`}
                          disabled
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-base font-semibold sm:text-lg text-base-content dark:text-base-content">{project.metadata.marketScore}/10</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50 dark:border-base-300/20">
                  <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">build</span>
                    Technical Feasibility
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg text-base-content dark:text-base-content">{project.metadata.techFeasibility}</p>
                </div>

                <div className="p-3 rounded-lg bg-base-200/50 dark:bg-base-300/30 border border-base-300/50 dark:border-base-300/20">
                  <p className="text-xs text-base-content/70 dark:text-base-content/70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">attach_money</span>
                    Valuation Range
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    ${(project.metadata.minValuation / 1000).toFixed(1)}K - ${(project.metadata.maxValuation / 1000).toFixed(1)}K
                  </p>
                </div>

                <div className="text-xs italic text-base-content/60 dark:text-base-content/50 sm:text-sm">
                  AI-powered evaluation based on market trends, technical complexity, and potential ROI.
                </div>
              </div>
            </div>
          </div>

          {/* Task info card */}
          {taskCount !== null && taskCount > 0 && (
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <h2 className="card-title">Task Information</h2>
                <p className="text-sm">This project has <strong>{taskCount}</strong> available tasks</p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-outline btn-secondary"
                    onClick={() => setActiveTab("tasks")}
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}