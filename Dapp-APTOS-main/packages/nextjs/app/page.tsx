"use client";

import Spline from '@splinetool/react-spline/next';
import Link from 'next/link';
import { FaCubes, FaRocket, FaShieldAlt, FaGithub, FaDiscord, FaTwitter, FaRobot, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      {/* 3D Scene */}
      <Spline
        scene="https://prod.spline.design/qIjVzf9JugaqHczn/scene.splinecode" 
      />
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10">
        {/* 左上角文字已移除 */}
        {/* 右上角按钮已移除 */}
      </div>
      
      {/* Center Content */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-center z-10 w-full max-w-4xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent leading-tight">
          A Web3 Utopia Co-created by Humans and AI
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto font-light text-yellow-500">
          Where Humans and AI Build the Future Together
        </p>
        
        <Link 
          href="/projects" 
          className="group relative px-8 py-3 overflow-hidden rounded-full bg-gradient-to-r from-primary via-secondary to-accent inline-flex items-center gap-2 font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
        >
          <span className="absolute inset-0 bg-black opacity-30 group-hover:opacity-0 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-2">
            <FaRocket className="w-4 h-4 animate-pulse" />
            <span>Join the Revolution</span>
          </span>
          <span className="absolute bottom-0 left-0 h-1 w-full bg-white/30 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300"></span>
        </Link>
        
        {/* Stats */}
        <div className="flex justify-center gap-12 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">AI</div>
            <div className="text-sm mt-1 opacity-80">Powered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary">DAO</div>
            <div className="text-sm mt-1 opacity-80">Governed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent">Web3</div>
            <div className="text-sm mt-1 opacity-80">Native</div>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 z-10 w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-3">
              <div className="p-2.5 mr-3 rounded-full bg-primary/20">
                <FaRobot className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI Supercharged</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Harness AI power to transform ideas into structured proposals and ignite crowdfunding
            </p>
          </div>
          
          <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-3">
              <div className="p-2.5 mr-3 rounded-full bg-secondary/20">
                <FaUsers className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Community Driven</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Reshape collaboration with dynamic staking and AI audits in a trustless network
            </p>
          </div>
          
          <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-3">
              <div className="p-2.5 mr-3 rounded-full bg-accent/20">
                <FaLightbulb className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Value Creation</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Fair, transparent token economics that reward real contributions over speculation
            </p>
          </div>
        </div>
      </div>
      
      {/* Mission Statement */}
      
      {/* Footer and Social Media */}
      <div className="absolute bottom-4 left-0 w-full text-center z-10 px-4">
        <div className="flex justify-center space-x-6 mb-2">
          <a href="#" className="text-white/70 hover:text-primary transition-colors">
            <FaGithub className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/70 hover:text-primary transition-colors">
            <FaDiscord className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/70 hover:text-primary transition-colors">
            <FaTwitter className="w-5 h-5" />
          </a>
        </div>
        <div className="text-white/70 text-sm">
          © 2025 Buidl Land | Together We Buidl, Together We Create Miracles
        </div>
      </div>
    </main>
  );
} 