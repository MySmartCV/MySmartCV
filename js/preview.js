// js/preview.js – Improved Live Preview
"use strict";

const iframe = document.getElementById("cv-preview");
const scaleWrapper = document.querySelector(".preview-scale-wrap") || document.querySelector(".preview-scale-wrapper");

const CV_WIDTH = 794;
const PAD = 64;

let isFirstLoad = true;

function updatePreview(renderedHTML) {
  if (!iframe) return;

  // Fallback: if renderedHTML is empty, show a message
  if (!renderedHTML || !renderedHTML.trim()) {
    renderedHTML = `<body style="padding:40px;font-family:sans-serif;color:#666;">
      <h2>Nothing to preview</h2>
      <p>The template is empty or not loaded yet.</p>
    </body>`;
  }

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(renderedHTML);
  doc.close();

  // Wait for content to load before scaling
  if (isFirstLoad) {
    iframe.onload = () => {
      fitScale();
      isFirstLoad = false;
    };
  } else {
    // Small delay for dynamic content
    setTimeout(fitScale, 50);
  }
}

function fitScale() {
  if (!scaleWrapper || !iframe) return;

  const panel = document.querySelector(".panel--preview");
  if (!panel) return;
  const panelW = panel.clientWidth;
  const available = panelW - PAD * 2;
  const isMobile = window.innerWidth <= 820;
  const minScale = isMobile ? 0.2 : 0.4;
  const scale = Math.max(minScale, Math.min(1, available / CV_WIDTH));

  scaleWrapper.style.setProperty("--preview-scale", scale);

  const naturalH = scaleWrapper.offsetHeight || 1123;
  const scaledH = naturalH * scale;
  scaleWrapper.style.marginBottom = `${scaledH - naturalH + PAD}px`;
}

// Re-scale on resize
const resizeObserver = new ResizeObserver(() => {
  setTimeout(fitScale, 100);
});
resizeObserver.observe(document.querySelector(".panel--preview"));

// Also re-scale when toggling preview-only mode
const toggleBtn = document.getElementById("btn-toggle-preview") || document.getElementById("btn-preview-toggle");
toggleBtn?.addEventListener("click", () => {
  setTimeout(fitScale, 300);
});

// Expose globally
window.updatePreview = updatePreview;
