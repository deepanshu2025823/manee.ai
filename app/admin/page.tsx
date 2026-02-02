"use client";
import { useState, useEffect } from "react";

type CompanyData = {
  id: string;
  name: string;
  website: string;
  apiKey: string;
  totalChats: number;
  joinedDate: string;
};

type AdminData = {
  stats: {
    totalCompanies: number;
    totalChats: number;
    totalMessages: number;
  };
  companies: CompanyData[];
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPin: pin }),
      });

      if (!res.ok) throw new Error("Wrong PIN");

      const result = await res.json();
      setData(result);
      setFilteredCompanies(result.companies);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true"); 
    } catch (error) {
      alert("Invalid Admin PIN");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) return;
    const filtered = data.companies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.apiKey.includes(searchTerm)
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, data]);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,#020617_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 w-full max-w-sm relative z-10 animate-fade-in-up">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Access</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Enter your security PIN to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="••••••"
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white text-center tracking-widest text-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-600"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/20 flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const sortedCompanies = [...data.companies].sort((a, b) => b.totalChats - a.totalChats).slice(0, 5);
  const maxChats = Math.max(...sortedCompanies.map(c => c.totalChats), 1); 

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
               <span className="font-bold text-xl text-gray-900">Manee Admin</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="hidden sm:inline-block text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">System Healthy</span>
               <button 
                onClick={() => window.location.reload()}
                className="text-gray-500 hover:text-red-600 font-medium text-sm transition"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Companies", value: data.stats.totalCompanies, icon: "🏢", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Sessions", value: data.stats.totalChats, icon: "💬", color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Messages Sent", value: data.stats.totalMessages, icon: "⚡", color: "text-green-600", bg: "bg-green-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
               <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
               </div>
               <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center text-2xl`}>
                  {stat.icon}
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Top Active Companies</h3>
                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                    {sortedCompanies.length > 0 ? sortedCompanies.map((c, i) => (
                        <div key={c.id} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full flex justify-end flex-col items-center h-full">
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded mb-2 transition-opacity whitespace-nowrap z-10">
                                    {c.totalChats} Chats
                                </div>
                                <div 
                                    style={{ height: `${(c.totalChats / maxChats) * 100}%` }} 
                                    className="w-full max-w-[40px] bg-blue-500 rounded-t-lg group-hover:bg-blue-600 transition-all relative min-h-[10px]"
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 font-medium truncate w-16 text-center">{c.name}</p>
                        </div>
                    )) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No data available yet</div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-2">Admin Controls</h3>
                    <p className="text-indigo-100 text-sm mb-6">Manage API usage and monitor system health directly from here.</p>
                    <div className="space-y-3">
                        <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Database Connected (TiDB)</span>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">AI Model Active (Gemini)</span>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                    Refresh Data
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h2 className="text-lg font-bold text-gray-900">Registered Companies</h2>
             <div className="relative w-full sm:w-64">
                <input 
                    type="text" 
                    placeholder="Search companies..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4 text-right">API Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{company.name}</div>
                        <div className="text-xs text-blue-500">
                            {company.website !== "N/A" ? <a href={company.website} target="_blank" className="hover:underline">{company.website}</a> : ""}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                        {new Date(company.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((company.totalChats / 10) * 100, 100)}%` }}></div>
                             </div>
                             <span className="text-xs font-medium">{company.totalChats}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => copyToClipboard(company.apiKey)}
                            className="text-xs font-mono bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2 py-1 rounded transition text-gray-600 flex items-center gap-2 ml-auto"
                        >
                            {copiedKey === company.apiKey ? (
                                <span className="text-green-600 font-bold">Copied!</span>
                            ) : (
                                <>
                                    {company.apiKey.substring(0, 8)}...
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                </>
                            )}
                        </button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                            No companies found matching "{searchTerm}"
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}