(function(window, document) {
  window.ManeeAI = {
    init: function(config) {
      if (!config.apiKey) return;
      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      iframe.src = "https://manee-ai.vercel.app/embed?apiKey=" + config.apiKey;
      
      iframe.setAttribute("scrolling", "no"); 
      iframe.style.overflow = "hidden";

      iframe.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 80px !important;    /* Default Button Size */
        height: 80px !important;   /* Default Button Size */
        border: none !important;
        z-index: 2147483647 !important;
        background: transparent !important;
        box-shadow: none !important;
        transition: height 0.3s ease, width 0.3s ease !important;
        max-height: 100vh !important;
        max-width: 100vw !important;
      `;

      document.body.appendChild(iframe);

      window.addEventListener("message", function(event) {
        if (event.data.type === "MANEE_RESIZE") {
          var frame = document.getElementById("manee-chat-frame");
          if (!frame) return;

          if (event.data.status === "open") {
             frame.style.width = "400px";
             frame.style.height = "600px";
             frame.style.borderRadius = "16px";
             frame.style.boxShadow = "0 10px 40px rgba(0,0,0,0.2)";
          } else {
             frame.style.width = "80px";
             frame.style.height = "80px";
             frame.style.borderRadius = "0px";
             frame.style.boxShadow = "none";
          }
        }
      });
    }
  };
})(window, document);