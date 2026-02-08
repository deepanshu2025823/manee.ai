"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  attachment?: string | null; 
}

function ChatContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "Hey! Welcome to ManeeAI!" },
    { id: "2", role: "bot", content: "I can analyze images and documents for you. Try uploading one! 📂 🖼️" },
    { id: "3", role: "bot", content: "How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Analyze this document",
    "What is in this image?",
    "Summarize the file"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (window.parent) {
      window.parent.postMessage({ 
        type: "MANEE_RESIZE", 
        status: isOpen ? "open" : "close" 
      }, "*");
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        alert("File size too large! Please upload under 5MB.");
        return;
      }
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() && !selectedFile) return;

    const currentFile = filePreview;
    const currentFileType = selectedFile?.type;

    const userMsg: Message = { 
        id: Date.now().toString(), 
        role: "user", 
        content: text,
        attachment: currentFile 
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: text, 
            apiKey, 
            file: currentFile, 
            mimeType: currentFileType
        }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", content: data.response }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <style>{`
          body [data-nextjs-toast], body div[data-nextjs-toast], #next-route-announcer + div, nextjs-portal, div[data-nextjs-dialog-overlay] {
            display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -9999 !important;
          }
        `}</style>

        <button 
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-14 h-14 bg-[#d1202e] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-20px)] w-full max-w-[400px] mx-auto bg-white font-sans shadow-2xl rounded-xl overflow-hidden border border-gray-200">
      <style>{`
          body [data-nextjs-toast], body div[data-nextjs-toast], #next-route-announcer + div, nextjs-portal, div[data-nextjs-dialog-overlay] {
            display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -9999 !important;
          }
      `}</style>

      <div className="bg-[#b91c1c] px-4 py-3 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
           <div className="bg-white/20 p-1 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </div>
           <span className="font-bold text-sm tracking-wide">We are online!</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer hover:bg-white/10 rounded-full p-1 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm z-10">
         <div className="w-8 h-8 bg-[#d1202e] rounded flex items-center justify-center text-white font-bold text-xs">
            M
         </div>
         <span className="font-bold text-gray-800 text-lg">ManeeAI</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            
            {msg.attachment && (
                <div className="mb-1 max-w-[85%]">
                    {msg.attachment.startsWith("data:image") ? (
                         <img src={msg.attachment} alt="Upload" className="rounded-lg max-h-32 border border-gray-200" />
                    ) : (
                        <div className="bg-gray-100 p-2 rounded text-xs flex items-center gap-1 border border-gray-300">
                             📄 Document Uploaded
                        </div>
                    )}
                </div>
            )}

            <div 
              className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "bg-[#d1202e] text-white rounded-2xl rounded-tr-none" 
                  : "bg-[#f0f2f5] text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f0f2f5] px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-1.5 w-16">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-100 p-3 shrink-0">
        
        {selectedFile && (
            <div className="flex items-center gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-200 w-fit">
                <div className="text-xs text-gray-600 truncate max-w-[200px] flex items-center gap-1">
                    {selectedFile.type.startsWith("image") ? "🖼️" : "📄"} {selectedFile.name}
                </div>
                <button onClick={removeFile} className="text-red-500 hover:text-red-700 font-bold px-1">✕</button>
            </div>
        )}

        {messages.length < 5 && !loading && !selectedFile && (
          <div className="flex flex-col gap-2 mb-3">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="cursor-pointer text-left text-sm font-medium text-[#1f2937] bg-white border border-[#007a5a] hover:bg-[#eff9f6] px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2 relative bg-gray-100 rounded-full pr-2"
        >
          <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             className="hidden" 
             accept="image/*,application/pdf,text/plain"
          />

          <button 
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className="p-3 text-gray-500 hover:text-[#d1202e] transition-colors rounded-full cursor-pointer"
             title="Attach Image or Document"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
             </svg>
          </button>

          <input
            className="flex-1 py-3 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button 
            type="submit" 
            disabled={loading || (!input.trim() && !selectedFile)}
            className="p-2 bg-[#d1202e] text-white rounded-full hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </form>
        
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">Powered By Career Lab Consulting</span>
        </div>
      </div>

    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}