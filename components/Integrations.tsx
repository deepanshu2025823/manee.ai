"use client";

export default function Integrations() {
  const categories = [
    {
      title: "CRM & Sales",
      description: "Sync customer data bi-directionally.",
      icons: [
        { name: "Salesforce", url: "https://cdn-icons-png.flaticon.com/128/5968/5968880.png" },
        { name: "HubSpot", url: "https://cdn-icons-png.flaticon.com/128/5968/5968872.png" },
        { name: "Zoho", url: "https://cdn-icons-png.flaticon.com/128/5968/5968958.png" },
        { name: "Pipedrive", url: "https://cdn-icons-png.flaticon.com/128/2504/2504933.png" },
      ]
    },
    {
      title: "Communication",
      description: "Chat where your users already are.",
      icons: [
        { name: "Slack", url: "https://cdn-icons-png.flaticon.com/128/5968/5968929.png" },
        { name: "Teams", url: "https://cdn-icons-png.flaticon.com/128/732/732221.png" },
        { name: "WhatsApp", url: "https://cdn-icons-png.flaticon.com/128/733/733585.png" },
        { name: "Discord", url: "https://cdn-icons-png.flaticon.com/128/5968/5968756.png" },
      ]
    },
    {
      title: "E-Commerce",
      description: "Automate order status and returns.",
      icons: [
        { name: "Shopify", url: "https://cdn-icons-png.flaticon.com/128/5968/5968756.png" },
        { name: "Woo", url: "https://cdn-icons-png.flaticon.com/128/174/174881.png" },
        { name: "Magento", url: "https://cdn-icons-png.flaticon.com/128/5968/5968860.png" },
        { name: "Stripe", url: "https://cdn-icons-png.flaticon.com/128/5968/5968219.png" },
      ]
    }
  ];

  return (
    <section id="integrations" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Integrations</h2>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Connects with your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Entire Tech Stack
            </span>
          </h2>
          <p className="text-xl text-gray-500">
            Install in minutes. No coding required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <div key={index} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-500 mb-8">{cat.description}</p>
              
              <div className="grid grid-cols-4 gap-4">
                {cat.icons.map((icon, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2.5 group-hover:scale-110 group-hover:border-blue-200 transition-all">
                      <img src={icon.url} alt={icon.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              New integrations added weekly
           </div>
        </div>
      </div>
    </section>
  );
}