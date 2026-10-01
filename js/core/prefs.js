/**
 * @file        prefs.js
 * @description Theme + language preferences (localStorage), slider toggles.
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @license     GPL-3.0
 */
(function () {
  'use strict';

  const THEME_KEY = 'taraTheme';
  const LANG_KEY = 'taraLang';

  const memoryPrefs = {};
  function readPref(key) {
    try {
      return localStorage.getItem(key) || memoryPrefs[key];
    } catch {
      return memoryPrefs[key];
    }
  }
  function writePref(key, value) {
    memoryPrefs[key] = value;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Folder mode also works when browser storage is blocked. */
    }
  }

  function getTheme() {
    return readPref(THEME_KEY) === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    writePref(THEME_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
    const sw = document.getElementById('toggleTheme');
    // Slider: left (unchecked) = dark/moon, right (checked) = light/sun
    if (sw) sw.checked = next === 'light';
    return next;
  }

  function toggleTheme() {
    return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function getLang() {
    return readPref(LANG_KEY) === 'en' ? 'en' : 'de';
  }

  function setLang(lang) {
    const next = lang === 'en' ? 'en' : 'de';
    const prev = getLang();
    if (typeof window.beforeTaraLangChange === 'function') {
      try {
        window.beforeTaraLangChange(prev, next);
      } catch (_) {
        /* ignore */
      }
    }
    writePref(LANG_KEY, next);
    document.documentElement.setAttribute('lang', next);
    document.documentElement.setAttribute('data-lang', next);
    const sw = document.getElementById('toggleLang');
    // Slider: left (unchecked) = EN, right (checked) = DE
    if (sw) sw.checked = next === 'de';
    if (typeof window.applyUiI18n === 'function') window.applyUiI18n(next);
    if (typeof window.onTaraLangChanged === 'function') {
      try {
        window.onTaraLangChanged(next);
      } catch (_) {
        /* ignore */
      }
    }
    return next;
  }

  function toggleLang() {
    return setLang(getLang() === 'de' ? 'en' : 'de');
  }

  function applyPrefsOnLoad() {
    setTheme(getTheme());
    setLang(getLang());
  }

  window.TaraPrefs = {
    getTheme,
    setTheme,
    toggleTheme,
    getLang,
    setLang,
    toggleLang,
    applyPrefsOnLoad,
  };
})();
