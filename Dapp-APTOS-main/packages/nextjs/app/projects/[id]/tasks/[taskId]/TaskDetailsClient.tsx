"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { notification } from "~~/utils/scaffold-eth";

// Define task data type
type TaskData = {
  title: string;
  description: string;
  reward: bigint;
  deadline: number;
  status: number;
  requiredSkills: string[];
  estimatedHours: number;
  assignee: string;
  createdAt: number;
  completedAt: number;
};

// Define project data type for context
type ProjectData = {
  id: number;
  title: string;
  creator: string;
};

// Mock data for tasks
const mockTasks: Record<string, TaskData> = {
  "1-1": {
    title: "Implement Smart Contract for Token Distribution",
    description: "Develop and deploy a smart contract that handles token distribution according to the project's tokenomics model. The contract should include vesting schedules for different stakeholder groups, support for token claiming, and appropriate access controls.\n\nThe implementation should follow best security practices and be thoroughly tested with unit and integration tests. Documentation for the contract should be clear and comprehensive.\n\nDeliverables:\n- Smart contract code\n- Deployment scripts\n- Test suite\n- Technical documentation",
    reward: BigInt("1000000000000000000"), // 1 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 14 days from now
    status: 0, // Open
    requiredSkills: ["Solidity", "Smart Contracts", "Web3", "Testing"],
    estimatedHours: 40,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2 days ago
    completedAt: 0,
  },
  "1-2": {
    title: "Design UI Components for Funding Dashboard",
    description: "Create reusable UI components for the project funding dashboard. The components should be responsive, accessible, and follow the project's design system.\n\nThe dashboard should display funding progress, investor information, and project updates in an intuitive way.\n\nDeliverables:\n- Component library\n- Responsive designs\n- Interactive prototypes\n- Implementation in React/Next.js",
    reward: BigInt("800000000000000000"), // 0.8 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days from now
    status: 1, // Assigned
    requiredSkills: ["React", "UI/UX", "Next.js", "Tailwind"],
    estimatedHours: 30,
    assignee: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5 days ago
    completedAt: 0,
  },
  "2-1": {
    title: "Develop API for Market Data Integration",
    description: "Create a robust API for integrating market data from various sources. The API should support real-time price feeds, historical data queries, and market sentiment analysis.\n\nThe implementation should be scalable, fault-tolerant, and have comprehensive error handling.\n\nDeliverables:\n- API code\n- Documentation\n- Test suite\n- Deployment instructions",
    reward: BigInt("1200000000000000000"), // 1.2 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10 days from now
    status: 2, // In Progress
    requiredSkills: ["Node.js", "API Development", "Data Processing", "Testing"],
    estimatedHours: 50,
    assignee: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10 days ago
    completedAt: 0,
  },
  "3-1": {
    title: "Implement Voting Mechanism for DAO",
    description: "Develop a decentralized voting mechanism for the project's DAO. The system should support proposal creation, secure voting, and result tallying.\n\nThe implementation should be gas-efficient and include protection against common attack vectors.\n\nDeliverables:\n- Smart contract code\n- Frontend integration\n- Test suite\n- User documentation",
    reward: BigInt("1500000000000000000"), // 1.5 USDC
    deadline: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3 days ago (past deadline)
    status: 3, // Completed
    requiredSkills: ["Solidity", "DAO", "Governance", "Web3"],
    estimatedHours: 60,
    assignee: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20 days ago
    completedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1 day ago
  },
  "4-1": {
    title: "Create Technical Documentation",
    description: "Develop comprehensive technical documentation for the project. The documentation should cover architecture, APIs, deployment procedures, and developer guides.\n\nThe docs should be clear, well-structured, and include diagrams and examples where appropriate.\n\nDeliverables:\n- Technical documentation\n- API reference\n- Diagrams\n- Tutorials",
    reward: BigInt("700000000000000000"), // 0.7 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5 days from now
    status: 4, // Verified
    requiredSkills: ["Technical Writing", "Documentation", "Diagrams", "Developer Experience"],
    estimatedHours: 25,
    assignee: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15 days ago
    completedAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2 days ago
  },
  "5-1": {
    title: "Perform Security Audit",
    description: "Conduct a comprehensive security audit of the project's smart contracts and backend systems. Identify vulnerabilities, assess risk levels, and provide remediation recommendations.\n\nThe audit should cover standard attack vectors as well as project-specific risks.\n\nDeliverables:\n- Audit report\n- Vulnerability assessment\n- Remediation recommendations\n- Follow-up verification",
    reward: BigInt("2000000000000000000"), // 2 USDC
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days from now
    status: 0, // Open
    requiredSkills: ["Security", "Smart Contract Auditing", "Penetration Testing", "Risk Assessment"],
    estimatedHours: 80,
    assignee: "0x0000000000000000000000000000000000000000",
    createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 1, // 1 day ago
    completedAt: 0,
  }
};

