"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm";        

type Message = {
  role: "user" | "bot";
  content: string;
  attachment?: string | null;
  type?: "image" | "text";
};

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, preview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
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

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMessage = input;
    const currentFile = selectedFile;
    const currentPreview = preview;

    setMessages((prev) => [
      ...prev, 
      { 
        role: "user", 
        content: userMessage, 
        attachment: currentPreview,
        type: currentPreview ? "image" : "text"
      }
    ]);
    
    setInput("");
    setSelectedFile(null);
    setPreview(null);
    setLoading(true);

    try {
      let fileData = null;
      if (currentFile) {
        fileData = await fileToBase64(currentFile);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          file: fileData, 
          mimeType: currentFile?.type,
          apiKey: "manee-secret-key", 
          chatId: chatId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Connection failed");

      if (data.chatId) setChatId(data.chatId);

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.response },
      ]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `⚠️ Error: ${error.message || "Something went wrong"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] md:h-[650px] w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans">
      <div className="bg-gray-900 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">Enterprise Assistant</h3>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">Powered by Manee & TiDB</p>
          </div>
        </div>
        <button 
            onClick={() => setMessages([])}
            className="text-gray-400 hover:text-white text-xs transition border border-gray-700 px-2 py-1 rounded-md hover:bg-gray-800"
        >
            Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F3F4F6]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-4xl">
                🤖
            </div>
            <p className="text-gray-600 font-semibold">How can I assist you today?</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">You can upload images or documents for analysis.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {msg.attachment && (
                    <div className="mb-2 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <img src={msg.attachment} alt="attachment" className="max-w-[200px] max-h-[200px] rounded-md object-cover" />
                    </div>
                )}

                {msg.content && (
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden ${
                        msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                    }`}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                                a: ({node, ...props}) => (
                                    <a 
                                        className={`underline ${msg.role === "user" ? "text-blue-100 hover:text-white" : "text-blue-600 hover:text-blue-800"}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        {...props} 
                                    />
                                ),
                                code: ({node, ...props}) => (
                                    <code className={`px-1 py-0.5 rounded text-xs ${msg.role === "user" ? "bg-blue-700 text-white" : "bg-gray-100 text-red-500 font-mono"}`} {...props} />
                                ),
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        {preview && (
            <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                <img src={preview} alt="preview" className="w-10 h-10 rounded object-cover" />
                <span className="text-xs text-gray-500 truncate max-w-[150px]">{selectedFile?.name}</span>
                <button onClick={() => { setSelectedFile(null); setPreview(null); }} className="text-gray-400 hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex items-end gap-2"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*,application/pdf" 
          />
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Attach file"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
          </button>

          <input
            type="text"
            className="flex-1 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
}