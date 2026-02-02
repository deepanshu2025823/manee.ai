"use client";
import { useState } from 'react';
import ChatDemo from '@/components/ChatDemo'; 

export default function Hero() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs md:text-sm font-medium mb-8 animate-fade-in-up hover:bg-blue-100 transition cursor-pointer shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>New: Manee 2.5 Integration Available</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1] drop-shadow-sm">
          The All-In-One AI <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
            Workforce for Enterprise
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-xl text-gray-600 mb-10 leading-relaxed font-light px-4">
          Connect your <span className="font-semibold text-gray-900">CRM, HRMS, and ERP</span> in seconds. 
          Train your custom AI on TiDB Vector storage and automate 80% of your workflow.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-4">
          <button 
            onClick={() => setShowDemo(!showDemo)}
            className="group relative px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 active:scale-95"
          >
            {showDemo ? "Close Demo" : "Try Live Demo"}
            {!showDemo && (
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            )}
          </button>
          
          <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 text-lg font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            View Pricing
          </button>
        </div>

        {showDemo && (
          <div className="relative max-w-5xl mx-auto animate-fade-in-up transition-all duration-500 pb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
               <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="mx-auto text-xs font-medium text-gray-400 select-none">Manee AI Assistant</div>
               </div>
               
               <div className="bg-white">
                 <ChatDemo />
               </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-200 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}