// Mock data for projects
const mockProjects: Record<string, ProjectData> = {
  "1": {
    id: 1,
    title: "Decentralized Exchange Platform",
    creator: "0x1E58E44a26ea3AEb68dc09dB93f9aCD1eCA7411C",
  },
  "2": {
    id: 2,
    title: "NFT Marketplace for Digital Art",
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
  "3": {
    id: 3,
    title: "DeFi Lending Protocol",
    creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  },
  "4": {
    id: 4,
    title: "DAO Governance Framework",
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  "5": {
    id: 5,
    title: "Cross-Chain Bridge Solution",
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  },
};

// Format token amount (convert from wei to tokens)
const formatTokenAmount = (amount: bigint): string => {
  const tokenAmount = Number(amount) / 1e18;
  return tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Task status mapping
const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Open", color: "bg-green-100 text-green-800" },
  1: { label: "Assigned", color: "bg-blue-100 text-blue-800" },
  2: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  3: { label: "Completed", color: "bg-yellow-100 text-yellow-800" },
  4: { label: "Verified", color: "bg-purple-100 text-purple-800" },
  5: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export function TaskDetailsClient({ projectId, taskId }: { projectId: string; taskId: string }) {
  const [task, setTask] = useState<TaskData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  // Simulated contract interactions
  const handleApplyForTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Show loading notification
      const notificationId = notification.loading("Processing your application...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      notification.remove(notificationId);
      notification.success(
        <div>
          <p>Application submitted successfully!</p>
          <p className="text-xs mt-1">Transaction hash: 0x1234567890abcdef1234567890abcdef12345678</p>
        </div>,
        { duration: 5000 }
      );
      
      // Update task data with new status
      if (task) {
        const updatedTask = { ...task, status: 1, assignee: connectedAddress || "" };
        setTask(updatedTask);
        mockTasks[`${projectId}-${taskId}`] = updatedTask;
      }
    } catch (error: any) {
      console.error("Error applying for task:", error);
      notification.error("Failed to apply for task: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle starting a task
  const handleStartTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Show loading notification
      const notificationId = notification.loading("Starting task...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      notification.remove(notificationId);
      notification.success(
        <div>
          <p>Task started successfully!</p>
          <p className="text-xs mt-1">Transaction hash: 0x1234567890abcdef1234567890abcdef12345678</p>
        </div>,
        { duration: 5000 }
      );
      
      // Update task data with new status
      if (task) {
        const updatedTask = { ...task, status: 2 };
        setTask(updatedTask);
        mockTasks[`${projectId}-${taskId}`] = updatedTask;
      }
    } catch (error: any) {
      console.error("Error starting task:", error);
      notification.error("Failed to start task: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle completing a task
  const handleCompleteTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Show loading notification
      const notificationId = notification.loading("Completing task...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      notification.remove(notificationId);
      notification.success(
        <div>
          <p>Task completed successfully!</p>
          <p className="text-xs mt-1">Transaction hash: 0x1234567890abcdef1234567890abcdef12345678</p>
        </div>,
        { duration: 5000 }
      );
      
      // Update task data with new status
      if (task) {
        const updatedTask = { ...task, status: 3, completedAt: Math.floor(Date.now() / 1000) };
        setTask(updatedTask);
        mockTasks[`${projectId}-${taskId}`] = updatedTask;
      }
    } catch (error: any) {
      console.error("Error completing task:", error);
      notification.error("Failed to complete task: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get task status message
  const getTaskStatusMessage = (task: TaskData, connectedWallet?: string): string => {
    switch (task.status) {
      case 0:
        return "This task is open for applications.";
      case 1:
        return `This task has been assigned to ${shortenAddress(task.assignee)}.`;
      case 2:
        return `${shortenAddress(task.assignee)} is currently working on this task.`;
      case 3:
        return `${shortenAddress(task.assignee)} has marked this task as completed. Awaiting verification.`;
      case 4:
        const baseMessage = `This task has been verified and payment has been released to ${shortenAddress(task.assignee)}.`;
        if (connectedWallet && task.assignee.toLowerCase() === connectedWallet.toLowerCase()) {
          return `${baseMessage} Please check your wallet for the reward payment.`;
        }
        return baseMessage;
      default:
        return "Unknown status";
    }
  };

  // Helper function: Shorten address display
  const shortenAddress = (address: string): string => {
    if (!address || address === "0x0000000000000000000000000000000000000000") return "No one";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Mock connection to wallet
  const connectWallet = () => {
    setConnectedAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    notification.success("Wallet connected successfully!");
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load mock data
      const taskKey = `${projectId}-${taskId}`;
      const mockTask = mockTasks[taskKey];
      const mockProject = mockProjects[projectId];
      
      if (mockTask) {
        setTask(mockTask);
      } else {
        // If task doesn't exist in our mock data, create a default one
        const defaultTask: TaskData = {
          title: `Task ${parseInt(taskId) + 1} for Project ${projectId}`,
          description: "This is a mock task description for demonstration purposes.",
          reward: BigInt("1000000000000000000"), // 1 USDC
          deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 14 days from now
          status: 0, // Open
          requiredSkills: ["Coding", "Design", "Testing"],
          estimatedHours: 20,
          assignee: "0x0000000000000000000000000000000000000000",
          createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 3, // 3 days ago
          completedAt: 0,
        };
        setTask(defaultTask);
        mockTasks[taskKey] = defaultTask;
      }
      
      if (mockProject) {
        setProject(mockProject);
      } else {
        // If project doesn't exist, create a default one
        const defaultProject: ProjectData = {
          id: parseInt(projectId),
          title: `Project ${projectId}`,
          creator: "0x1E58E44a26ea3AEb68dc09dB93f9aCD1eCA7411C",
        };
        setProject(defaultProject);
        mockProjects[projectId] = defaultProject;
      }
      
      setIsLoadingData(false);
    };
    
    loadData();
  }, [projectId, taskId]);

  if (isLoadingData || !task) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-60 bg-gray-200 rounded"></div>
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate days left until deadline
  const now = new Date();
  const deadlineDate = new Date(task.deadline * 1000);
  const daysLeft = Math.max(0, differenceInDays(deadlineDate, now));
  const isDeadlinePassed = now > deadlineDate;
  
  // Determine if user can apply, start, or complete task
  const canApply = task.status === 0 && connectedAddress !== null; // Open status and connected
  const canStart = task.status === 1 && task.assignee === connectedAddress; // Assigned status and user is assignee
  const canComplete = task.status === 2 && task.assignee === connectedAddress; // In Progress status and user is assignee
  
  // Format dates
  const createdTime = formatDistanceToNow(new Date(task.createdAt * 1000), { addSuffix: true });
  const deadlineTime = formatDistanceToNow(deadlineDate, { addSuffix: true });
  
  // Get task status label
  const getTaskStatusLabel = (status: number): string => {
    switch (status) {
      case 0: return "Open";
      case 1: return "Assigned";
      case 2: return "In Progress";
      case 3: return "Completed";
      case 4: return "Verified";
      default: return "Unknown";
    }
  };

  // Get task status color
  const getTaskStatusColor = (status: number): string => {
    switch (status) {
      case 0: return "bg-secondary text-white";
      case 1: return "bg-primary text-white";
      case 2: return "bg-info text-white";
      case 3: return "bg-warning text-white";
      case 4: return "bg-success text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Get current task status
  const status = {
    label: getTaskStatusLabel(task.status),
    color: getTaskStatusColor(task.status)
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 mt-4 sm:pt-28 sm:mt-6">
      {/* Breadcrumb navigation */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link href="/projects" className="text-primary">
              Projects
            </Link>
          </li>
          <li>
            <Link href={`/projects/${projectId}`} className="text-primary">
              {project?.title || `Project ${projectId}`}
            </Link>
          </li>
          <li>Task {parseInt(taskId) + 1}</li>
        </ul>
      </div>

      {/* Task header */}
      <div className="p-6 mb-8 rounded-2xl shadow-lg bg-base-100 relative overflow-hidden border border-transparent before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/40 before:via-secondary/40 before:to-accent/40 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-base-100 after:-z-10">
        {/* Add aurora effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-accent/10 via-primary/10 to-secondary/10 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        <div className="relative z-10">
          {/* Required Skills */}
          <div className="flex flex-wrap gap-1 mb-3 sm:gap-2 sm:mb-4">
            {task.requiredSkills.map((skill, index) => (
              <span key={index} className="badge badge-primary badge-sm sm:badge-md bg-primary/10 border-0 text-primary">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">{task.title}</h1>
              <p className="flex flex-wrap items-center gap-2 text-sm opacity-70">
                <span>Created {createdTime}</span>
                {task.assignee && task.assignee !== "0x0000000000000000000000000000000000000000" && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center">
                      Assigned to <span className="ml-1 px-2 py-0.5 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary/10">{shortenAddress(task.assignee)}</span>
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              <span className="badge badge-outline badge-secondary">
                {formatTokenAmount(task.reward)} USDC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Task details */}
        <div className="md:col-span-2">
          <div className="p-4 shadow-lg card bg-base-100 sm:p-6 relative overflow-hidden border border-transparent before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-base-100 after:-z-10">
            <div className="relative z-10">
              <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">description</span>
                Task Description
              </h2>
              <div className="whitespace-pre-line text-sm sm:text-base opacity-80 mb-6">{task.description}</div>

              <h3 className="mb-3 text-base font-bold sm:text-lg sm:mb-4">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">schedule</span>
                Timeline Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-base-200/50 border border-base-300/50">
                  <p className="text-xs opacity-70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">event</span>
                    Deadline
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">
                    {deadlineTime}
                    {isDeadlinePassed ? (
                      <span className="text-error text-sm ml-2">(Expired)</span>
                    ) : (
                      <span className="text-success text-sm ml-2">({daysLeft} days left)</span>
                    )}
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-base-200/50 border border-base-300/50">
                  <p className="text-xs opacity-70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">hourglass_top</span>
                    Estimated Effort
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">{task.estimatedHours} hours</p>
                </div>
              </div>

              {/* Task status message */}
              <div className={`p-4 rounded-lg ${task.status === 4 ? 'bg-success/10 border border-success/20' : 'bg-info/10 border border-info/20'} mt-4`}>
                <div className="flex gap-3">
                  <span className="material-icons text-lg mt-0.5 text-primary">info</span>
                  <div>
                    <p className="font-medium">Current Status: {getTaskStatusLabel(task.status)}</p>
                    <p className="text-sm mt-1 opacity-80">{getTaskStatusMessage(task, connectedAddress || undefined)}</p>
                    
                    {/* Display verified and reward release information */}
                    {task.status === 4 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-success">
                          ✓ Task verified and reward of {formatTokenAmount(task.reward)} has been released
                        </p>
                        {task.completedAt > 0 && (
                          <p className="text-xs mt-1 opacity-70">
                            Completed on {new Date(task.completedAt * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task sidebar */}
        <div className="space-y-6 sm:space-y-8">
          {/* Task details card */}
          <div className="p-4 shadow-lg card bg-base-100 sm:p-6 relative overflow-hidden border border-transparent before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-base-100 after:-z-10">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-xl opacity-60 animate-pulse"></div>
            
            <div className="relative z-10">
              <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                <span className="material-icons text-primary text-sm align-text-bottom mr-1">payments</span>
                Reward Information
              </h2>
              
              <div className="p-3 rounded-lg bg-base-200/50 border border-base-300/50 mb-4">
                <p className="text-xs opacity-70 sm:text-sm">
                  <span className="material-icons text-primary text-xs align-text-bottom mr-1">attach_money</span>
                  Task Reward
                </p>
                <p className="mt-1 text-xl font-semibold sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {formatTokenAmount(task.reward)} USDC
                </p>
              </div>
              
              {/* Task Actions */}
              <div className="mt-6">
                {/* Apply for task button */}
                {task.status === 0 && (
                  connectedAddress ? (
                    <button 
                      className="btn btn-primary w-full mb-3 h-12" 
                      onClick={handleApplyForTask}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-icons text-sm align-text-bottom mr-1">assignment_turned_in</span>
                          Apply for this Task
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary w-full mb-3 h-12"
                      onClick={connectWallet}
                    >
                      <span className="material-icons text-sm align-text-bottom mr-1">account_balance_wallet</span>
                      Connect Wallet to Apply
                    </button>
                  )
                )}
                
                {/* Start task button (for assignee) */}
                {task.status === 1 && canStart && (
                  <button 
                    className="btn btn-primary w-full mb-3 h-12" 
                    onClick={handleStartTask}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm align-text-bottom mr-1">play_arrow</span>
                        Start Working on Task
                      </>
                    )}
                  </button>
                )}
                
                {/* Complete task button (for assignee) */}
                {task.status === 2 && canComplete && (
                  <button 
                    className="btn btn-primary w-full mb-3 h-12" 
                    onClick={handleCompleteTask}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm align-text-bottom mr-1">check_circle</span>
                        Mark as Completed
                      </>
                    )}
                  </button>
                )}
                
                {!connectedAddress && (
                  <div className="alert alert-warning">
                    <span className="material-icons text-sm align-text-bottom mr-1">warning</span>
                    <span>Connect your wallet to interact with this task</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project info card */}
          {project && (
            <div className="p-4 shadow-lg card bg-base-100 sm:p-6 relative overflow-hidden border border-transparent before:absolute before:inset-0 before:p-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-accent/30 before:-z-10 after:absolute after:inset-0 after:rounded-2xl after:bg-base-100 after:-z-10">
              <div className="relative z-10">
                <h2 className="mb-3 text-lg font-bold sm:text-xl sm:mb-4">
                  <span className="material-icons text-primary text-sm align-text-bottom mr-1">folder</span>
                  Project Information
                </h2>
                
                <div className="p-3 rounded-lg bg-base-200/50 border border-base-300/50 mb-4">
                  <p className="text-xs opacity-70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">business</span>
                    Project Name
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">{project.title}</p>
                </div>
                
                <div className="p-3 rounded-lg bg-base-200/50 border border-base-300/50 mb-4">
                  <p className="text-xs opacity-70 sm:text-sm">
                    <span className="material-icons text-primary text-xs align-text-bottom mr-1">person</span>
                    Project Creator
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">
                    <span className="px-2 py-0.5 text-xs font-medium text-primary border border-primary rounded-md">
                      {project.creator.substring(0, 6)}...{project.creator.substring(project.creator.length - 4)}
                    </span>
                    <span className="ml-2 text-xs opacity-70">agent@IdeaPlusesAI</span>
                  </p>
                </div>
                
                <div className="card-actions justify-center mt-4">
                  <Link href={`/projects/${projectId}`} className="btn btn-outline btn-primary btn-sm sm:btn-md h-10 min-h-10 w-full">
                    <span className="material-icons text-sm align-text-bottom mr-1">visibility</span>
                    View Project Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}