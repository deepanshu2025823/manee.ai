(function(window, document) {
  window.ManeeAI = {
    init: function(config) {
      if (!config.apiKey) {
        console.error("ManeeAI: API Key is required.");
        return;
      }

      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      iframe.src = "https://manee-ai.vercel.app/embed?apiKey=" + config.apiKey;
      
      iframe.style.position = "fixed";
      iframe.style.bottom = "20px";
      iframe.style.right = "20px";
      iframe.style.width = "90px";  
      iframe.style.height = "90px"; 
      iframe.style.border = "none";
      iframe.style.zIndex = "999999";
      iframe.style.transition = "all 0.3s ease";
      iframe.style.boxShadow = "none";
      iframe.style.background = "transparent";

      document.body.appendChild(iframe);

      window.addEventListener("message", function(event) {
        if (event.data.type === "MANEE_RESIZE") {
          if (event.data.status === "open") {
            iframe.style.width = "400px";
            iframe.style.height = "650px";
            iframe.style.bottom = "20px";
            iframe.style.right = "20px";
          } else {
            iframe.style.width = "90px";
            iframe.style.height = "90px";
          }
        }
      });
    }
  };
})(window, document);