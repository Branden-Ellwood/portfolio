/* Theme: light/dark toggle + shared helpers. Load this in <head> on every page so the saved theme applies before first paint. */
window.App = window.App || {};
(function () {
  var root = document.documentElement, listeners = [];
  App.reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  App.isDark = function () {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  };
  App.onThemeChange = function (fn) { listeners.push(fn); };
  function changed() { listeners.forEach(function (f) { f(); }); }

  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme');
    if (btn) btn.onclick = function () {
      var next = App.isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      changed();
    };
  });
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change', changed);
})();
