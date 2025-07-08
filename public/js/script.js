// Ikiform Embed Script v0.1

// Ikiform Embed Script v0.2 with customizable container and auto-resize
(function () {
  function injectIframe(el, formId) {
    var iframe = document.createElement("iframe");
    var baseUrl = window.location.origin + "/forms/" + formId + "/embed";
    var params = [];
    // Pass fit, width, height, padding as query params for iframe
    if (el.dataset.fit)
      params.push("fit=" + encodeURIComponent(el.dataset.fit));
    if (el.dataset.width)
      params.push("width=" + encodeURIComponent(el.dataset.width));
    if (el.dataset.height)
      params.push("height=" + encodeURIComponent(el.dataset.height));
    if (el.dataset.padding)
      params.push("padding=" + encodeURIComponent(el.dataset.padding));
    if (el.dataset.theme)
      params.push("theme=" + encodeURIComponent(el.dataset.theme));
    var src = baseUrl + (params.length ? "?" + params.join("&") : "");
    iframe.src = src;
    // Clamp width to a max (e.g., 700px)
    var maxWidth = 700;
    var widthValue = el.dataset.width ? parseInt(el.dataset.width, 10) : null;
    if (widthValue && widthValue > maxWidth) widthValue = maxWidth;
    iframe.style.width = widthValue ? widthValue + "px" : "100%";
    iframe.style.maxWidth = "100%";
    if (el.dataset.height === "auto" || el.dataset.fit === "fit") {
      iframe.style.height = "100vh"; // Fallback height until auto-resize
      iframe.style.minHeight = "300px";
    } else if (el.dataset.height) {
      iframe.style.minHeight = el.dataset.height;
      iframe.style.height = el.dataset.height;
    } else {
      iframe.style.minHeight = "500px";
    }
    iframe.style.border = "none";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("id", "ikiform-embed-" + formId);
    iframe.style.display = "block";
    // Listen for postMessage to auto-resize height
    window.addEventListener("message", function (event) {
      if (
        event.data &&
        event.data.ikiformEmbedHeight &&
        event.data.formId === formId
      ) {
        iframe.style.height = event.data.ikiformEmbedHeight + "px";
        iframe.style.minHeight = event.data.ikiformEmbedHeight + "px";
      }
    });
    el.appendChild(iframe);
  }

  function initIkiformEmbeds() {
    var nodes = document.querySelectorAll("[data-ikiform-id]");
    nodes.forEach(function (el) {
      var formId = el.getAttribute("data-ikiform-id");
      if (formId && !el.querySelector("iframe")) {
        injectIframe(el, formId);
      }
    });
  }

  // Expose a global function for programmatic re-initialization
  window.ikiformEmbedInit = function (el) {
    if (!el) return;
    var formId = el.getAttribute("data-ikiform-id");
    // Remove all iframes inside el
    var iframes = el.querySelectorAll("iframe");
    iframes.forEach(function (iframe) {
      el.removeChild(iframe);
    });
    if (formId) {
      injectIframe(el, formId);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIkiformEmbeds);
  } else {
    initIkiformEmbeds();
  }
})();
