(function(window, document) {
  window.ManeeAI = {
    init: function(config) {
      if (!config.apiKey) { console.error("ManeeAI: API Key missing."); return; }
      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      iframe.src = "https://manee-ai.vercel.app/embed?apiKey=" + config.apiKey;
      
      iframe.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 70px !important;   /* Button ke size ke hisaab se tight kiya */
        height: 70px !important;  /* Button ke size ke hisaab se tight kiya */
        border: none !important;
        z-index: 2147483647 !important; /* Max possible z-index to stay on top */
        background: transparent !important; /* White box hatane ke liye zaroori */
        box-shadow: none !important;
        overflow: hidden !important;
        border-radius: 100% !important; /* Ensure circular container when closed */
        transition: all 0.3s ease-in-out !important;
      `;
      
      document.body.appendChild(iframe);

      window.addEventListener("message", function(event) {
        if (event.data.type === "MANEE_RESIZE") {
          var frame = document.getElementById("manee-chat-frame");
          if (!frame) return;

          if (event.data.status === "open") {
             frame.style.cssText += `
                width: 400px !important;
                height: 650px !important;
                max-height: 90vh !important;
                border-radius: 16px !important; /* Chat window border radius */
             `;
          } else {
             frame.style.cssText += `
                width: 70px !important;
                height: 70px !important;
                max-height: none !important;
                border-radius: 100% !important; /* Wapas circular */
             `;
          }
        }
      });
    }
  };
})(window, document);