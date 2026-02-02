(function(window, document) {
  window.ManeeAI = {
    init: function(config) {
      if (!config.apiKey) return;
      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      iframe.src = "https://manee-ai.vercel.app/embed?apiKey=" + config.apiKey;
      iframe.setAttribute("allowTransparency", "true"); 

      iframe.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 80px !important;
        height: 80px !important;
        border: none !important;
        z-index: 9999999 !important;
        background: transparent !important;
        color-scheme: normal !important;
      `;

      document.body.appendChild(iframe);

      window.addEventListener("message", function(event) {
        if (event.data.type === "MANEE_RESIZE") {
          var frame = document.getElementById("manee-chat-frame");
          if (!frame) return;
          if (event.data.status === "open") {
             frame.style.width = "400px";
             frame.style.height = "650px";
             frame.style.borderRadius = "16px";
          } else {
             frame.style.width = "80px";
             frame.style.height = "80px";
             frame.style.borderRadius = "0px";
          }
        }
      });
    }
  };
})(window, document);