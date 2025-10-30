/**
 * Page-specific interactions and lightweight enhancements.
 * Keeps non-i18n logic separate for maintainability.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth skip to features
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Example: reputation & quadratic voting explainer toggle (future hook)
  // You can extend this to show formulas, examples, or interactive demos.
});

