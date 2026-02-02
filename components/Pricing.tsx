"use client";
import { useState } from "react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Startup",
      description: "Perfect for small teams building their first AI support agent.",
      price: isAnnual ? "39" : "49",
      features: [
        "1 AI Chatbot Agent",
        "5,000 Messages / month",
        "Basic CRM Integration (Read-only)",
        "30 Days Chat History",
        "Standard Email Support",
        "Manee 2.5 Flash Model",
      ],
      buttonText: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Business",
      description: "For growing companies requiring advanced data integration.",
      price: isAnnual ? "159" : "199",
      features: [
        "5 AI Chatbots (HR, Sales, Support)",
        "Unlimited Messages",
        "Full ERP & CRM Sync (Bi-directional)",
        "TiDB Vector Search (Upload PDFs/Docs)",
        "RAG (Retrieval Augmented Generation)",
        "Remove 'Powered by Manee' Branding",
        "Priority 24/7 Support",
      ],
      buttonText: "Get Started",
      highlight: true, 
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large scale organizations with security needs.",
      price: "Custom",
      features: [
        "Unlimited Everything",
        "On-Premise Deployment (Docker)",
        "SSO (Okta, MS Azure AD)",
        "Custom LLM Fine-Tuning",
        "Dedicated Account Manager",
        "SLA (99.99% Uptime Guarantee)",
        "Audit Logs & Compliance Reports",
      ],
      buttonText: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 relative overflow-hidden">
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Pricing Plans</h2>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Ready to Automate your Workforce?
          </h2>
          <p className="text-xl text-gray-500">
            Choose a plan that scales with your business. No hidden fees.
          </p>

          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isAnnual ? "translate-x-8 bg-blue-600" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full ml-1">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${
                plan.highlight
                  ? "bg-white border-2 border-blue-600 shadow-2xl relative z-10 md:scale-105" // Enterprise/Business card styling
                  : "bg-white border border-gray-100 shadow-lg hover:shadow-xl mt-0 md:mt-4"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  Recommended for You
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mt-2 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline">
                {plan.price === "Custom" ? (
                   <span className="text-4xl font-extrabold text-gray-900">Talk to Sales</span>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </>
                )}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 active:scale-95"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  What's included
                </p>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${plan.highlight ? 'bg-blue-100' : 'bg-green-50'}`}>
                         <svg className={`w-4 h-4 ${plan.highlight ? 'text-blue-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-600 text-sm font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
             <p className="text-gray-500 text-sm mb-6">Trusted by security-conscious teams at</p>
             <div className="flex justify-center gap-8 md:gap-12 grayscale opacity-60 items-center flex-wrap">
                 <img src="https://cdn-icons-png.flaticon.com/128/5968/5968880.png" alt="Salesforce" className="h-8 w-auto" />
                 <img src="https://cdn-icons-png.flaticon.com/128/5968/5968872.png" alt="HubSpot" className="h-8 w-auto" />
                 <img src="https://cdn-icons-png.flaticon.com/128/732/732221.png" alt="Microsoft" className="h-8 w-auto" />
             </div>
        </div>

      </div>
    </section>
  );
}