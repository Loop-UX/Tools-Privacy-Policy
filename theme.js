// Follows the viewer's light or dark theme, as the Loop UX design system asks.
(function () {
  var query = window.matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    document.documentElement.setAttribute("data-theme", query.matches ? "dark" : "light");
  }
  apply();
  query.addEventListener("change", apply);
})();
