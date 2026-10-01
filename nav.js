// Marks the section in view in the list of sections at the side and in the
// bar that replaces it on narrow screens, opens the rail with that section's
// parts below its link, and marks the part in view. Keeps the marked link in sight when the
// bar scrolls sideways. Without this script the links still work.
(function () {
  var toArray = function (list) { return Array.prototype.slice.call(list); };
  var targetOf = function (link) { return document.getElementById(link.getAttribute("href").slice(1)); };

  var bar = document.querySelector(".sections");
  var side = document.querySelector(".side");
  var scroller = bar && bar.querySelector(".sections__inner");
  var barLinks = bar ? toArray(bar.querySelectorAll("a")) : [];
  var sideLinks = side ? toArray(side.querySelectorAll(".side__list > li > a")) : [];
  var sections = (sideLinks.length ? sideLinks : barLinks).map(targetOf);
  if (!sections.length) return;
  // For each section, the links to its parts.
  var parts = sideLinks.map(function (link) {
    return toArray(link.parentNode.querySelectorAll(".side__sub a"));
  });
  var current = -1;
  var currentPart = null;
  var openTimer = 0;

  // Opens the rail of the section in view and closes the others.
  function openParts() {
    sideLinks.forEach(function (link, i) {
      link.parentNode.classList.toggle("is-open", i === current);
    });
  }

  function mark(links, index) {
    links.forEach(function (link, i) {
      if (i === index) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  // The last of the targets whose top has passed the line, or -1.
  function lastAbove(targets, line) {
    var found = -1;
    targets.forEach(function (target, i) {
      if (target && target.getBoundingClientRect().top <= line) found = i;
    });
    return found;
  }

  function update() {
    // A line a quarter of the way down the window, below the bar where the bar shows.
    var line = (bar ? bar.getBoundingClientRect().bottom : 0) + Math.min(window.innerHeight / 4, 240);
    var next = Math.max(0, lastAbove(sections, line));
    // At the end of the page the last section is in view, however short it is.
    var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atEnd) next = sections.length - 1;

    if (next !== current) {
      var first = current === -1;
      current = next;
      mark(sideLinks, current);
      mark(barLinks, current);
      // The pill moves at once. The rail waits until the scrolling settles on
      // a section, so the list doesn't open and close on the way past others.
      window.clearTimeout(openTimer);
      if (first) openParts();
      else openTimer = window.setTimeout(openParts, 160);
      if (scroller && barLinks[current]) {
        var link = barLinks[current];
        scroller.scrollTo({ left: link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2 });
      }
    }

    var links = parts[current] || [];
    var part = links[lastAbove(links.map(targetOf), line)] || null;
    // At the end of the page the last parts never reach the line: mark the
    // one the address names, or else the last one.
    if (atEnd && links.length) {
      var named = links.filter(function (link) { return link.getAttribute("href") === window.location.hash; })[0];
      part = named || links[links.length - 1];
    }
    if (part !== currentPart) {
      if (currentPart) currentPart.removeAttribute("aria-current");
      if (part) part.setAttribute("aria-current", "location");
      currentPart = part;
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("hashchange", update);
  window.addEventListener("load", update);
  update();
  // From the next frame on, the rail opens and closes with motion.
  if (side) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { side.classList.add("is-ready"); });
    });
  }
})();
