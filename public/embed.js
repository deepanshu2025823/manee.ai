(function(window, document) {
  try {
    if (window.self !== window.top) {
      return; 
    }
  } catch (e) {
    return;
  }

  window.ManeeAI = {
    init: function(config) {
      if (!config.apiKey) return;
      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      iframe.src = "https://manee-ai.vercel.app/embed?apiKey=" + config.apiKey;
      
      iframe.setAttribute("scrolling", "no");
      
      iframe.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 80px !important;
        height: 80px !important;
        border: none !important;
        z-index: 2147483647 !important;
        background: transparent !important;
        box-shadow: none !important;
        max-height: 100vh !important;
        max-width: 100vw !important;
        opacity: 0 !important; /* Invisible initially */
        transition: opacity 0.5s ease-in-out, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease !important;
      `;

      document.body.appendChild(iframe);

      setTimeout(function() {
        iframe.style.setProperty("opacity", "1", "important");
      }, 100);

      window.addEventListener("message", function(event) {
        if (event.data.type === "MANEE_RESIZE") {
          var frame = document.getElementById("manee-chat-frame");
          if (!frame) return;

          frame.style.setProperty("opacity", "1", "important");

          if (event.data.status === "open") {
             frame.style.cssText += `
                width: 400px !important;
                height: 600px !important;
                border-radius: 16px !important;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
             `;
          } else {
             frame.style.cssText += `
                width: 80px !important;
                height: 80px !important;
                border-radius: 100% !important;
                box-shadow: none !important;
             `;
          }
        }
      });
    }
  };
})(window, document);