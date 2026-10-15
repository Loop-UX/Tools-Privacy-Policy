// Marks the section in view in the list of sections at the side and in the
// bar that replaces it on narrow screens, opens the rail with that section's
// parts below its link, and marks the part in view. Keeps the marked link in sight when the
// bar scrolls sideways, and fades the end of the bar that has more links beyond it. Shows
// a button back to the top once the headline is out of sight. Without this script the
// links still work.
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

  var hero = document.querySelector(".hero");
  var foot = document.querySelector(".foot");
  var toTop = document.createElement("a");
  toTop.className = "to-top lx-iconbtn lx-iconbtn--white";
  toTop.href = "#top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z"/></svg>';
  document.body.appendChild(toTop);

  // The button shows below the headline and hides where the closing bar has its own link.
  function showToTop() {
    var below = hero && hero.getBoundingClientRect().bottom < 0;
    var atFoot = foot && foot.getBoundingClientRect().top < window.innerHeight;
    toTop.classList.toggle("is-visible", Boolean(below && !atFoot));
  }

  // Fades each end of the bar that has more links beyond it.
  function edges() {
    if (!scroller) return;
    var rest = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
    bar.classList.toggle("has-more-before", scroller.scrollLeft > 1);
    bar.classList.toggle("has-more-after", rest > 1);
  }

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
    showToTop();
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
  window.addEventListener("resize", edges);
  if (scroller) scroller.addEventListener("scroll", edges, { passive: true });
  window.addEventListener("hashchange", update);
  window.addEventListener("load", update);
  update();
  edges();
  // From the next frame on, the rail opens and closes with motion.
  if (side) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { side.classList.add("is-ready"); });
    });
  }
})();
