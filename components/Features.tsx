export default function Features() {
  const features = [
    {
      title: "Universal Integration Hub",
      description: "Connect seamlessly with Salesforce, HubSpot, SAP, Workday, and 50+ other platforms via our unified API.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      ),
      color: "bg-blue-600",
      gridClass: "md:col-span-2", 
    },
    {
      title: "TiDB Vector Memory",
      description: "Forget context limits. Our RAG engine stores millions of docs, ensuring your AI remembers every policy and past interaction.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
      ),
      color: "bg-indigo-600",
      gridClass: "md:col-span-1",
    },
    {
      title: "Enterprise Grade Security",
      description: "SOC2 Compliant, End-to-End Encryption, and Private Cloud deployment options for sensitive data.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      ),
      color: "bg-green-600",
      gridClass: "md:col-span-1",
    },
    {
      title: "Multi-Channel Support",
      description: "Deploy once, run everywhere. Embed on your Website, WhatsApp, Slack, Teams, or Mobile App instantly.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      ),
      color: "bg-purple-600",
      gridClass: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Core Capabilities</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Built for the modern <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Enterprise Stack</span>
          </h2>
          <p className="text-xl text-gray-500 font-light">
            Everything you need to automate support, sales, and internal ops without changing your existing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${feature.gridClass}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-100 group-hover:opacity-0 transition-opacity"></div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-r ${feature.color.replace('bg-', 'from-')} to-transparent transition-opacity duration-500`}></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">
                  {feature.description}
                </p>

                <div className="mt-auto pt-8 flex items-center text-sm font-semibold text-gray-400 group-hover:text-blue-600 transition-colors cursor-pointer">
                  Learn more 
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}