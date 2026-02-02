"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Settings() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("manee_apiKey");
    const name = localStorage.getItem("manee_companyName");

    if (!key) {
      router.push("/login");
    } else {
      setApiKey(key);
      setCompanyName(name || "");
    }
  }, [router]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">API Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">Use this key to integrate the chatbot on your website.</p>
          
          <div className="relative">
             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Secret Key</label>
             <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-sm text-gray-700 overflow-x-auto whitespace-nowrap">
                   {showKey ? apiKey : "manee-••••••••••••••••••••••••••••"}
                </code>
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="p-3 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                   {showKey ? (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                   ) : (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                   )}
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-bold text-sm min-w-[80px]"
                >
                   {copied ? "Copied!" : "Copy"}
                </button>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Company Profile</h2>
          
          <div className="grid grid-cols-1 gap-6">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  readOnly
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
             </div>
             
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">AI Model</label>
                <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                   <option>Gemini 2.5 Flash (Active)</option>
                   <option>Gemini 2.0 Pro</option>
                   <option>GPT-4o (Coming Soon)</option>
                </select>
             </div>
          </div>
          
          <div className="mt-8 flex justify-end">
             <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                Save Changes
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}