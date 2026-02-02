"use client";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Pioneering the future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Enterprise Intelligence
              </span>
            </h2>
            <p className="text-xm text-gray-500 font-light mb-8 leading-relaxed">
              Manee.ai isn't just another chatbot. We are the neural layer for your business, connecting siloed data from CRMs, ERPs, and Helpdesks into a unified, actionable intelligence engine.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Data Privacy First</h4>
                  <p className="text-xs font-medium text-gray-500">Your data never leaves your private cloud environment unless you want it to.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Seamless Scalability</h4>
                  <p className="text-xs font-medium text-gray-500">From 10 to 10,000 employees, Manee adapts to your workforce needs instantly.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
               <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                 Meet the Team
               </button>
               <button className="px-8 py-3.5 rounded-xl font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-200 hover:border-blue-200">
                 Read our Story
               </button>
            </div>
          </div>

          <div className="relative">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="text-4xl font-extrabold text-blue-600 mb-2">300%</div>
                   <div className="text-sm font-medium text-gray-600">ROI for average enterprise client</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow mt-8">
                   <div className="text-4xl font-extrabold text-purple-600 mb-2">50+</div>
                   <div className="text-sm font-medium text-gray-600">Native Integrations supported</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="text-4xl font-extrabold text-indigo-600 mb-2">24/7</div>
                   <div className="text-sm font-medium text-gray-600">Automated Support Coverage</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow mt-8">
                   <div className="text-4xl font-extrabold text-gray-900 mb-2">10k+</div>
                   <div className="text-sm font-medium text-gray-600">Hours saved annually</div>
                </div>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center z-10">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}