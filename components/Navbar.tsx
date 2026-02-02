"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // 2. Auth Check Logic
    const checkAuth = () => {
      const key = localStorage.getItem("manee_apiKey");
      const name = localStorage.getItem("manee_companyName");
      
      setIsLoggedIn(!!key);
      if (name) setCompanyName(name);
    };
    
    checkAuth();
    
    window.addEventListener("storage", checkAuth);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("manee_apiKey");
    localStorage.removeItem("manee_companyName");
    setIsLoggedIn(false);
    setProfileOpen(false);
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200 py-3"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              Manee<span className="text-blue-600">.ai</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'Integrations'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition hover:-translate-y-0.5">
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-white border border-gray-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-100 transition rounded-full pl-1 pr-4 py-1 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{companyName}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{companyName}</p>
                    </div>
                    <div className="py-1">
                      <a href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Dashboard
                      </a>
                      <a href="/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Settings
                      </a>
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-900 font-bold hover:text-blue-600 text-sm transition px-4 py-2">Log in</Link>
                <Link href="/signup" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Start Free Trial</Link>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none transition p-2 rounded-lg hover:bg-gray-100">
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${isOpen ? "max-h-[400px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"}`}>
        <div className="px-6 space-y-4 flex flex-col items-center">
          <Link href="#features" className="mobile-link" onClick={() => setIsOpen(false)}>Features</Link>
          <Link href="#pricing" className="mobile-link" onClick={() => setIsOpen(false)}>Pricing</Link>
          <div className="w-full h-px bg-gray-100 my-2"></div>
          
          {isLoggedIn ? (
            <>
              <div className="text-center mb-2">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mx-auto mb-1">
                    {companyName.charAt(0).toUpperCase()}
                 </div>
                 <p className="font-bold text-gray-900">{companyName}</p>
              </div>
              <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition">Go to Dashboard</button>
              <button onClick={handleLogout} className="w-full text-red-500 py-3 font-semibold hover:bg-red-50 rounded-xl transition">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="w-full text-center py-3 text-gray-900 font-bold hover:text-blue-600" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link href="/signup" className="w-full text-center bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition" onClick={() => setIsOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .mobile-link { @apply block w-full text-center py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-semibold transition-colors; }
      `}</style>
    </nav>
  );
}