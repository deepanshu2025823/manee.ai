"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type RecentChat = {
  id: string;
  lastMessage: string;
  date: string;
  status: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    companyName: "",
  });
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const key = localStorage.getItem("manee_apiKey");
      if (!key) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: key }),
        });

        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();

        setStats({
          totalChats: data.totalChats,
          totalMessages: data.totalMessages,
          companyName: data.companyName,
        });
        setRecentChats(data.recentChats);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Overview for <span className="font-bold text-gray-800">{stats.companyName}</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
             <button onClick={() => window.location.reload()} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Refresh Data
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
               </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalChats}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Conversations</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
               </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMessages}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Messages Exchanged</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Manee 2.5</h3>
            <p className="text-sm text-gray-500 font-medium">Active AI Model</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
  <h2 className="text-lg font-bold text-gray-900 mb-4">Train AI on your Website</h2>
  <div className="flex gap-4">
    <input 
      type="url" 
      placeholder="https://example.com" 
      className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
      id="websiteUrl"
    />
    <button 
      onClick={async () => {
        const url = (document.getElementById("websiteUrl") as HTMLInputElement).value;
        const key = localStorage.getItem("manee_apiKey");
        if(!url) return alert("Please enter a URL");
        
        alert("Crawling started... This may take a few seconds.");
        
        const res = await fetch("/api/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: key, url: url })
        });
        
        const data = await res.json();
        if(data.success) alert("Training Complete! AI now knows your website.");
        else alert("Error: " + data.error);
      }}
      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
    >
      Train AI
    </button>
  </div>
</div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-900">Recent Database Activity</h2>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-600">
               <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                 <tr>
                   <th className="px-6 py-4">Session ID</th>
                   <th className="px-6 py-4">Last Message Content</th>
                   <th className="px-6 py-4">Date</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {recentChats.length > 0 ? (
                   recentChats.map((chat) => (
                     <tr key={chat.id} className="hover:bg-gray-50/50 transition">
                       <td className="px-6 py-4 font-mono text-xs text-blue-600 truncate max-w-[150px]">{chat.id}</td>
                       <td className="px-6 py-4 text-gray-900 truncate max-w-[300px]">{chat.lastMessage}</td>
                       <td className="px-6 py-4 text-gray-500">
                         {new Date(chat.date).toLocaleDateString()} {new Date(chat.date).toLocaleTimeString()}
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                       No chat history found in database. Go to Home and try the bot!
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </main>
    </div>
  );
}