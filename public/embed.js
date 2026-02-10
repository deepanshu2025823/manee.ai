(function(window, document) {
  if (window.ManeeAI) {
    console.warn("ManeeAI: Script already loaded.");
    return;
  }

  var ManeeAI = {};

  ManeeAI.init = function(config) {
    if (!config || !config.apiKey) {
      console.error("ManeeAI: API Key is required to initialize.");
      return;
    }

    if (document.getElementById("manee-chat-frame")) {
      return;
    }

    var domain = "https://manee-ai.vercel.app";

    var iframe = document.createElement("iframe");
    iframe.id = "manee-chat-frame";
    iframe.src = domain + "/embed?apiKey=" + encodeURIComponent(config.apiKey);

    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowTransparency", "true");
    iframe.setAttribute("allow", "clipboard-read; clipboard-write; microphone"); 
    
    Object.assign(iframe.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "80px",
      height: "80px",
      border: "none",
      zIndex: "2147483647",
      background: "transparent",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "50%",
      transition: "width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease",
      maxHeight: "100vh",
      maxWidth: "100vw"
    });

    document.body.appendChild(iframe);
    console.log("ManeeAI: Chat widget initialized");

    window.addEventListener("message", function(event) {

      if (event.data && event.data.type === "MANEE_RESIZE") {
        var frame = document.getElementById("manee-chat-frame");
        if (!frame) return;

        var isMobile = window.innerWidth < 450;
        var isOpen = event.data.status === "open";

        if (isOpen) {
          Object.assign(frame.style, {
            width: isMobile ? "100%" : "400px",
            height: isMobile ? "100%" : "600px",
            borderRadius: isMobile ? "0px" : "12px",
            bottom: isMobile ? "0px" : "20px",
            right: isMobile ? "0px" : "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          });
        } else {
          Object.assign(frame.style, {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            bottom: "20px",
            right: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          });
        }
      }
    });
  };

  window.ManeeAI = ManeeAI;

})(window, document);