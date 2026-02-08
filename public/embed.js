(function(window, document) {
  console.log("ManeeAI: Script Start"); 

  try {
    if (window.self !== window.top) {
      return; 
    }
  } catch (e) {
    return;
  }

  var ManeeAI = window.ManeeAI || {};

  ManeeAI.init = function(config) {
      var domain = "https://manee-ai.vercel.app"; 
      
      if (!config.apiKey) {
          console.error("ManeeAI: API Key Missing!");
          return;
      }
      if (document.getElementById("manee-chat-frame")) return;

      var iframe = document.createElement("iframe");
      iframe.id = "manee-chat-frame";
      
      iframe.src = domain + "/embed?apiKey=" + config.apiKey;
      
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("allowTransparency", "true");
      iframe.setAttribute("allow", "clipboard-read; clipboard-write; microphone"); 
      
      iframe.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 80px !important;
        height: 80px !important;
        border: none !important;
        z-index: 2147483647 !important;
        background: transparent !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        border-radius: 50% !important;
        transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease !important;
        max-height: 100vh !important;
        max-width: 100vw !important;
      `;

      document.body.appendChild(iframe);
      console.log("ManeeAI: Iframe added to body"); 

      window.addEventListener("message", function(event) {

        if (event.data.type === "MANEE_RESIZE") {
          var frame = document.getElementById("manee-chat-frame");
          if (!frame) return;

          var isMobile = window.innerWidth < 450;

          if (event.data.status === "open") {
             var width = isMobile ? "100%" : "400px";
             var height = isMobile ? "100%" : "600px";
             var radius = isMobile ? "0px" : "12px";
             var bottom = isMobile ? "0px" : "20px";
             var right = isMobile ? "0px" : "20px";

             frame.style.width = width;
             frame.style.height = height;
             frame.style.borderRadius = radius;
             frame.style.bottom = bottom;
             frame.style.right = right;
             frame.style.boxShadow = "0 10px 40px rgba(0,0,0,0.2)";
          } else {
             frame.style.width = "80px";
             frame.style.height = "80px";
             frame.style.borderRadius = "50%";
             frame.style.bottom = "20px";
             frame.style.right = "20px";
             frame.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }
        }
      });
  };

  window.ManeeAI = ManeeAI;

})(window, document);