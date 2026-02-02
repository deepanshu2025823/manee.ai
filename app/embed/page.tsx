"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm"; 

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatWidget() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (!apiKey) {
        setMessages([{ role: "bot", content: "⚠️ Error: API Key missing." }]);
      } else {
        setMessages([
          { role: "bot", content: "Hey! Welcome to **Manee AI Support**! 👋" },
          { role: "bot", content: "Ab Aage Ki Socho 🤔💭 and start exploring." },
          { role: "bot", content: "I can help you with:\n* Pricing & Plans\n* Feature details\n* Custom integrations\n\nHow can I help you today?" }
        ]);
      }
    }
  }, [isOpen, apiKey, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = text;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, apiKey: apiKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "bot", content: "⚠️ Network Error." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ["Pricing Check", "Features", "Talk to Sales"];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans antialiased">
      
      <div 
        className={`
          transition-all duration-300 ease-in-out transform origin-bottom-right 
          ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}
          w-[360px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col
        `}
      >
        <div className="bg-[#EB2328] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-white rounded flex items-center justify-center">
                <span className="text-[#EB2328] font-bold text-xl">M</span>
             </div>
             <div>
                <h1 className="text-white font-bold text-lg leading-none">We are online!</h1>
                <span className="text-red-100 text-xs opacity-90">Usually replies instantly</span>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white transition">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="bg-white px-5 py-3 shrink-0">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-4 h-4 bg-[#EB2328] rounded-sm flex items-center justify-center text-white text-[10px] font-bold">M</div>
               <span className="font-bold text-gray-800 text-xs">Manee AI</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="h-px bg-green-600/30 flex-1 border-t border-green-600/30 border-dashed"></div>
               <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Today</span>
               <div className="h-px bg-green-600/30 flex-1 border-t border-green-600/30 border-dashed"></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && (
                 <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <span className="text-[#EB2328] font-bold text-[10px]">M</span>
                 </div>
              )}
              
              <div className={`max-w-[85%] p-3 text-[14px] leading-snug shadow-sm relative ${
                  msg.role === "user" 
                  ? "bg-[#EB2328] text-white rounded-2xl rounded-tr-sm" 
                  : "bg-[#F7F7F7] text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                }`}>
                
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    a: ({node, ...props}) => <a className={`underline ${msg.role === 'user' ? 'text-white' : 'text-blue-600'}`} target="_blank" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>

              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start w-full">
               <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mr-2 shrink-0"><span className="text-[#EB2328] font-bold text-[10px]">M</span></div>
               <div className="bg-[#F7F7F7] px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white shrink-0">
          <div className="flex flex-col items-end gap-2 mb-3">
             {quickReplies.map((reply, i) => (
               <button key={i} onClick={() => sendMessage(reply)} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full hover:border-[#EB2328] hover:text-[#EB2328] transition shadow-sm w-fit">
                 {reply}
               </button>
             ))}
          </div>
          <div className="relative flex items-center border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-[#EB2328] transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-gray-800 placeholder-gray-400"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} className="mr-1.5 p-2 bg-[#EB2328] text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center w-8 h-8 shadow-sm">
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
          <div className="text-center mt-2 flex items-center justify-center gap-1 opacity-50">
             <span className="text-[9px] font-bold text-gray-600">⚡ Powered By Career Lab Consulting</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen ? "bg-white text-gray-600 rotate-90" : "bg-[#EB2328] text-white rotate-0"}`}
      >
        {isOpen ? (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 01-2-2V6a2 2 0 01-2-2V6z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>
        )}
      </button>
    </div>
  );
}