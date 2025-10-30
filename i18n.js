/**
 * Simple JSON-based i18n with session caching and fallback.
 * - Loads language files from /i18n/{lang}.json
 * - Caches in sessionStorage as i18n:{lang}
 * - Applies [data-i18n] keys to textContent
 */

const I18N_DEFAULT = "en";
const I18N_SUPPORTED = ["en", "hi", "as"];
const I18N_STORAGE_KEY = "i18n:lang";
const I18N_CACHE_PREFIX = "i18n:cache:";

/** Get chosen language (session or default) */
function getLang() {
  const stored = sessionStorage.getItem(I18N_STORAGE_KEY);
  const urlParam = new URLSearchParams(location.search).get("lang");
  const candidate = urlParam || stored || navigator.language.slice(0, 2);
  return I18N_SUPPORTED.includes(candidate) ? candidate : I18N_DEFAULT;
}

/** Persist chosen language */
function setLang(lang) {
  sessionStorage.setItem(I18N_STORAGE_KEY, lang);
}

/** Fetch translations with cache and fallback to default */
async function loadTranslations(lang) {
  const cacheKey = I18N_CACHE_PREFIX + lang;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch(`i18n/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("load fail");
    const data = await res.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (e) {
    if (lang !== I18N_DEFAULT) {
      return loadTranslations(I18N_DEFAULT);
    }
    return {};
  }
}

/** Apply translations to all [data-i18n] elements */
function applyTranslations(dict) {
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(node => {
    const key = node.getAttribute("data-i18n");
    const val = getByPath(dict, key);
    if (typeof val === "string") {
      node.textContent = val;
    }
  });
  // Update page title if present
  const titleKey = document.querySelector("title[data-i18n]");
  if (titleKey) {
    const key = titleKey.getAttribute("data-i18n");
    const val = getByPath(dict, key);
    if (typeof val === "string") document.title = val;
  }
}

/** Utility: resolve deep key paths like "hero.title" */
function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

// Boot i18n
document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("lang");
  const current = getLang();
  select.value = current;

  const dict = await loadTranslations(current);
  applyTranslations(dict);

  select.addEventListener("change", async e => {
    const chosen = e.target.value;
    setLang(chosen);
    const d = await loadTranslations(chosen);
    applyTranslations(d);
    // Update URL param without reload
    const url = new URL(window.location.href);
    url.searchParams.set("lang", chosen);
    history.replaceState(null, "", url.toString());
  });
});

