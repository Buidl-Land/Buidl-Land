"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { mockFundingInfo, mockProjects, mockProjectTasks } from "./mockProjectData";
import { BuidllandTxFunction } from "../../../contracts/index"; // Import blockchain methods

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


// Status mapping
const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Draft", color: "bg-base-200 text-base-content" },
  1: { label: "Funding", color: "bg-primary text-primary-content" },
  2: { label: "In Progress", color: "bg-secondary text-secondary-content" },
  3: { label: "Completed", color: "bg-accent text-accent-content" },
  4: { label: "Cancelled", color: "bg-error text-error-content" },
};

// Task status mapping
const taskStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Open", color: "bg-green-100 text-green-800" },
  1: { label: "Assigned", color: "bg-blue-100 text-blue-800" },
  2: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  3: { label: "Completed", color: "bg-yellow-100 text-yellow-800" },
  4: { label: "Verified", color: "bg-purple-100 text-purple-800" },
  5: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export function ProjectDetailsClient({ projectId }: { projectId: string }) {
  const {getCrowdFunding, depositFunding} = BuidllandTxFunction();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [fundingInfo, setFundingInfo] = useState<FundingInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "tasks">("details");
  const [taskCount, setTaskCount] = useState<number>(0);
  const [projectTasks, setProjectTasks] = useState<TaskInfo[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [blockchainFunding, setBlockchainFunding] = useState<bigint | null>(null);

  // Calculate funding progress
  const fundingProgress = fundingInfo
    ? Number((fundingInfo.raisedAmount * BigInt(100)) / fundingInfo.fundingGoal)
    : 0;

  // Calculate days left
  const daysLeft = fundingInfo ? differenceInDays(new Date(fundingInfo.endTime * 1000), new Date()) : 0;

  // Check if funding is closed
  const isFundingClosed = fundingInfo ? fundingInfo.endTime < Math.floor(Date.now() / 1000) : false;

  // Load project data
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to get from cache first
      if (projectCache[projectId]) {
        setProject(projectCache[projectId]);
        setFundingInfo(fundingCache[projectId]);
        setTaskCount(taskCountCache[projectId] || 0);
        setIsLoading(false);
        return;
      }

      // Otherwise get from mock data
      const mockProject = mockProjects[projectId];
      const mockFunding = mockFundingInfo[projectId];
      
      if (mockProject) {
        // Store in cache for future use
        projectCache[projectId] = mockProject;
        setProject(mockProject);
        
        if (mockFunding) {
          fundingCache[projectId] = mockFunding;
          setFundingInfo(mockFunding);
        }
        
        // Get tasks for this project
        const taskKeys = Object.keys(mockProjectTasks).filter(key => key.startsWith(`${projectId}-`));
        taskCountCache[projectId] = taskKeys.length;
        setTaskCount(taskKeys.length);
      }
      
      setIsLoading(false);
    };
    
    fetchProjectData();
  }, [projectId]);
  
  // Load tasks when active tab is tasks
  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (activeTab !== "tasks" || !project) return;
      
      setIsLoadingTasks(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter tasks for this project
      const taskKeys = Object.keys(mockProjectTasks).filter(key => key.startsWith(`${projectId}-`));
      const tasks = taskKeys.map(key => {
        const taskData = mockProjectTasks[key];
        return {
          id: parseInt(key.split('-')[1]),
          title: taskData.title,
          description: taskData.description,
          reward: taskData.reward,
          deadline: taskData.deadline,
          status: taskData.status,
          skills: taskData.requiredSkills,
        };
      });
      
      setProjectTasks(tasks);
      setIsLoadingTasks(false);
    };
    
    fetchProjectTasks();
  }, [activeTab, projectId, project]);
  
  // Fetch blockchain funding data for project 1
  useEffect(() => {
    const fetchBlockchainFunding = async () => {
      if (projectId === "1") {
        try {
          const fundingAmount = await getCrowdFunding();
          console.log("已筹集资金", fundingAmount)
          setBlockchainFunding(fundingAmount as bigint);
        } catch (error) {
          console.error("Error fetching blockchain funding:", error);
        }
      }
    };
    
    fetchBlockchainFunding();
  }, [projectId, isRefreshing]);
  
  // Handle blockchain funding
  const handleFundProject = async () => {
    if (projectId === "1") {
      try {
        setIsRefreshing(true);
        // Amount would typically come from user input, using 1 USDC for demo
        const amount = BigInt("100000000000"); // 1 USDC with 18 decimals
        await depositFunding(amount);
        
        // Refresh funding data after transaction
        const updatedFunding = await getCrowdFunding();
        setBlockchainFunding(updatedFunding);
        
        notification.success("Funding successful!");
      } catch (error) {
        console.error("Error funding project:", error);
        notification.error("Funding failed. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (isLoading || !project) {
    return (
      <div className="flex flex-col items-center justify-center pt-16 pb-16 animate-fade-in min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-base-content/70">Loading project details...</p>
      </div>
    );
  }
  
  const status = statusMap[project.status] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
  
  // Modify the funding display for project 1
  const displayFundingInfo = () => {
    if (projectId === "1" && blockchainFunding !== null) {
      // Use blockchain data for project 1
      return (
        <div>
          <div className="flex justify-between mb-1">
            <span>Funding Goal</span>
            <span className="font-bold">{Number(fundingInfo?.fundingGoal) / 1e8} USDC</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Raised Amount (Blockchain)</span>
            <span className="font-bold">{Number(blockchainFunding) / 1e8} USDC</span>
          </div>
          {/* Funding button for blockchain interaction */}
          <button 
            className="w-full mt-4 btn btn-primary"
            onClick={handleFundProject}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Processing...
              </>
            ) : (
              "Fund This Project"
            )}
          </button>
        </div>
      );
    } else {
      // Use mock data for other projects
      return (
        <div>
          <div className="flex justify-between mb-1">
            <span>Funding Goal</span>
            <span className="font-bold">{Number(fundingInfo?.fundingGoal) / 1e18} USDC</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Raised Amount</span>
            <span className="font-bold">{Number(fundingInfo?.raisedAmount) / 1e18} USDC</span>
          </div>
          {/* Mock funding button */}
          <button className="w-full mt-4 btn btn-primary"onClick={handleFundProject}
            disabled={isRefreshing}>
            Fund This Project
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-16 animate-fade-in">
      {/* Project Header */}
      <div className="w-full bg-gradient-to-b from-base-200/50 to-transparent">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <div className="relative mb-6">
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              
              {project.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-base-300/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="tabs tabs-boxed bg-base-200/50 inline-flex">
            <button
              className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Project Details
            </button>
            <button
              className={`tab ${activeTab === "tasks" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks ({taskCount})
            </button>
          </div>
        </div>
      </div>
      
      {/* Project Content */}
      <div className="container px-4 mx-auto max-w-6xl">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Project Details */}
            <div className="p-6 shadow-lg md:col-span-3 card bg-base-100">
              <h2 className="mb-4 text-2xl font-bold">Project Overview</h2>
              <p className="mb-6 whitespace-pre-line">{project.description}</p>
              
              {/* Project Metrics */}
              <h3 className="mb-3 text-xl font-bold">Project Evaluation</h3>
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-base-200/50">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-primary material-icons">analytics</span>
                    <h3 className="text-sm font-bold">Market Score</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{project.metadata.marketScore}/10</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-base-200/50">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-primary material-icons">build</span>
                    <h3 className="text-sm font-bold">Technical Feasibility</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{project.metadata.techFeasibility}</span>
                    <span className="ml-2 text-sm text-base-content/70">Grade</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-base-200/50">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-primary material-icons">schedule</span>
                    <h3 className="text-sm font-bold">Project Age</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      {differenceInDays(new Date(), new Date(project.createdAt * 1000))}
                    </span>
                    <span className="ml-2 text-sm text-base-content/70">Days</span>
                  </div>
                </div>
              </div>
              
              {/* AI Evaluation */}
              <h3 className="mb-3 text-xl font-bold">AI Evaluation</h3>
              <div className="p-6 mb-6 border rounded-lg bg-base-200/30 border-base-300">
                <p className="italic">{project.metadata.aiEvaluation}</p>
              </div>
              
              {/* Funding Information */}
              <div className="mb-4">
                {fundingInfo && displayFundingInfo()}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Creator Card */}
              <div className="p-6 shadow-lg card bg-base-100">
                <h2 className="mb-4 text-xl font-bold">Creator</h2>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                      <span>{project.creator.slice(2, 4)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{project.creator.slice(0, 6)}...{project.creator.slice(-4)}</p>
                    <p className="text-xs opacity-70">Project Creator</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-base-300/50">
                  <div className="flex justify-between mb-1 text-xs opacity-70">
                    <span>Created</span>
                    <span>{formatDistanceToNow(new Date(project.createdAt * 1000), { addSuffix: true })}</span>
                  </div>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Last Updated</span>
                    <span>{formatDistanceToNow(new Date(project.updatedAt * 1000), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/projects" className="btn btn-outline">
                  <span className="mr-2 material-icons">arrow_back</span>
                  Back to Projects
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 gap-6">
            {/* Tasks Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Tasks</h2>
              <Link href={`/projects/${projectId}/tasks/create`} className="btn btn-primary btn-sm">
                <span className="mr-2 material-icons">add</span>
                Create Task
              </Link>
            </div>
            
            {/* Tasks List */}
            {isLoadingTasks ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : projectTasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectTasks.map((task) => (
                  <Link 
                    key={task.id}
                    href={`/projects/${projectId}/tasks/${task.id}`}
                    className="p-6 transition-all shadow-md hover:shadow-lg card bg-base-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold line-clamp-1">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${taskStatusMap[task.status]?.color || ""}`}>
                        {taskStatusMap[task.status]?.label || "Unknown"}
                      </span>
                    </div>
                    
                    <p className="mb-4 text-sm opacity-80 line-clamp-3">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {task.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-base-200">
                          {skill}
                        </span>
                      ))}
                      {task.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-base-200">
                          +{task.skills.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-xs opacity-70">Reward</p>
                        <p className="font-medium">{Number(task.reward) / 1e18} USDC</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-70">Deadline</p>
                        <p className="font-medium">
                          {differenceInDays(new Date(task.deadline * 1000), new Date())} days left
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center shadow-lg card bg-base-100">
                <p className="text-lg opacity-60">No tasks have been created for this project yet.</p>
                <Link href={`/projects/${projectId}/tasks/create`} className="mx-auto mt-4 btn btn-primary btn-sm">
                  Create First Task
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}