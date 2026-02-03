"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "bot";
  content: string;
  attachment?: string | null;
  type?: "image" | "text";
};

function ChatContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- FIX 1: FORCE TRANSPARENCY (CSS Injection) ---
  // Yeh CSS ensure karega ki Iframe ke piche kabhi bhi White color na aaye
  const transparencyStyle = `
    html, body {
      background-color: transparent !important;
      background: transparent !important;
      overflow: hidden !important;
    }
  `;

  useEffect(() => {
    if (isOpen) {
      window.parent.postMessage({ type: "MANEE_RESIZE", status: "open" }, "*");
    } else {
      window.parent.postMessage({ type: "MANEE_RESIZE", status: "closed" }, "*");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, preview]);

  // Initial Message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (!apiKey) {
        setMessages([{ role: "bot", content: "⚠️ Error: API Key missing." }]);
      } else {
        setMessages([
          { role: "bot", content: "👋 Hi there! I'm your AI Assistant.\n\nI can help you with services, pricing, or technical queries. Ask me anything!" }
        ]);
      }
    }
  }, [isOpen, apiKey, messages.length]);

  // File Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const sendMessage = async (text: string = input) => {
    if ((!text.trim() && !selectedFile) || loading) return;

    const userMessage = text;
    const currentFile = selectedFile;
    const currentPreview = preview;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, attachment: currentPreview, type: currentPreview ? "image" : "text" }
    ]);
    setInput("");
    setSelectedFile(null);
    setPreview(null);
    setLoading(true);

    try {
      let fileData = null;
      if (currentFile) fileData = await fileToBase64(currentFile);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, file: fileData, mimeType: currentFile?.type, apiKey }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", content: "⚠️ Connection Error." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ["Pricing Check", "Features", "Talk to Sales"];

  return (
    <>
      <style>{transparencyStyle}</style>
      
      <div className="flex flex-col justify-end items-end w-full h-full p-0 bg-transparent font-sans antialiased overflow-hidden relative">
        
        {/* Chat Window */}
        <div 
          className={`
            absolute bottom-[85px] right-[10px] left-[10px] top-[10px]
            transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right 
            ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4 pointer-events-none"}
            bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col z-50
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EB2328] to-[#FF5C61] px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <span className="text-white font-bold text-xl">M</span>
               </div>
               <div>
                  <h1 className="text-white font-bold text-lg leading-none tracking-tight">Support AI</h1>
                  <span className="text-red-50 text-[11px] font-medium opacity-90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online Now
                  </span>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-full">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 bg-[#F8F9FA] scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg, index) => (
              <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {msg.attachment && (
                      <img src={msg.attachment} alt="att" className="mb-2 max-w-[150px] rounded-lg border border-gray-200" />
                  )}
                  <div className={`p-3.5 text-[14px] leading-relaxed shadow-sm relative ${
                      msg.role === "user" 
                      ? "bg-[#EB2328] text-white rounded-2xl rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none"
                    }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                         p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                         ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                         a: ({node, ...props}) => <a className="underline font-medium" target="_blank" {...props} />
                    }}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer & Input */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            {preview && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs w-fit">
                    <span className="truncate max-w-[100px] text-gray-600">Image attached</span>
                    <button onClick={() => {setPreview(null); setSelectedFile(null)}} className="text-red-500 font-bold">✕</button>
                </div>
            )}
            
            {/* Quick Replies */}
            {messages.length < 3 && !loading && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-1 scrollbar-hide">
                    {quickReplies.map((reply, i) => (
                        <button key={i} onClick={() => sendMessage(reply)} className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-[#EB2328] hover:text-white hover:border-[#EB2328] transition">
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative flex items-end gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-[#EB2328] transition bg-gray-50 rounded-full h-10 w-10 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                </button>
                
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-transparent focus:bg-white focus:border-gray-300 rounded-full pl-4 pr-10 py-2.5 text-sm outline-none transition-all"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={() => sendMessage()} disabled={!input.trim() && !selectedFile} className="absolute right-1 top-1 p-1.5 bg-[#EB2328] text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:bg-gray-300">
                        <svg className="w-4 h-4 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
            </div>
            <div className="text-center mt-2 opacity-40 hover:opacity-100 transition">
                <a href="https://manee.ai" target="_blank" className="text-[9px] font-semibold text-gray-500 flex items-center justify-center gap-1">
                    ⚡ Powered by Manee AI
                </a>
            </div>
          </div>
        </div>

        {/* --- NEW ICON & LAUNCHER BUTTON --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            absolute bottom-[10px] right-[10px] w-16 h-16 rounded-full 
            shadow-[0_4px_20px_rgba(235,35,40,0.4)] 
            flex items-center justify-center 
            transition-all duration-300 transform hover:scale-105 active:scale-95
            bg-gradient-to-br from-[#EB2328] to-[#FF5C61] border-2 border-white
            ${isOpen ? "rotate-90 scale-90 opacity-0 pointer-events-none" : "rotate-0 opacity-100"}
          `}
        >
           {/* Modern Chat Icon */}
           <svg className="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" className="hidden" /> {/* Fallback */}
               <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 13.846 2.496 15.557 3.367 17.027L2.095 20.835C1.862 21.533 2.467 22.138 3.165 21.905L6.973 20.633C8.443 21.504 10.154 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM11 7C10.448 7 10 7.448 10 8C10 8.552 10.448 9 11 9H13C13.552 9 14 8.552 14 8C14 7.448 13.552 7 13 7H11ZM11 11C10.448 11 10 11.448 10 12C10 12.552 10.448 13 11 13H13C13.552 13 14 12.552 14 12C14 11.448 13.552 11 13 11H11ZM10 16C10 15.448 10.448 15 11 15H15C15.552 15 16 15.448 16 16C16 16.552 15.552 17 15 17H11C10.448 17 10 16.552 10 16Z"/>
           </svg>
        </button>

        {/* Close Icon (Only visible when Open) */}
        <button 
          onClick={() => setIsOpen(false)}
          className={`
            absolute bottom-[10px] right-[10px] w-14 h-14 rounded-full 
            shadow-lg bg-white text-gray-500 border border-gray-100
            flex items-center justify-center 
            transition-all duration-300 transform
            ${isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50 pointer-events-none"}
          `}
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

      </div>
    </>
  );
}

export default function ChatWidget() {
  return (
    <Suspense fallback={<div></div>}>
      <ChatContent />
    </Suspense>
  );
}