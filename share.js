// Puts a link icon after each heading in the panels that copies the address of
// that section or part, and says so in a short note. Nothing leaves the browser.
// Without this script the page and its links work as before.
(function () {
  var forEach = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  // The address of the page without a query, for links that are copied.
  var base = window.location.origin + window.location.pathname;

  var ICON_LINK = '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M280-280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h120q17 0 28.5 11.5T440-640q0 17-11.5 28.5T400-600H280q-50 0-85 35t-35 85q0 50 35 85t85 35h120q17 0 28.5 11.5T440-320q0 17-11.5 28.5T400-280H280Zm80-160q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h240q17 0 28.5 11.5T640-480q0 17-11.5 28.5T600-440H360Zm200 160q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h120q50 0 85-35t35-85q0-50-35-85t-85-35H560q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h120q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H560Z"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"/></svg>';

  // A short note at the bottom of the window once something is copied.
  var toast = document.createElement("div");
  toast.className = "toast lx-toast lx-toast--success";
  toast.setAttribute("role", "status");
  toast.innerHTML = '<span class="lx-toast__icon">' + ICON_CHECK + '</span><span class="lx-toast__text"><span class="lx-toast__title"></span></span>';
  document.body.appendChild(toast);
  var toastTimer = 0;
  function say(text) {
    toast.querySelector(".lx-toast__title").textContent = text;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2400);
  }

  function copy(text) {
    if (!navigator.clipboard || !window.isSecureContext) return Promise.reject(new Error("no clipboard"));
    return navigator.clipboard.writeText(text);
  }

  // The link icons. A section's heading links to the section, a part's heading to the part.
  forEach(document.querySelectorAll(".panel h2, .panel h3"), function (heading) {
    var id = heading.id || heading.closest(".panel").id;
    if (!id) return;
    var link = document.createElement("a");
    link.className = "heading-link";
    link.href = "#" + id;
    link.setAttribute("aria-label", "Copy the link to “" + heading.textContent.trim() + "”");
    link.innerHTML = ICON_LINK;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      copy(base + "#" + id).then(function () {
        window.history.replaceState(null, "", "#" + id);
        say("Link copied");
      }, function () {
        // Without the clipboard, go to the part: its address is then in the address bar.
        window.location.hash = id;
      });
    });
    heading.appendChild(link);
  });
})();
