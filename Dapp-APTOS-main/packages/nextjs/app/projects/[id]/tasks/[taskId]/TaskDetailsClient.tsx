"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { notification } from "~~/utils/scaffold-eth";
import { mockProjects, mockProjectTasks } from "../../mockProjectData";
import { BuidllandTxFunction } from "../../../../../contracts/index"; // Import blockchain methods
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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

// Task status mapping
const taskStatusMap: Record<number, { label: string; color: string; action?: string }> = {
  0: { label: "Open", color: "bg-green-100 text-green-800", action: "Apply" },
  1: { label: "Assigned", color: "bg-blue-100 text-blue-800" },
  2: { label: "In Progress", color: "bg-yellow-100 text-yellow-800", action: "Submit Work" },
  3: { label: "Under Review", color: "bg-purple-100 text-purple-800" },
  4: { label: "Completed", color: "bg-teal-100 text-teal-800" },
  5: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

// Add at the top with other type definitions
type BuidllandTxFunctions = {
  getTaskState: (taskId: number) => Promise<number>;
  assignTask: (taskId: number) => Promise<void>;
};

export function TaskDetailsClient({ projectId, taskId }: { projectId: string; taskId: string }) {
  // 使用钱包钩子
  const { account, connected } = useWallet();
  
  // 获取合约方法
  const { assignTask } = BuidllandTxFunction();
  
  const [task, setTask] = useState<TaskData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // 加载任务和项目数据
  useEffect(() => {
    const fetchTaskDetails = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get task data from mock
      const taskKey = `${projectId}-${taskId}`;
      const taskData = mockProjectTasks[taskKey];
      
      if (taskData) {
        setTask(taskData);
        
        // Get project data
        const projectData = mockProjects[projectId];
        if (projectData) {
          setProject({
            id: projectData.id,
            title: projectData.title,
            creator: projectData.creator
          });
        }
      }
      
      setIsLoading(false);
    };
    
    fetchTaskDetails();
  }, [projectId, taskId]);
  
  // 简化后的任务申请函数 - 直接调用区块链方法
  const handleAssignTask = async () => {
    try {
      setIsAssigning(true);
      console.log("Starting task assignment...");
      
      // 简单起见，使用固定的任务ID 1
      await assignTask("0x4d80f47b77c8f07ee105aa40d735fa6c5238b0cb7b882090bcc73d78f0e8c469");
      console.log("Task assignment transaction submitted");
      
      notification.success("Task assignment transaction submitted!");
    } catch (error) {
      console.error("Error assigning task:", error);
      notification.error("Task assignment failed. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };
  
  // 简化的Apply按钮渲染 - 所有任务都使用相同的逻辑
  const renderApplyButton = () => {
    // 如果任务状态为Open，显示Apply按钮
    if (task?.status === 0) {
      return (
        <button
          className="btn btn-primary"
          onClick={handleAssignTask}
          disabled={isAssigning}
        >
          {isAssigning ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="mr-1 material-icons text-sm">person_add</span>
              Apply for Task
            </>
          )}
        </button>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-16 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-base-content/70">Loading task details...</p>
      </div>
    );
  }
  
  if (!task || !project) {
    return (
      <div className="flex flex-col min-h-screen pt-16 pb-16 animate-fade-in">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <div className="p-8 text-center card bg-base-100 shadow-xl">
            <h2 className="text-2xl font-bold">Task Not Found</h2>
            <p className="mt-2 opacity-80">The task you're looking for doesn't exist or has been removed.</p>
            <Link href={`/projects/${projectId}`} className="mt-6 btn btn-primary">
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // 获取任务状态信息 - 使用模拟数据
  const taskStatus = taskStatusMap[task?.status || 0];
  
  // 是否显示动作按钮
  const showActionButton = !isLoading && task;
  
  return (
    <div className="flex flex-col min-h-screen pt-16 pb-16 animate-fade-in">
      {/* Task Header */}
      <div className="w-full bg-gradient-to-b from-base-200/50 to-transparent">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <Link href={`/projects/${projectId}`} className="flex items-center mb-4 text-sm hover:underline">
            <span className="mr-1 material-icons text-sm">arrow_back</span>
            Back to Project: {project.title}
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{task.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${taskStatus.color}`}>
                  {taskStatus.label}
                </span>
                
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-base-300/50">
                  {Number(task.reward) / 1e18} USDC
                </span>
                
                {task.status === 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-base-300/50">
                    {differenceInDays(new Date(task.deadline * 1000), new Date())} days left
                  </span>
                )}
              </div>
            </div>
            
            {/* Apply button moved to right top position */}
            <div className="flex items-center">
              {showActionButton && renderApplyButton()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Content */}
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Main Task Details */}
          <div className="p-6 shadow-lg md:col-span-3 card bg-base-100">
            <h2 className="mb-4 text-2xl font-bold">Task Description</h2>
            <div className="prose max-w-none mb-6 whitespace-pre-line">
              {task.description}
            </div>
            
            {/* Additional Task Information */}
            <h3 className="mb-3 text-xl font-bold">Task Details</h3>
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg bg-base-200/50">
                <p className="text-sm opacity-70">Estimated Hours</p>
                <p className="text-xl font-medium">{task.estimatedHours} hours</p>
              </div>
              
              <div className="p-4 rounded-lg bg-base-200/50">
                <p className="text-sm opacity-70">Deadline</p>
                <p className="text-xl font-medium">
                  {formatDistanceToNow(new Date(task.deadline * 1000), { addSuffix: true })}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-base-200/50">
                <p className="text-sm opacity-70">Created</p>
                <p className="text-xl font-medium">
                  {formatDistanceToNow(new Date(task.createdAt * 1000), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {/* Required Skills */}
            <h3 className="mb-3 text-xl font-bold">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {task.requiredSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  {skill}
                </span>
              ))}
            </div>
            
            {/* Task Status Information */}
            <h3 className="mb-3 text-xl font-bold">Status Information</h3>
            <div className="p-4 mb-6 border rounded-lg bg-base-200/30 border-base-300">
              {task.status === 0 && (
                <p>This task is open for applications. Interested contributors can apply to work on this task.</p>
              )}
              {task.status === 1 && (
                <div>
                  <p className="mb-2">This task has been assigned to:</p>
                  <div className="p-2 rounded-lg bg-base-300/50 inline-block">
                    <span className="font-mono">
                      {task.assignee.substring(0, 6)}...{task.assignee.substring(task.assignee.length - 4)}
                    </span>
                  </div>
                </div>
              )}
              {task.status === 2 && (
                <p>This task is currently in progress. The assignee is working on completing the requirements.</p>
              )}
              {task.status === 3 && (
                <p>Work has been submitted and is currently under review by the project creator.</p>
              )}
              {task.status === 4 && (
                <p>This task has been completed and the reward has been paid to the contributor.</p>
              )}
              {task.status === 5 && (
                <p>This task has been cancelled and is no longer active.</p>
              )}
            </div>
            
            {/* Action Section - Removed Cancel Task button, only keeping Approve Work button */}
            <div className="card-actions">
              {task.status === 3 && (
                <button className="btn btn-success">
                  <span className="mr-1 material-icons text-sm">check</span>
                  Approve Work
                </button>
              )}
            </div>
          </div>
          
          {/* Project info card */}
          <div className="p-6 shadow-lg card bg-base-100">
            <h2 className="mb-4 text-xl font-bold">
              <span className="mr-1 material-icons text-primary text-sm">folder</span>
              Project Information
            </h2>
            
            <div className="p-4 mb-4 rounded-lg bg-base-200/50">
              <p className="text-xs opacity-70">
                <span className="mr-1 material-icons text-primary text-xs">business</span>
                Project Name
              </p>
              <p className="mt-1 text-lg font-semibold">{project.title}</p>
            </div>
            
            <div className="p-4 mb-4 rounded-lg bg-base-200/50">
              <p className="text-xs opacity-70">
                <span className="mr-1 material-icons text-primary text-xs">person</span>
                Project Creator
              </p>
              <p className="mt-1">
                <span className="px-2 py-1 text-xs font-medium text-primary border border-primary rounded-md">
                  {project.creator.substring(0, 6)}...{project.creator.substring(project.creator.length - 4)}
                </span>
              </p>
            </div>
            
            <div className="card-actions justify-center mt-4">
              <Link href={`/projects/${projectId}`} className="w-full btn btn-outline btn-primary">
                <span className="mr-1 material-icons text-sm">visibility</span>
                View Project Details
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove the old Apply button location */}
      
    </div>
  );
}